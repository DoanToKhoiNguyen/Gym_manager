import type { NextFunction, Request, Response } from "express";
import { AUTH_COOKIE_NAME } from "../config/auth";
import { AppError } from "../errors/AppError";
import { authService } from "../services/auth.service";

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      user?: { id: number; username: string };
    }
  }
}

export function requireAuth(req: Request, _res: Response, next: NextFunction) {
  const token = req.cookies?.[AUTH_COOKIE_NAME];
  if (!token) {
    return next(new AppError(401, "UNAUTHORIZED", "Vui lòng đăng nhập"));
  }

  try {
    const payload = authService.verifyToken(token);
    req.user = { id: payload.sub, username: payload.username };
    next();
  } catch (err) {
    next(err);
  }
}