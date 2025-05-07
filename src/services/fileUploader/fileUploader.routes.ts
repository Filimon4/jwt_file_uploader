import * as express from "express";

import FileUploaderMiddleware from "./fileUploader.middleware.js";
import FileUploader from "./fileUploader.controller.js";
import AuthMiddleware from "@services/auth/auth.middleware.js";
import MulterStorage from "@utils/lib/multer/multer.js";

const router = express.Router({
  mergeParams: true,
});

router.use(AuthMiddleware.checkAuthentication);

router.get("/v1/file/list", FileUploader.listFiles);
router.get("/v1/file/:id", FileUploader.fileInfo);
router.post(
  "/v1/file/upload",
  MulterStorage.upload.single("file"),
  FileUploader.uploadFile
);
router.get(
  "/v1/file/download/:id",
  FileUploaderMiddleware.checkFileExist,
  FileUploader.downloadFile
);
router.put(
  "/v1/file/update/:id",
  FileUploaderMiddleware.checkFileExist,
  MulterStorage.upload.single("file"),
  FileUploader.updateFile
);
router.delete(
  "/v1/file/delete/:id",
  FileUploaderMiddleware.checkFileExist,
  FileUploader.deleteFile
);

export default router;
