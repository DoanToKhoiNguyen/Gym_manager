import { useState } from "react";
import type { FormEvent } from "react";
import { ApiError } from "../api/client";
import { useCreatePackage, usePackages } from "../hooks/usePackages";
import { formatPrice } from "../utils/format";

type FieldName = "name" | "months" | "price";
type FieldErrors = Partial<Record<FieldName, string>>;

const isFieldName = (value: string): value is FieldName =>
  value === "name" || value === "months" || value === "price";

export default function PackageListPage() {
  const { data: packages, isLoading, error } = usePackages();
  const createPackage = useCreatePackage();

  const [name, setName] = useState("");
  const [months, setMonths] = useState("");
  const [price, setPrice] = useState("");
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState("");
  const [success, setSuccess] = useState("");

  // Chỉ kiểm tra những thứ hiển nhiên; luật nghiệp vụ do server quyết định
  function validate(): FieldErrors {
    const errors: FieldErrors = {};
    if (!name.trim()) errors.name = "Tên gói không được để trống";
    if (months.trim() === "") errors.months = "Số ngày không được để trống";
    else if (Number.isNaN(Number(months))) errors.months = "Số ngày phải là số";
    if (price.trim() === "") errors.price = "Giá không được để trống";
    else if (Number.isNaN(Number(price))) errors.price = "Giá phải là số";
    return errors;
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setFormError("");
    setSuccess("");

    const errors = validate();
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) return;

    createPackage.mutate(
      { name: name.trim(), months: Number(months), price: Number(price) },
      {
        onSuccess: (created) => {
          setName("");
          setMonths("");
          setPrice("");
          setSuccess(`Đã thêm gói "${created.name}"`);
        },
        onError: (err) => {
          // Lỗi gắn với một ô thì hiện ngay dưới ô đó, còn lại hiện ở đầu form
          if (err instanceof ApiError && err.field && isFieldName(err.field)) {
            setFieldErrors({ [err.field]: err.message });
          } else {
            setFormError(err.message);
          }
        },
      },
    );
  }

  return (
    <>
      <h1>Gói tập</h1>

      <div className="card">
        <h2 style={{ marginTop: 0, fontSize: 18 }}>Thêm gói mới</h2>

        {formError && <div className="alert alert-error">{formError}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        <form className="form" onSubmit={handleSubmit} noValidate>
          <div className={`field ${fieldErrors.name ? "has-error" : ""}`}>
            <label htmlFor="name">Tên gói</label>
            <input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ví dụ: 2 tháng"
            />
            {fieldErrors.name && <div className="field-error">{fieldErrors.name}</div>}
          </div>

          <div className={`field ${fieldErrors.months ? "has-error" : ""}`}>
            <label htmlFor="months">Thời hạn (số ngày)</label>
            <input
              id="months"
              type="number"
              min="1"
              value={months}
              onChange={(e) => setMonths(e.target.value)}
            />
            {fieldErrors.months && <div className="field-error">{fieldErrors.months}</div>}
          </div>

          <div className={`field ${fieldErrors.price ? "has-error" : ""}`}>
            <label htmlFor="price">Giá (VND)</label>
            <input
              id="price"
              type="number"
              min="0"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
            {fieldErrors.price && <div className="field-error">{fieldErrors.price}</div>}
          </div>

          <div className="form-actions">
            <button className="btn" type="submit" disabled={createPackage.isPending}>
              {createPackage.isPending ? "Đang lưu..." : "Thêm gói"}
            </button>
          </div>
        </form>
      </div>

      <div className="table-wrap">
        {isLoading && <div className="empty">Đang tải...</div>}
        {error && <div className="empty">Không tải được danh sách: {error.message}</div>}
        {packages && packages.length === 0 && <div className="empty">Chưa có gói tập nào</div>}
        {packages && packages.length > 0 && (
          <table>
            <thead>
              <tr>
                <th>Tên gói</th>
                <th>Thời hạn</th>
                <th>Giá</th>
                <th>Trạng thái</th>
              </tr>
            </thead>
            <tbody>
              {packages.map((p) => (
                <tr key={p.id}>
                  <td>{p.name}</td>
                  <td>{p.months} ngày</td>
                  <td>{formatPrice(p.price)}</td>
                  <td>
                    <span className={`badge ${p.isActive ? "badge-ACTIVE" : "badge-INACTIVE"}`}>
                      {p.isActive ? "Đang bán" : "Đã ẩn"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}