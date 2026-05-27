const styles: Record<string, string> = {
  delivered: "bg-green-50 text-green-700 ring-green-200",
  processing: "bg-amber-50 text-amber-700 ring-amber-200",
  pending: "bg-blue-50 text-blue-700 ring-blue-200",
  failed: "bg-red-50 text-red-700 ring-red-200",
  used: "bg-gray-100 text-gray-700 ring-gray-200",
  new: "bg-brand-50 text-brand-700 ring-brand-200",
};

export function StatusBadge({ label }: { label: string }) {
  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${
        styles[label.toLowerCase()] ?? "bg-gray-100 text-gray-700 ring-gray-200"
      }`}
    >
      {label}
    </span>
  );
}
