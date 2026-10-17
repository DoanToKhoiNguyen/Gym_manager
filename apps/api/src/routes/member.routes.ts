import { Router } from "express";
import { memberController } from "../controllers/member.controller";

export const memberRouter = Router();

memberRouter.get("/", memberController.list);
memberRouter.get("/preview-expiry", memberController.previewExpiry);
memberRouter.get("/:id", memberController.getById);
memberRouter.post("/", memberController.create);
memberRouter.put("/:id", memberController.update);
memberRouter.delete("/:id", memberController.remove);