import { Router } from "express";
import { packageController } from "../controllers/package.controller";

export const packageRouter = Router();

packageRouter.get("/", packageController.list);
packageRouter.post("/", packageController.create);