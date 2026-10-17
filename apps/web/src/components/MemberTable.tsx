import { Link } from "react-router-dom";
import type { Member } from "../types";
import { formatDate } from "../utils/format";
import StatusBadge from "./StatusBadge";

interface Props {
  members: Member[];
  deletingId: number | null;
  onDelete: (member: Member) => void;
}

export default function MemberTable({ members, deletingId, onDelete }: Props) {
  return (
    <table>
      <thead>
        <tr>
          <th>Họ tên</th>
          <th>SĐT</th>
          <th>Gói</th>
          <th>Ngày hết hạn</th>
          <th>Trạng thái</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {members.map((m) => (
          <tr key={m.id}>
            <td>{m.fullName}</td>
            <td>{m.phone}</td>
            <td>{m.packageName}</td>
            <td>{formatDate(m.expiryDate)}</td>
            <td>
              <StatusBadge status={m.status} />
            </td>
            <td>
              <div className="actions">
                <Link className="btn btn-secondary btn-small" to={`/members/${m.id}/edit`}>
                  Sửa
                </Link>
                <button
                  className="btn btn-danger btn-small"
                  disabled={deletingId === m.id}
                  onClick={() => onDelete(m)}
                >
                  {deletingId === m.id ? "Đang xóa..." : "Xóa"}
                </button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}