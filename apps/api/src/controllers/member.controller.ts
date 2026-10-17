import type { NextFunction, Request, Response } from "express";
import { memberService } from "../services/member.service";
import {
  createMemberSchema,
  listMembersQuerySchema,
  memberIdParamSchema,
  previewExpiryQuerySchema,
  updateMemberSchema,
} from "../validators/member.validator";

export const memberController = {
  async list(req: Request, res: Response, next: NextFunction) {
    try {
      const query = listMembersQuerySchema.parse(req.query);
      res.json(await memberService.list(query));
    } catch (err) {
      next(err);
    }
  },

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = memberIdParamSchema.parse(req.params);
      res.json(await memberService.getById(id));
    } catch (err) {
      next(err);
    }
  },

  async previewExpiry(req: Request, res: Response, next: NextFunction) {
    try {
      const { packageId, startDate } = previewExpiryQuerySchema.parse(req.query);
      res.json(await memberService.previewExpiry(packageId, startDate));
    } catch (err) {
      next(err);
    }
  },

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const input = createMemberSchema.parse(req.body);
      res.status(201).json(await memberService.create(input));
    } catch (err) {
      next(err);
    }
  },

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = memberIdParamSchema.parse(req.params);
      const input = updateMemberSchema.parse(req.body);
      res.json(await memberService.update(id, input));
    } catch (err) {
      next(err);
    }
  },

  async remove(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = memberIdParamSchema.parse(req.params);
      await memberService.remove(id);
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  },
};