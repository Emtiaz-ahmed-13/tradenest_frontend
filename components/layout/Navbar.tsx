import Link from "next/link";
import { AuthActions } from "@/components/auth/AuthActions";

const navItems = [
  { href: "/products", label: "Products" },
  { href: "/sell", label: "Sell" },
  { href: "/orders", label: "Orders" },
  { href: "/messages", label: "Messages" },
];

export function Navbar() {
  return (
    <header className="sticky top-0 z-40 border-b border-gray-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-5 px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex shrink-0 items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-500 text-sm font-bold text-white shadow-sm">
            TN
          </span>
          <span className="text-lg font-bold tracking-tight text-gray-900">
            TradeNest
          </span>
        </Link>

        <form action="/products" className="hidden flex-1 items-center justify-center lg:flex">
          <label className="relative w-full max-w-md">
            <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm text-gray-400">
              Search
            </span>
            <input
              name="q"
              className="h-10 w-full rounded-full border border-gray-200 bg-gray-50 pl-16 pr-4 text-sm text-gray-700 outline-none transition placeholder:text-gray-400 focus:border-brand-400 focus:bg-white focus:ring-4 focus:ring-brand-100"
              placeholder="products, brands, sellers..."
            />
          </label>
        </form>

        <nav className="hidden shrink-0 items-center gap-6 md:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-gray-500 transition hover:text-brand-600"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto shrink-0">
          <AuthActions />
        </div>
      </div>
    </header>
  );
}
