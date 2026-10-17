import { apiFetch } from "./client";
import type { Package } from "../types";

export interface CreatePackageInput {
  name: string;
  months: number;
  price: number;
}

export const packagesApi = {
  list: (activeOnly = false) =>
    apiFetch<Package[]>(`/packages${activeOnly ? "?active=true" : ""}`),

  create: (data: CreatePackageInput) =>
    apiFetch<Package>("/packages", {
      method: "POST",
      body: JSON.stringify(data),
    }),
};