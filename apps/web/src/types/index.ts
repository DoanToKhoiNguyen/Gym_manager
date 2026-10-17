export type MemberStatus = "ACTIVE" | "EXPIRING" | "EXPIRED";
export type Gender = "MALE" | "FEMALE" | "OTHER";

export interface Package {
  id: number;
  name: string;
  months: number;
  price: number;
  isActive: boolean;
}

export interface Member {
  id: number;
  fullName: string;
  phone: string;
  gender: Gender | null;
  birthDate: string | null;
  email: string | null;
  note: string | null;
  packageId: number;
  packageName: string;
  startDate: string;
  expiryDate: string;
  status: MemberStatus;
}

export interface PagedResult<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}