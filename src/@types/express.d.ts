import "express";
import { PairJwtToken, UserPayload } from "@utils/jwt/jwt.types";
import { File } from "@models/file/file.entity";
import { DeviceData } from "@src/middleware/globalUaParser";

declare global {
  namespace Express {
    interface Request {
      user?: UserPayload;
      deviceData?: DeviceData;
      redisSessionData?: PairJwtToken;
      fileDate?: File;
    }
  }
}
