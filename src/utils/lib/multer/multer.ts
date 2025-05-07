import { access, mkdir } from "fs/promises";
import multer from "multer";
import path from "path";

class MulterStorage {
  static async getUploadDir(): Promise<string> {
    const dir = process.env.UPLOAD_DIR;
    if (!dir)
      throw new Error("UPLOAD_DIR is not defined in environment variables");

    const absolutePath = path.resolve(dir);
    console.log(absolutePath)
    try {
      await access(absolutePath);
    } catch {
      console.log('mkdir')
      await mkdir(absolutePath, { recursive: true });
    }
    return absolutePath;
  }

  static storage = multer.diskStorage({
    destination: async function (req, file, cb) {
      const uploadPath = await MulterStorage.getUploadDir();
      cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      const ext = file.originalname.split(".").at(-1);
      cb(null, file.fieldname + "-" + uniqueSuffix + `.${ext}`);
    },
  });

  static upload = multer({
    storage: MulterStorage.storage,
    limits: {
      files: 1,
      fileSize: Number(process.env.UPLOAD_MAX_FILE_SIZE),
    },
  });

  static assertFile(data: unknown): asserts data is Express.Multer.File {
    if (!data || typeof data !== "object") throw new Error(`Is not a File`);
    const isFile = data as Express.Multer.File;
    if (
      !isFile["path"] ||
      !isFile["mimetype"] ||
      !isFile["size"] ||
      !isFile["originalname"]
    )
      throw new Error(`Is not a File`);
  }
}

export default MulterStorage;
