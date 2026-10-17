import type { MemberStatus } from "../types";

const LABELS: Record<MemberStatus, string> = {
  ACTIVE: "Đang hoạt động",
  EXPIRING: "Sắp hết hạn",
  EXPIRED: "Hết hạn",
};

export default function StatusBadge({ status }: { status: MemberStatus }) {
  return <span className={`badge badge-${status}`}>{LABELS[status]}</span>;
}