type StatCardProps = {
  label: string;
  value: string;
  helper: string;
};

export function StatCard({ label, value, helper }: StatCardProps) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-card">
      <p className="text-sm font-medium text-gray-500">{label}</p>
      <p className="mt-3 text-3xl font-bold tracking-tight text-gray-900">
        {value}
      </p>
      <p className="mt-2 text-sm text-gray-500">{helper}</p>
    </div>
  );
}
