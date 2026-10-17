import { AppError } from "../errors/AppError";
import { packageRepository } from "../repositories/package.repository";
import type { CreatePackageInput } from "../validators/package.validator";

export const packageService = {
  list(activeOnly: boolean) {
    return packageRepository.findAll(activeOnly);
  },

  async create(input: CreatePackageInput) {
    const existing = await packageRepository.findByName(input.name);
    if (existing) {
      throw new AppError(409, "PACKAGE_NAME_DUPLICATED", "Tên gói đã tồn tại", "name");
    }
    return packageRepository.create(input);
  },
};