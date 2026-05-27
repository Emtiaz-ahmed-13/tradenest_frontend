import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-white">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 md:grid-cols-[1.4fr_1fr_1fr] lg:px-8">
        <div>
          <div className="mb-3 flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-500 text-sm font-bold text-white">
              TN
            </span>
            <span className="text-lg font-bold text-gray-900">TradeNest</span>
          </div>
          <p className="max-w-md text-sm leading-6 text-gray-500">
            A trusted marketplace experience for buying, selling, and managing
            local orders from one clean dashboard.
          </p>
        </div>

        <div>
          <h3 className="mb-3 text-sm font-semibold text-gray-900">Marketplace</h3>
          <div className="grid gap-2 text-sm text-gray-500">
            <Link href="/products" className="hover:text-brand-600">Browse products</Link>
            <Link href="/sell" className="hover:text-brand-600">Create listing</Link>
            <Link href="/cart" className="hover:text-brand-600">Cart</Link>
          </div>
        </div>

        <div>
          <h3 className="mb-3 text-sm font-semibold text-gray-900">Account</h3>
          <div className="grid gap-2 text-sm text-gray-500">
            <Link href="/profile" className="hover:text-brand-600">Profile</Link>
            <Link href="/seller/dashboard" className="hover:text-brand-600">Seller dashboard</Link>
            <Link href="/admin/dashboard" className="hover:text-brand-600">Admin panel</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
