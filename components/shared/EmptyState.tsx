type EmptyStateProps = {
  title: string;
  description?: string;
};

export function EmptyState({ title, description }: EmptyStateProps) {
  return (
    <div className="rounded-xl border border-dashed border-gray-200 bg-white p-8 text-center">
      <p className="font-semibold text-gray-900">{title}</p>
      {description ? (
        <p className="mt-2 text-sm text-gray-500">{description}</p>
      ) : null}
    </div>
  );
}
