import { NextFunction, Request, Response } from "express";
import { access, existsSync, constants } from "fs";
import FileRepository from "@models/file/file.repository.js";
import UserRepository from "@models/user/user.repository.js";
import sendError from "@utils/lib/responseHelpers/error.js";

class FileUploaderMiddleware {
  static async checkFileExist(req: Request, res: Response, next: NextFunction) {
    try {
      const user = req.user;
      UserRepository.assertUser(user);

      const { id: fileId } = req.params;
      if (isNaN(Number(fileId))) throw new Error(`FileId is not a number`);

      const fileDbData = await FileRepository.getFile(user.id, Number(fileId));
      if (!fileDbData)
        throw new Error(`User doesn't own this file or file doesn't exist`);

      if (existsSync(fileDbData.file_path)) {
        access(
          fileDbData.file_path,
          constants.R_OK | constants.W_OK,
          () => {}
        );
      }
      req.fileDate = fileDbData;

      next();
    } catch (error) {
      sendError(res, error);
    }
  }
}

export default FileUploaderMiddleware;
