type PageHeaderProps = {
  eyebrow?: string;
  title: string;
  description: string;
  align?: "left" | "center";
};

export function PageHeader({
  eyebrow,
  title,
  description,
  align = "left",
}: PageHeaderProps) {
  return (
    <div className={align === "center" ? "mx-auto max-w-3xl text-center" : "max-w-3xl"}>
      {eyebrow ? (
        <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-brand-600">
          {eyebrow}
        </p>
      ) : null}
      <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
        {title}
      </h1>
      <p className="mt-4 text-base leading-7 text-gray-500 sm:text-lg">
        {description}
      </p>
    </div>
  );
}
