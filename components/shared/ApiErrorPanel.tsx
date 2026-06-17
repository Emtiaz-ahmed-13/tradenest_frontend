type ApiErrorPanelProps = {
  title?: string;
  message?: string;
};

export function ApiErrorPanel({
  title = "Unable to load data",
  message = "The backend may be unavailable or your session expired.",
}: ApiErrorPanelProps) {
  return (
    <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
      <p className="font-semibold">{title}</p>
      <p className="mt-1">{message}</p>
    </div>
  );
}
