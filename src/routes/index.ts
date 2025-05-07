import * as express from "express";
import authRouters from "@services/auth/auth.routes.js";
import fileUploadRouters from "@services/fileUploader/fileUploader.routes.js";

const router = express.Router({
  mergeParams: true,
});

router.use("/", [authRouters, fileUploadRouters]);

export default router;
