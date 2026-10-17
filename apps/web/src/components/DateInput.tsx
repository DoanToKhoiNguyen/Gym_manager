import { useRef } from "react";
import { formatDate, maskDateInput, parseDisplayDate } from "../utils/format";

interface Props {
  id: string;
  value: string; // dạng hiển thị dd/mm/yyyy
  onChange: (value: string) => void;
}

export default function DateInput({ id, value, onChange }: Props) {
  const pickerRef = useRef<HTMLInputElement>(null);

  function openPicker() {
    try {
      pickerRef.current?.showPicker();
    } catch {
      // Trình duyệt không hỗ trợ: vẫn nhập tay được
    }
  }

  return (
    <div className="date-input">
      <input
        id={id}
        className="input"
        inputMode="numeric"
        autoComplete="off"
        placeholder="dd/mm/yyyy"
        maxLength={10}
        value={value}
        onChange={(e) => onChange(maskDateInput(e.target.value))}
      />
      <button type="button" className="btn btn-secondary" onClick={openPicker}>
        Lịch
      </button>
      {/* Ô lịch ẩn, chỉ dùng để mở bộ chọn ngày của trình duyệt */}
      <input
        ref={pickerRef}
        className="date-picker-hidden"
        type="date"
        tabIndex={-1}
        aria-hidden="true"
        value={parseDisplayDate(value) ?? ""}
        onChange={(e) => {
          if (e.target.value) onChange(formatDate(e.target.value));
        }}
      />
    </div>
  );
}