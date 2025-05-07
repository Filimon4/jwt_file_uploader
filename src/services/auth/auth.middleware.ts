import { NextFunction } from "express";
import { Request, Response } from "express";
import UserRepository from "@models/user/user.repository.js";
import JWT from "@utils/jwt/jwt.utils.js";
import RedisClient from "@utils/lib/redis/redis.js";
import {
  getBlacklistToken,
  getUserSession,
  TokenStatus,
} from "@utils/lib/redis/redis.utils.js";
import sendError from "@utils/lib/responseHelpers/error.js";

class AuthMiddleware {
  static async invalidateAccessToken(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      // token
      const { refreshToken } = req.body; // TODO: Переместить из body
      if (!refreshToken) throw new Error("There is not refreshToken in body");
      
      const redisClient = await RedisClient.getRedisClient();

      // jwt
      const user = JWT.verifyToken(refreshToken);
      UserRepository.assertUser(user);

      // redis session
      const sessionData = await redisClient.hGet(
        getUserSession(user.id),
        user.sessionId
      );
      if (!sessionData) throw new Error("There is not session data");
      req.redisSessionData = JSON.parse(sessionData);

      // redis jwt
      const { accessToken: oldAccessToken } = JSON.parse(sessionData);
      await redisClient.set(
        getBlacklistToken(oldAccessToken),
        TokenStatus.revoked,
        {
          EX: 60 * 10, // TODO: Педелать на конфиг
        }
      );

      next();
    } catch (error) {
      sendError(res, { message: "Filed to invalidateAccessToken" });
    }
  }

  static async checkAuthentication(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      // token
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith("Bearer "))
        throw new Error("Invalid token");
      const token = authHeader.split(" ")[1];

      const redisClient = await RedisClient.getRedisClient();

      // jwt
      const user = JWT.verifyToken(token);
      UserRepository.assertUser(user);

      req.user = user;

      //redis
      const sessionExist = await redisClient.hExists(
        getUserSession(user.id),
        user.sessionId
      );
      if (!sessionExist) throw new Error("There is not session");
      const blacklist = await redisClient.get(getBlacklistToken(token));
      if (blacklist) throw new Error("Token in black list");
      // --

      next();
    } catch (error) {
      sendError(res, { message: "Filed to checkAuth" });
    }
  }
}

export default AuthMiddleware;
