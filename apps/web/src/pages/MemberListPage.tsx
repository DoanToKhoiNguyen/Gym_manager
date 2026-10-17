import { useState } from "react";
import { Link } from "react-router-dom";
import MemberTable from "../components/MemberTable";
import SearchBox from "../components/SearchBox";
import { useDebounce } from "../hooks/useDebounce";
import { useDeleteMember, useMembers } from "../hooks/useMembers";
import type { Member } from "../types";

const PAGE_SIZE = 10;

export default function MemberListPage() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [deleteError, setDeleteError] = useState("");

  const debouncedSearch = useDebounce(search, 300);
  const { data, isLoading, isPlaceholderData, error } = useMembers({
    search: debouncedSearch,
    page,
    pageSize: PAGE_SIZE,
  });
  const deleteMember = useDeleteMember();

  function handleSearchChange(value: string) {
    setSearch(value);
    setPage(1); // đổi từ khóa thì quay về trang đầu
  }

  function handleDelete(member: Member) {
    const ok = window.confirm(
      `Xóa hội viên "${member.fullName}"?\nHành động này không thể hoàn tác.`,
    );
    if (!ok) return;

    setDeleteError("");
    deleteMember.mutate(member.id, {
      onSuccess: () => {
        // Xóa dòng cuối của trang thì lùi về trang trước, tránh trang trống
        if (data && data.items.length === 1 && page > 1) setPage(page - 1);
      },
      onError: (err) => setDeleteError(err.message),
    });
  }

  const deletingId = deleteMember.isPending ? (deleteMember.variables ?? null) : null;

  return (
    <>
      <h1>Hội viên</h1>

      <div className="toolbar">
        <SearchBox value={search} onChange={handleSearchChange} />
        <Link className="btn" to="/members/new">
          + Thêm hội viên
        </Link>
      </div>

      {deleteError && <div className="alert alert-error">{deleteError}</div>}

      <div className="table-wrap" style={{ opacity: isPlaceholderData ? 0.6 : 1 }}>
        {isLoading && <div className="empty">Đang tải...</div>}
        {error && <div className="empty">Không tải được danh sách: {error.message}</div>}

        {data && data.items.length === 0 && (
          <div className="empty">
            {debouncedSearch
              ? `Không tìm thấy hội viên nào khớp "${debouncedSearch}"`
              : "Chưa có hội viên nào. Bấm \"+ Thêm hội viên\" để bắt đầu."}
          </div>
        )}

        {data && data.items.length > 0 && (
          <MemberTable
            members={data.items}
            deletingId={deletingId}
            onDelete={handleDelete}
          />
        )}
      </div>

      {data && data.totalPages > 1 && (
        <div className="pagination">
          <span>
            Trang {data.page}/{data.totalPages} ({data.total} hội viên)
          </span>
          <button
            className="btn btn-secondary btn-small"
            disabled={page <= 1}
            onClick={() => setPage(page - 1)}
          >
            ← Trước
          </button>
          <button
            className="btn btn-secondary btn-small"
            disabled={page >= data.totalPages}
            onClick={() => setPage(page + 1)}
          >
            Sau →
          </button>
        </div>
      )}

      {data && data.totalPages <= 1 && data.total > 0 && (
        <div className="pagination">
          <span>{data.total} hội viên</span>
        </div>
      )}
    </>
  );
}