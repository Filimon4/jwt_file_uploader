import { constants } from "fs";
import { copyFile, access, unlink } from "fs/promises";
import { File } from "@models/file/file.entity.js";
import FileRepository from "@models/file/file.repository.js";
import DB from "@models/index.js";

class FileService {
  static async deleteFile(userId: string, file: File) {
    const backupPath = file.file_path + ".bak";
    try {
      await copyFile(file.file_path, backupPath);
    } catch (err) {
      console.error("Failed to backup file:", err);
      throw new Error("Backup failed. Aborting delete.");
    }

    try {
      await DB.dataSource.transaction(async (em) => {
        const fileRepo = em.getRepository(File);
        try {
          await fileRepo.remove(file);
        } catch (err) {
          console.error("DB delete failed:", err);
          throw new Error("Failed to delete record in DB.");
        }
        try {
          await access(file.file_path, constants.R_OK | constants.W_OK);
          await unlink(file.file_path);
        } catch (err) {
          console.error("Failed to delete file from disk:", err);
          throw new Error(
            "File deleted from DB, but could not delete from disk."
          );
        }
      });
      await unlink(backupPath);
    } catch (error) {
      throw error;
    }
  }

  static async updateFile(userId: string, file: File, newfile: Express.Multer.File) {
    const newDbFile = await FileRepository.createDBFile({
      file_path: newfile.path,
      mime_type: newfile.mimetype,
      filename: newfile.filename,
      size: newfile.size,
      user_id: userId,
    });
    newDbFile.id = file.id
    const newDBFile = await FileRepository.saveOrUpdateFile(newDbFile);
    
    await unlink(file.file_path)
    
    return newDBFile
  }

  static async downloadFile(userId: string, fileId: number) {
    const fileInfo = await this.fileInfo(userId, fileId);
    return fileInfo?.file_path || null;
  }

  static async uploadFile(userId: string, file: Express.Multer.File) {
    const newDbFile = await FileRepository.createDBFile({
      file_path: file.path,
      mime_type: file.mimetype,
      filename: file.filename,
      size: file.size,
      user_id: userId,
    });
    return await FileRepository.insertFile(newDbFile);
  }

  static async fileInfo(userId: string, fileId: number) {
    return await FileRepository.getFile(userId, fileId);
  }

  static async listFiles(userId: string) {
    return await FileRepository.getFilesByUserId(userId);
  }
}

export default FileService;
