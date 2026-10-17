export function formatPrice(value: number): string {
  return `${new Intl.NumberFormat("vi-VN").format(value)} ₫`;
}

const pad = (n: number) => String(n).padStart(2, "0");

/** Hôm nay dạng YYYY-MM-DD (dùng làm giá trị mặc định của ô ngày) */
export function todayString(): string {
  const d = new Date();
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

/** "2026-10-17" -> "17/10/2026" (chỉ cắt chuỗi, không qua Date để khỏi lệch múi giờ) */
export function formatDate(value: string): string {
  const [y, m, d] = value.split("-");
  return `${d}/${m}/${y}`;
}/** Gõ "17102026" -> "17/10/2026" (tự chèn dấu /, bỏ ký tự không phải số) */
export function maskDateInput(raw: string): string {
  const d = raw.replace(/\D/g, "").slice(0, 8);
  if (d.length <= 2) return d;
  if (d.length <= 4) return `${d.slice(0, 2)}/${d.slice(2)}`;
  return `${d.slice(0, 2)}/${d.slice(2, 4)}/${d.slice(4)}`;
}

/** "17/10/2026" -> "2026-10-17"; trả về null nếu chưa đủ hoặc ngày không tồn tại */
export function parseDisplayDate(text: string): string | null {
  const m = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(text.trim());
  if (!m) return null;

  const day = Number(m[1]);
  const month = Number(m[2]);
  const year = Number(m[3]);
  if (year < 1900 || year > 2100) return null;

  // Kiểm tra ngày có thật (chặn 31/02, 30/02...)
  const date = new Date(year, month - 1, day);
  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) {
    return null;
  }
  return `${m[3]}-${m[2]}-${m[1]}`;
}