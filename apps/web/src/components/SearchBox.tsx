interface Props {
  value: string;
  onChange: (value: string) => void;
}

export default function SearchBox({ value, onChange }: Props) {
  return (
    <input
      className="input"
      style={{ maxWidth: 320 }}
      type="search"
      placeholder="Tìm theo tên hoặc SĐT..."
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  );
}