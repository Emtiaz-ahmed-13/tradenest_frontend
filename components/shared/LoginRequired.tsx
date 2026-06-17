import Link from "next/link";

type LoginRequiredProps = {
  title?: string;
  description?: string;
};

export function LoginRequired({
  title = "Login required",
  description = "Please login to access this page.",
}: LoginRequiredProps) {
  return (
    <section className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-card">
        <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
        <p className="mt-3 text-gray-500">{description}</p>
        <Link
          href="/login"
          className="mt-6 inline-flex rounded-md bg-brand-500 px-5 py-3 text-sm font-semibold text-white"
        >
          Login
        </Link>
      </div>
    </section>
  );
}
