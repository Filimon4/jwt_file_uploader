import jwt from "jsonwebtoken";
import jwtConfig from "../../config/jwt.config.js";
import { TokenPayload } from "./jwt.types.js";

class JWT {
  static generatePairTokens(payload: TokenPayload) {
    return {
      accessToken: JWT.generateAccessToken(payload),
      refreshToken: JWT.generateRefreshToken(payload),
    };
  }

  static generateAccessToken(payload: TokenPayload) {
    return jwt.sign(payload, jwtConfig.secret, {
      expiresIn: "10M",
    });
  }

  static generateRefreshToken(payload: TokenPayload) {
    return jwt.sign(payload, jwtConfig.secret, {
      expiresIn: "7D",
    });
  }

  static verifyToken(token: string) {
    return jwt.verify(token, jwtConfig.secret);
  }
}

export default JWT;
