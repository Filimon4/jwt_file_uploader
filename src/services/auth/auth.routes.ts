import * as express from "express";
import AuthController from "./auth.controller.js";
import AuthMiddleware from "./auth.middleware.js";

const router = express.Router({
  mergeParams: true,
});

router.post("/v1/signup", AuthController.signup);
router.post("/v1/signin", AuthController.signin);
router.post(
  "/v1/signin/new_token",
  AuthMiddleware.invalidateAccessToken,
  AuthController.newToken
);
router.get("/v1/info", AuthMiddleware.checkAuthentication, AuthController.info);
router.get(
  "/v1/logout",
  AuthMiddleware.checkAuthentication,
  AuthController.logout
);
router.get(
  "/v1/logout_all",
  AuthMiddleware.checkAuthentication,
  AuthController.logoutAll
);

export default router;
