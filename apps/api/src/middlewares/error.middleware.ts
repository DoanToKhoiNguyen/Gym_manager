import type { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import { Prisma } from "@prisma/client";
import { AppError } from "../errors/AppError";

export function errorMiddleware(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
) {
  if (err instanceof AppError) {
    return res.status(err.status).json({
      error: { code: err.code, message: err.message, field: err.field },
    });
  }

  if (err instanceof ZodError) {
    const first = err.issues[0];
    return res.status(400).json({
      error: {
        code: "VALIDATION_ERROR",
        message: first?.message ?? "Dữ liệu không hợp lệ",
        field: first?.path.join("."),
      },
    });
  }

  // Hai request cùng lúc vượt qua bước kiểm tra trùng, DB vẫn chặn bằng UNIQUE
  if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2002") {
    return res.status(409).json({
      error: { code: "DUPLICATED", message: "Dữ liệu đã tồn tại" },
    });
  }

  console.error(err);
  res.status(500).json({
    error: { code: "INTERNAL_ERROR", message: "Lỗi hệ thống" },
  });
}