import Link from "next/link";
import { StatCard } from "@/components/shared/StatCard";
import { StatusBadge } from "@/components/shared/StatusBadge";
import {
  formatPrice,
  type Order,
  type Payment,
  type Product,
} from "@/lib/api";
import { safeServerApiGet } from "@/lib/server-api";

export default async function SellerDashboardPage() {
  const [productsResponse, ordersResponse, paymentsResponse] = await Promise.all([
    safeServerApiGet<Product[]>("/products/mine"),
    safeServerApiGet<Order[]>("/orders/seller"),
    safeServerApiGet<Payment[]>("/payments/mine"),
  ]);
  const products = productsResponse?.data ?? [];
  const orders = ordersResponse?.data ?? [];
  const payments = paymentsResponse?.data ?? [];
  const revenue = orders.reduce((sum, order) => sum + Number(order.total), 0);

  return (
    <main className="min-h-screen bg-surface">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[260px_1fr] lg:px-8">
        <aside className="h-fit rounded-2xl border border-gray-200 bg-white p-5 shadow-card">
          <Link href="/" className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-500 text-sm font-bold text-white">
              TN
            </span>
            <span className="font-bold text-gray-900">Seller Studio</span>
          </Link>
          <nav className="mt-8 grid gap-2 text-sm font-medium text-gray-500">
            {["Overview", "Listings", "Orders", "Messages", "Payouts"].map((item) => (
              <span key={item} className="rounded-md px-3 py-2 hover:bg-gray-100 hover:text-gray-900">
                {item}
              </span>
            ))}
          </nav>
        </aside>

        <section>
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-600">
                Seller dashboard
              </p>
              <h1 className="mt-2 text-4xl font-bold tracking-tight text-gray-900">
                Manage listings and sales.
              </h1>
            </div>
            <Link href="/sell" className="rounded-md bg-brand-500 px-5 py-3 text-sm font-semibold text-white">
              New listing
            </Link>
          </div>

          <div className="mt-8 grid gap-5 md:grid-cols-3">
            <StatCard label="Revenue" value={formatPrice(revenue)} helper="From seller orders" />
            <StatCard label="Active listings" value={String(products.length)} helper="Your product catalog" />
            <StatCard label="Payments" value={String(payments.length)} helper="Recorded payment entries" />
          </div>

          <div className="mt-8 rounded-2xl border border-gray-200 bg-white p-6 shadow-card">
            <h2 className="text-xl font-semibold text-gray-900">Your listings</h2>
            <div className="mt-5 space-y-4">
              {products.slice(0, 4).map((product) => (
                <Link
                  href={`/products/${product.slug}`}
                  key={product.id}
                  className="flex items-center justify-between gap-4 rounded-xl bg-gray-50 p-4"
                >
                  <div>
                    <p className="font-semibold text-gray-900">{product.title}</p>
                    <p className="mt-1 text-sm text-gray-500">
                      {formatPrice(product.price, product.currency)}
                    </p>
                  </div>
                  <StatusBadge label={product.status ?? product.condition} />
                </Link>
              ))}
              {!products.length ? (
                <div className="rounded-xl border border-dashed border-gray-200 p-5 text-sm text-gray-500">
                  No seller listings yet. Create one from the sell page.
                </div>
              ) : null}
            </div>
          </div>

          <div className="mt-8 rounded-2xl border border-gray-200 bg-white p-6 shadow-card">
            <h2 className="text-xl font-semibold text-gray-900">Seller orders</h2>
            <div className="mt-5 space-y-4">
              {orders.slice(0, 5).map((order) => (
                <Link
                  key={order.id}
                  href={`/orders/${order.id}`}
                  className="flex items-center justify-between rounded-xl bg-gray-50 p-4"
                >
                  <div>
                    <p className="font-semibold text-gray-900">{order.orderNumber}</p>
                    <p className="mt-1 text-sm text-gray-500">
                      {order.items.map((item) => item.title).join(", ")}
                    </p>
                  </div>
                  <StatusBadge label={order.status} />
                </Link>
              ))}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
