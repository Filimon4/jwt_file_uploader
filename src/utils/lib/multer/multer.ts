import multer from "multer";

class MulterStorage {
  static storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, String(process.env.UPLOAD_DIR));
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

  static assertFile(data: unknown):asserts data is Express.Multer.File {
    if (!data || typeof data !== "object") throw new Error(`Is not a File`);
    const isFile = data as Express.Multer.File
    if (!isFile['path'] || !isFile['mimetype'] || !isFile['size'] || !isFile['originalname']) throw new Error(`Is not a File`)
  }
}

export default MulterStorage;
