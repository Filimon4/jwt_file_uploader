import UserRepository from "../../models/user/user.repository.js";
import Hash from "../../utils/hash/hash.utils.js";
import JWT from "../../utils/jwt/jwt.utils.js";
import RedisClient from "../../utils/lib/redis/redis.js";
import {
  getBlacklistToken,
  getUserSession,
  TokenStatus,
} from "../../utils/lib/redis/redis.utils.js";

class AuthService {
  static async signin(id: string, password: string) {
    const existUser = await UserRepository.findOne(id);
    if (!existUser) throw new Error("There is not user");

    if (!await Hash.comparePasswords(password, existUser.password))
      throw new Error("Wrong password");

    // jwt
    const sessionId = crypto.randomUUID();
    const tokens = JWT.generatePairTokens({
      id: existUser.id,
      sessionId: sessionId,
    });

    // redis
    const redisClient = await RedisClient.getRedisClient() 
    await redisClient.hSetNX(
      getUserSession(existUser.id),
      sessionId,
      JSON.stringify(tokens)
    );

    return tokens;
  }

  static async signup(id: string, password: string) {
    const existUser = await UserRepository.findOne(id);
    if (existUser) throw new Error("There is such user");

    const hashPassword = await Hash.hashPassword(password);
    const dbUser = await UserRepository.create({
      id: id,
      password: hashPassword,
    });
    const newUser = await UserRepository.insertOneUser(dbUser);

    // jwt
    const sessionId = crypto.randomUUID();
    const tokens = JWT.generatePairTokens({
      id: newUser.id,
      sessionId: sessionId,
    });

    //redis
    const redisClient = await RedisClient.getRedisClient();
    await redisClient.hSet(
      getUserSession(newUser.id),
      sessionId,
      JSON.stringify(tokens)
    );

    return tokens;
  }

  static async newToken(refreshToken: string) {
    const redisClient = await RedisClient.getRedisClient();
    // user
    const user = JWT.verifyToken(refreshToken);
    UserRepository.assertUser(user);

    const newAccessToken = JWT.generateAccessToken({
      id: user.id,
      sessionId: user.sessionId,
    });

    await redisClient.hSet(
      getUserSession(user.id),
      user.sessionId,
      JSON.stringify({
        accessToken: newAccessToken,
        refreshToken: refreshToken,
      })
    );

    return {
      accessToken: newAccessToken,
    };
  }

  static async info(id: string) {
    const user = await UserRepository.findOne(id);
    if (!user) throw new Error(`There is not user`)
    return {
      id: user.id
    };
  }

  static async logout(id: string, sessionId: string) {
    const redisClient = await RedisClient.getRedisClient();

    // session
    const sessionData = await redisClient.hGet(getUserSession(id), sessionId);
    if (!sessionData) throw new Error(`There is not sessionData`);
    const { accessToken, refreshToken } = JSON.parse(sessionData);

    //redis
    await redisClient.set(getBlacklistToken(accessToken), TokenStatus.revoked);
    await redisClient.set(getBlacklistToken(refreshToken), TokenStatus.revoked);
    await redisClient.hDel(getUserSession(id), sessionId);
  }

  static async logoutAll(id: string, sessionId: string) {
    const redisClient = await RedisClient.getRedisClient();

    // session
    const sessionData = await redisClient.hGet(getUserSession(id), sessionId);
    if (!sessionData) throw new Error(`There is not sessionData`);

    const allSessions = await redisClient.hGetAll(`user:session:${id}`);
    const garbageSessions = Object.keys(allSessions).filter((s)=>s !== sessionId);

    for (const sessionKey of garbageSessions) {
      const { accessToken, refreshToken } = JSON.parse(allSessions[sessionKey])
      await redisClient.set(getBlacklistToken(accessToken), TokenStatus.revoked);
      await redisClient.set(getBlacklistToken(refreshToken), TokenStatus.revoked);
      await redisClient.hDel(getUserSession(id), sessionId);
    }
  }
}

export default AuthService;
