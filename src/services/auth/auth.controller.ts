import { Request, Response } from "express";
import sendError from "@utils/lib/responseHelpers/error.js";
import AuthService from "./auth.service.js";
import sendResponse from "@utils/lib/responseHelpers/response.js";
import UserRepository from "@models/user/user.repository.js";

class AuthController {
  static async signin(req: Request, res: Response) {
    try {
      const { id, password } = req.body;
      if (!id || !password) throw new Error(`Missing fields`);

      const tokens = await AuthService.signin(id, password);

      sendResponse(res, JSON.stringify(tokens));
    } catch (error) {
      sendError(res, error);
    }
  }

  static async signup(req: Request, res: Response) {
    try {
      const { id, password } = req.body;
      if (!id || !password) throw new Error(`Missing fields`);

      const tokens = await AuthService.signup(id, password)

      sendResponse(res, JSON.stringify(tokens));
    } catch (error) {
      sendError(res, error);
    }
  }

  static async newToken(req: Request, res: Response) {
    try {
      const redisSessionData = req.redisSessionData;
      if (!redisSessionData) throw new Error(`There is not redisSessionData`);

      const token = await AuthService.newToken(redisSessionData.refreshToken);

      sendResponse(res, token);
    } catch (error) {
      sendError(res, error);
    }
  }

  static async info(req: Request, res: Response) {
    try {
      const user = req.user;
      UserRepository.assertUser(user);

      const info = await AuthService.info(user.id);

      sendResponse(res, info);
    } catch (error) {
      sendError(res, error);
    }
  }

  static async logout(req: Request, res: Response) {
    try {
      const user = req.user;
      UserRepository.assertUser(user);

      await AuthService.logout(user.id, user.sessionId);

      sendResponse(res, "signin successfully");
    } catch (error) {
      sendError(res, error);
    }
  }

  static async logoutAll(req: Request, res: Response) {
    try {
      const user = req.user;
      UserRepository.assertUser(user);

      await AuthService.logoutAll(user.id, user.sessionId);

      sendResponse(res, "signin successfully");
    } catch (error) {
      sendError(res, error);
    }
  }

  
}

export default AuthController;
