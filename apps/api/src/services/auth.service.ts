import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma } from "../config/prisma";
import { AppError } from "../errors/AppError";

function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("Thiếu JWT_SECRET trong file .env");
  return secret;
}

export interface TokenPayload {
  sub: number;
  username: string;
}

export const authService = {
  async login(username: string, password: string) {
    const user = await prisma.user.findUnique({ where: { username } });
    if (!user) {
      throw new AppError(401, "INVALID_CREDENTIALS", "Sai tên đăng nhập hoặc mật khẩu");
    }

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) {
      throw new AppError(401, "INVALID_CREDENTIALS", "Sai tên đăng nhập hoặc mật khẩu");
    }

    const token = jwt.sign(
      { sub: user.id, username: user.username } satisfies TokenPayload,
      getJwtSecret(),
      { expiresIn: "7d" },
    );

    return {
      token,
      user: { id: user.id, username: user.username, fullName: user.fullName },
    };
  },

  verifyToken(token: string): TokenPayload {
    try {
      return jwt.verify(token, getJwtSecret()) as TokenPayload;
    } catch {
      throw new AppError(401, "UNAUTHORIZED", "Phiên đăng nhập không hợp lệ hoặc đã hết hạn");
    }
  },
};