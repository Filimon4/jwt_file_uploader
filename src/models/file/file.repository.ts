import DB from "@models/index.js";
import { File } from "./file.entity.js";

class FileRepository {
  static async createDBFile(
    fileData: Pick<
      File,
      "filename" | "mime_type" | "size" | "user_id" | "file_path"
    >
  ) {
    const file = await DB.getRepository(File).create({
      filename: fileData.filename,
      mime_type: fileData.mime_type,
      size: fileData.size,
      user_id: fileData.user_id,
      file_path: fileData.file_path,
    });
    return file;
  }

  static mergeWithExistFile(file: File, mFile: Partial<File>) {
    return DB.getRepository(File).merge(file, mFile);
  }

  static async insertFile(file: File) {
    const insertResult = await DB.getRepository(File).insert(file);
    if (insertResult.identifiers.length === 0)
      throw new Error("Failed to save all files");
    file.id = insertResult.identifiers[0].id;
    return file;
  }

  static async insertFiles(files: File[]) {
    const insertResult = await DB.getRepository(File).insert(files);
    if (insertResult.identifiers.length !== files.length)
      throw new Error("Failed to save all files");
    return true;
  }

  static async saveOrUpdateFile(file: File) {
    return await DB.getRepository(File).save(file);
  }

  static async getFilesByUserId(userId: string, listSize = 10, page = 1) {
    const skipAmount = (Math.max(page, 1) - 1) * listSize;
    return await DB.getRepository(File).find({
      where: {
        user_id: userId,
      },
      skip: skipAmount,
      take: listSize,
    });
  }

  static async getFile(userId: string, fileId: number) {
    return await DB.getRepository(File).findOne({
      where: {
        id: fileId,
        user_id: userId,
      },
    });
  }

  static async deleteFile(fileId: number) {
    const file = await DB.getRepository(File).findOne({
      where: {
        id: fileId,
      },
    });
    if (!file) throw new Error(`There is not file ${fileId}`);
    await DB.getRepository(File).remove(file);
  }
}

export default FileRepository;
