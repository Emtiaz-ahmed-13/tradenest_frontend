import Link from "next/link";

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="min-h-screen bg-surface px-4 py-10">
      <Link
        href="/"
        className="mx-auto mb-10 flex w-fit items-center gap-2 text-gray-900"
      >
        <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-500 text-sm font-bold text-white">
          TN
        </span>
        <span className="text-xl font-bold">TradeNest</span>
      </Link>
      {children}
    </main>
  );
}
