import { Request, Response } from "express";
import FileRepository from "@models/file/file.repository.js";
import UserRepository from "@models/user/user.repository.js";
import MulterStorage from "@utils/lib/multer/multer.js";
import sendError from "@utils/lib/responseHelpers/error.js";
import sendResponse from "@utils/lib/responseHelpers/response.js";
import FileService from "./fileUploader.service.js";
import { unlink } from "fs/promises";

class FileUploaderController {
  static async deleteFile(req: Request, res: Response) {
    try {
      const user = req.user;
      UserRepository.assertUser(user);
      const file = req.fileDate;
      if (!file) throw new Error(`There is not file`);

      await FileService.deleteFile(user.id, file);

      sendResponse(res, "Delete file");
    } catch (error) {
      sendError(res, { message: "Fail in deleteFile" });
    }
  }

  static async updateFile(req: Request, res: Response) {
    try {
      // data 
      const file = req.file;
      const oldFile = req.fileDate
      const user = req.user;
      UserRepository.assertUser(user);
      if (!file) throw new Error(`There is not file`);
      if (!oldFile) throw new Error(`There is not file`);
      

      // update data
      let newFile;
      try {
        newFile = await FileService.updateFile(user.id, oldFile, file);
      } catch (error) {
        if (file?.path) {
          try {
            await unlink(file.path);
          } catch (fsErr) {
            console.error("Failed to delete temp uploaded file:", fsErr);
          }
        }
        throw error
      }

      sendResponse(res, newFile);
    } catch (error) {
      sendError(res, { message: "Failed in updateFile" });
    }
  }

  static async downloadFile(req: Request, res: Response) {
    try {
      const user = req.user;
      UserRepository.assertUser(user);

      const { id: fileId } = req.params;
      if (isNaN(Number(fileId))) throw new Error(`file id is not a number`)

      const filePath = await FileService.downloadFile(user.id, Number(fileId));
      if (!filePath) throw new Error(`filePath is null`);

      res.download(filePath);
    } catch (error) {
      sendError(res, { message: "Fail in deleteFile" });
    }
  }

  static async uploadFile(req: Request, res: Response) {
    const file = req.file;
    try {
      const user = req.user;
      UserRepository.assertUser(user);
      MulterStorage.assertFile(file);

      const newFile = await FileService.uploadFile(user.id, file);

      sendResponse(res, newFile);
    } catch (error) {
      if (file?.path) {
        try {
          await unlink(file.path);
        } catch (fsErr) {
          console.error("Failed to delete temp file:", fsErr);
        }
      }

      sendError(res, { message: "Failed in uploadFile" });
    }
  }

  static async fileInfo(req: Request, res: Response) {
    try {
      const user = req.user;
      UserRepository.assertUser(user);

      const { id: fileId } = req.params;
      if (isNaN(Number(fileId))) throw new Error(`fileid is not a number`)

      const file = await FileService.fileInfo(user.id, Number(fileId));

      sendResponse(res, file);
    } catch (error) {
      sendError(res, { message: "Fail in fileInfo" });
    }
  }

  static async listFiles(req: Request, res: Response) {
    try {
      const user = req.user;
      UserRepository.assertUser(user);

      const query = req.query;
      const list_size = query?.list_size || 10;
      const page = query?.page || 1;
      if (isNaN(Number(list_size)) || isNaN(Number(page)))
        throw new Error(`list_size or pag are not a numbers`);

      const files = await FileRepository.getFilesByUserId(
        user.id,
        Number(list_size),
        Number(page)
      );

      sendResponse(res, files);
    } catch (error) {
      sendError(res, { message: "Fail in listFiles" });
    }
  }
}

export default FileUploaderController;
