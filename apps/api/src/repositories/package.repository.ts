import { prisma } from "../config/prisma";
import type { CreatePackageInput } from "../validators/package.validator";

export const packageRepository = {
  findAll(activeOnly: boolean) {
    return prisma.package.findMany({
      where: activeOnly ? { isActive: true } : undefined,
      orderBy: { months: "asc" },
    });
  },

  findByName(name: string) {
    return prisma.package.findUnique({ where: { name } });
  },

  create(data: CreatePackageInput) {
    return prisma.package.create({ data });
  },

  findById(id: number) {
    return prisma.package.findUnique({ where: { id } });
  },
};