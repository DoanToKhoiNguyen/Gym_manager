import type { NextFunction, Request, Response } from "express";
import { AUTH_COOKIE_NAME } from "../config/auth";
import { authService } from "../services/auth.service";
import { loginSchema } from "../validators/auth.validator";

const isProd = process.env.NODE_ENV === "production";
const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;

export const authController = {
  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { username, password } = loginSchema.parse(req.body);
      const { token, user } = await authService.login(username, password);

      res.cookie(AUTH_COOKIE_NAME, token, {
        httpOnly: true,
        sameSite: "lax",
        secure: isProd,
        maxAge: SEVEN_DAYS_MS,
        path: "/",
      });

      res.json({ user });
    } catch (err) {
      next(err);
    }
  },

  logout(_req: Request, res: Response) {
    res.clearCookie(AUTH_COOKIE_NAME, { path: "/" });
    res.status(204).send();
  },

  me(req: Request, res: Response) {
    res.json({ user: req.user });
  },
};