import "express";
import { UserPayload } from "../utils/jwt/jwt.types";
import { File } from "../models/file/file.entity";

declare global {
  namespace Express {
    interface Request {
      user?: UserPayload;
      deviceData?: any;
      redisSessionData?: any;
      fileDate?: File;
    }
  }
}
