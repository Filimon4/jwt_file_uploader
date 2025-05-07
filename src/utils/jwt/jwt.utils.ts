import jwt from "jsonwebtoken";
import jwtConfig from "@config/jwt.config.js";
import { PairJwtToken, TokenPayload } from "./jwt.types.js";

class JWT {
  static generatePairTokens(payload: TokenPayload): PairJwtToken {
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

  static assertPairJwtTokens(data: unknown): asserts data is PairJwtToken {
    if (!data || typeof data !== "object")
      throw new Error(`Is not a PairJwtToken`);
    const dataTokens = data as PairJwtToken;
    if (!dataTokens.accessToken || !dataTokens.refreshToken)
      throw new Error(`Is not a PairJwtToken`);
  }
}

export default JWT;
