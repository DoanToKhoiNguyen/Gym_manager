import { apiFetch } from "./client";
import type { Gender, Member, PagedResult } from "../types";

export interface MemberInput {
  fullName: string;
  phone: string;
  gender: Gender | "";
  birthDate: string;
  email: string;
  note: string;
  packageId: number;
  startDate: string;
}

export interface ListParams {
  search?: string;
  page?: number;
  pageSize?: number;
}

export interface ExpiryPreview {
  startDate: string;
  expiryDate: string;
}

export const membersApi = {
  list: (params: ListParams = {}) => {
    const q = new URLSearchParams();
    if (params.search) q.set("search", params.search);
    if (params.page) q.set("page", String(params.page));
    if (params.pageSize) q.set("pageSize", String(params.pageSize));
    const query = q.toString();
    return apiFetch<PagedResult<Member>>(`/members${query ? `?${query}` : ""}`);
  },

  getById: (id: number) => apiFetch<Member>(`/members/${id}`),

  previewExpiry: (packageId: number, startDate: string) =>
    apiFetch<ExpiryPreview>(
      `/members/preview-expiry?packageId=${packageId}&startDate=${startDate}`,
    ),

  create: (data: MemberInput) =>
    apiFetch<Member>("/members", { method: "POST", body: JSON.stringify(data) }),

  update: (id: number, data: MemberInput) =>
    apiFetch<Member>(`/members/${id}`, { method: "PUT", body: JSON.stringify(data) }),

  remove: (id: number) => apiFetch<void>(`/members/${id}`, { method: "DELETE" }),
};