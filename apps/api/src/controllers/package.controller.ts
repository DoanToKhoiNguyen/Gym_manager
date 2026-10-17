import type { NextFunction, Request, Response } from "express";
import { packageService } from "../services/package.service";
import {
  createPackageSchema,
  listPackagesQuerySchema,
} from "../validators/package.validator";

export const packageController = {
  async list(req: Request, res: Response, next: NextFunction) {
    try {
      const query = listPackagesQuerySchema.parse(req.query);
      const packages = await packageService.list(query.active === "true");
      res.json(packages);
    } catch (err) {
      next(err);
    }
  },

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const input = createPackageSchema.parse(req.body);
      const created = await packageService.create(input);
      res.status(201).json(created);
    } catch (err) {
      next(err);
    }
  },
};