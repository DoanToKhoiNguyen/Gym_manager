import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { authRouter } from "./routes/auth.routes";
import { packageRouter } from "./routes/package.routes";
import { memberRouter } from "./routes/member.routes";
import { requireAuth } from "./middlewares/auth.middleware";
import { errorMiddleware } from "./middlewares/error.middleware";

export const app = express();

app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(cookieParser());
app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});

// Công khai, không cần đăng nhập
app.use("/api/auth", authRouter);

// Từ đây trở đi bắt buộc đăng nhập
app.use("/api/packages", requireAuth, packageRouter);
app.use("/api/members", requireAuth, memberRouter);

// Luôn đặt cuối cùng
app.use(errorMiddleware);