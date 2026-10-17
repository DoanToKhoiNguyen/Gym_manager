import { useState } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ApiError } from "../api/client";
import type { MemberInput } from "../api/members";
import DateInput from "../components/DateInput";
import {
  useCreateMember,
  useMember,
  usePreviewExpiry,
  useUpdateMember,
} from "../hooks/useMembers";
import { usePackages } from "../hooks/usePackages";
import type { Gender, Member } from "../types";
import { formatDate, formatPrice, parseDisplayDate, todayString } from "../utils/format";

const FIELDS = [
  "fullName",
  "phone",
  "gender",
  "birthDate",
  "email",
  "note",
  "packageId",
  "startDate",
] as const;

type FieldName = (typeof FIELDS)[number];
type FieldErrors = Partial<Record<FieldName, string>>;

const isFieldName = (value: string): value is FieldName =>
  (FIELDS as readonly string[]).includes(value);

interface FormState {
  fullName: string;
  phone: string;
  gender: Gender | "";
  birthDate: string; // dạng hiển thị dd/mm/yyyy
  email: string;
  note: string;
  packageId: string; // giữ dạng chuỗi vì lấy từ <select>
  startDate: string; // dạng hiển thị dd/mm/yyyy
}

/* ---------- Trang: quyết định thêm hay sửa ---------- */
export default function MemberFormPage() {
  const params = useParams();
  const id = params.id !== undefined ? Number(params.id) : undefined;
  const invalidId = id !== undefined && !(Number.isInteger(id) && id > 0);
  const { data: member, error } = useMember(invalidId ? undefined : id);

  if (invalidId) {
    return (
      <>
        <h1>Sửa hội viên</h1>
        <div className="alert alert-error">Mã hội viên không hợp lệ</div>
        <Link to="/members">Quay lại danh sách</Link>
      </>
    );
  }

  if (id !== undefined) {
    if (error) {
      return (
        <>
          <h1>Sửa hội viên</h1>
          <div className="alert alert-error">{error.message}</div>
          <Link to="/members">Quay lại danh sách</Link>
        </>
      );
    }
    if (!member) return <div className="empty">Đang tải...</div>;
  }

  // key buộc form dựng lại khi chuyển sang hội viên khác
  return <MemberForm key={member?.id ?? "new"} member={member} />;
}

/* ---------- Form dùng chung cho thêm và sửa ---------- */
function MemberForm({ member }: { member?: Member }) {
  const navigate = useNavigate();
  const { data: packages } = usePackages();
  const createMember = useCreateMember();
  const updateMember = useUpdateMember();

  const [form, setForm] = useState<FormState>({
    fullName: member?.fullName ?? "",
    phone: member?.phone ?? "",
    gender: member?.gender ?? "",
    birthDate: member?.birthDate ? formatDate(member.birthDate) : "",
    email: member?.email ?? "",
    note: member?.note ?? "",
    packageId: member ? String(member.packageId) : "",
    startDate: formatDate(member?.startDate ?? todayString()),
  });
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState("");

  // Ngày bắt đầu dạng YYYY-MM-DD, null nếu đang nhập dở hoặc không hợp lệ
  const startIso = parseDisplayDate(form.startDate);

  // Thêm mới: luôn tính dự kiến. Sửa: chỉ tính khi gói hoặc ngày bắt đầu bị đổi
  const changed =
    member === undefined ||
    form.packageId !== String(member.packageId) ||
    startIso !== member.startDate;

  const packageIdNumber = form.packageId ? Number(form.packageId) : null;
  const preview = usePreviewExpiry(changed ? packageIdNumber : null, startIso ?? "");

  // Chỉ cho chọn gói đang bán (khi sửa, vẫn giữ gói hiện tại dù đã ẩn)
  const packageOptions = (packages ?? []).filter(
    (p) => p.isActive || p.id === member?.packageId,
  );

  function setField<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
    setFieldErrors((prev) => ({ ...prev, [key]: undefined }));
  }

  function handleError(err: Error) {
    if (err instanceof ApiError && err.field && isFieldName(err.field)) {
      setFieldErrors({ [err.field]: err.message });
    } else {
      setFormError(err.message);
    }
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setFormError("");

    // Chỉ chặn lỗi hiển nhiên; luật nghiệp vụ (trùng SĐT, định dạng...) do server quyết định
    const errors: FieldErrors = {};
    if (!form.fullName.trim()) errors.fullName = "Họ tên không được để trống";
    if (!form.phone.trim()) errors.phone = "SĐT không được để trống";
    if (!form.packageId) errors.packageId = "Vui lòng chọn gói tập";

    if (!form.startDate.trim()) {
      errors.startDate = "Vui lòng nhập ngày bắt đầu";
    } else if (!startIso) {
      errors.startDate = "Ngày không hợp lệ, hãy nhập dạng dd/mm/yyyy";
    }

    const birthIso = form.birthDate.trim() ? parseDisplayDate(form.birthDate) : "";
    if (birthIso === null) {
      errors.birthDate = "Ngày không hợp lệ, hãy nhập dạng dd/mm/yyyy";
    }

    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) return;

    const payload: MemberInput = {
      ...form,
      fullName: form.fullName.trim(),
      phone: form.phone.trim(),
      packageId: Number(form.packageId),
      birthDate: birthIso ?? "",
      startDate: startIso ?? "",
    };

    const options = {
      onSuccess: () => navigate("/members"),
      onError: handleError,
    };

    if (member) {
      updateMember.mutate({ id: member.id, data: payload }, options);
    } else {
      createMember.mutate(payload, options);
    }
  }

  const pending = createMember.isPending || updateMember.isPending;

  return (
    <>
      <h1>{member ? "Sửa hội viên" : "Thêm hội viên"}</h1>

      <div className="card">
        {formError && <div className="alert alert-error">{formError}</div>}

        <form className="form" onSubmit={handleSubmit} noValidate>
          <div className={`field ${fieldErrors.fullName ? "has-error" : ""}`}>
            <label htmlFor="fullName">Họ tên *</label>
            <input
              id="fullName"
              value={form.fullName}
              onChange={(e) => setField("fullName", e.target.value)}
            />
            {fieldErrors.fullName && <div className="field-error">{fieldErrors.fullName}</div>}
          </div>

          <div className={`field ${fieldErrors.phone ? "has-error" : ""}`}>
            <label htmlFor="phone">Số điện thoại *</label>
            <input
              id="phone"
              inputMode="tel"
              placeholder="0901234567"
              value={form.phone}
              onChange={(e) => setField("phone", e.target.value)}
            />
            {fieldErrors.phone && <div className="field-error">{fieldErrors.phone}</div>}
          </div>

          <div className={`field ${fieldErrors.gender ? "has-error" : ""}`}>
            <label htmlFor="gender">Giới tính</label>
            <select
              id="gender"
              value={form.gender}
              onChange={(e) => setField("gender", e.target.value as Gender | "")}
            >
              <option value="">-- Không chọn --</option>
              <option value="MALE">Nam</option>
              <option value="FEMALE">Nữ</option>
              <option value="OTHER">Khác</option>
            </select>
            {fieldErrors.gender && <div className="field-error">{fieldErrors.gender}</div>}
          </div>

          <div className={`field ${fieldErrors.birthDate ? "has-error" : ""}`}>
            <label htmlFor="birthDate">Ngày sinh</label>
            <DateInput
              id="birthDate"
              value={form.birthDate}
              onChange={(v) => setField("birthDate", v)}
            />
            {fieldErrors.birthDate && <div className="field-error">{fieldErrors.birthDate}</div>}
          </div>

          <div className={`field ${fieldErrors.email ? "has-error" : ""}`}>
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={form.email}
              onChange={(e) => setField("email", e.target.value)}
            />
            {fieldErrors.email && <div className="field-error">{fieldErrors.email}</div>}
          </div>

          <div className={`field ${fieldErrors.note ? "has-error" : ""}`}>
            <label htmlFor="note">Ghi chú</label>
            <textarea
              id="note"
              rows={3}
              placeholder="Chấn thương, mục tiêu tập..."
              value={form.note}
              onChange={(e) => setField("note", e.target.value)}
            />
            {fieldErrors.note && <div className="field-error">{fieldErrors.note}</div>}
          </div>

          <div className={`field ${fieldErrors.packageId ? "has-error" : ""}`}>
            <label htmlFor="packageId">Gói tập *</label>
            <select
              id="packageId"
              value={form.packageId}
              onChange={(e) => setField("packageId", e.target.value)}
            >
              <option value="">-- Chọn gói --</option>
              {packageOptions.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} ({formatPrice(p.price)})
                  {!p.isActive ? " - đã ẩn" : ""}
                </option>
              ))}
            </select>
            {fieldErrors.packageId && <div className="field-error">{fieldErrors.packageId}</div>}
          </div>

          <div className={`field ${fieldErrors.startDate ? "has-error" : ""}`}>
            <label htmlFor="startDate">Ngày bắt đầu *</label>
            <DateInput
              id="startDate"
              value={form.startDate}
              onChange={(v) => setField("startDate", v)}
            />
            {fieldErrors.startDate && <div className="field-error">{fieldErrors.startDate}</div>}
          </div>

          {member && !changed && (
            <div className="hint">
              Ngày hết hạn hiện tại: <strong>{formatDate(member.expiryDate)}</strong> (giữ nguyên
              nếu bạn không đổi gói hoặc ngày bắt đầu)
            </div>
          )}
          {changed && preview.data && (
            <div className="hint">
              Hết hạn dự kiến: <strong>{formatDate(preview.data.expiryDate)}</strong>
              {member && " (ngày hết hạn sẽ được tính lại)"}
            </div>
          )}
          {changed && preview.isError && (
            <div className="alert alert-error">
              Không tính được ngày hết hạn dự kiến: {preview.error.message}
            </div>
          )}

          <div className="form-actions">
            <button className="btn" type="submit" disabled={pending}>
              {pending ? "Đang lưu..." : "Lưu"}
            </button>
            <Link className="btn btn-secondary" to="/members">
              Hủy
            </Link>
          </div>
        </form>
      </div>
    </>
  );
}