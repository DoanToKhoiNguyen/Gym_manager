import express from "express";
import cors from "cors";
import { packageRouter } from "./routes/package.routes";
import { memberRouter } from "./routes/member.routes";
import { errorMiddleware } from "./middlewares/error.middleware";

export const app = express();

app.use(cors());
app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/packages", packageRouter);
app.use("/api/packages", packageRouter);
app.use("/api/members", memberRouter);
// Luôn đặt cuối cùng
app.use(errorMiddleware);