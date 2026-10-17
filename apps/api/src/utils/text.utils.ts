/**
 * "Nguyễn Văn Đức" -> "nguyen van duc"
 * Dùng để tìm kiếm không phân biệt dấu và hoa/thường.
 */
export function normalizeText(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // bỏ dấu
    .replace(/đ/g, "d") // "đ" không tách được bằng NFD nên xử lý riêng
    .replace(/\s+/g, " ")
    .trim();
}