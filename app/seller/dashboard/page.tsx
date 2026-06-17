import Link from "next/link";
import { ApiErrorPanel } from "@/components/shared/ApiErrorPanel";
import { EmptyState } from "@/components/shared/EmptyState";
import { LoginRequired } from "@/components/shared/LoginRequired";
import { StatCard } from "@/components/shared/StatCard";
import { StatusBadge } from "@/components/shared/StatusBadge";
import {
  formatPrice,
  type KycVerification,
  type Order,
  type Product,
  type SellerDashboard,
} from "@/lib/api";
import { safeServerApiGet } from "@/lib/server-api";

export default async function SellerDashboardPage() {
  const [
    dashboardResponse,
    productsResponse,
    ordersResponse,
    kycResponse,
  ] = await Promise.all([
    safeServerApiGet<SellerDashboard>("/seller/dashboard"),
    safeServerApiGet<Product[]>("/products/mine"),
    safeServerApiGet<Order[]>("/orders/seller"),
    safeServerApiGet<KycVerification>("/kyc/status"),
  ]);

  if (!dashboardResponse && !productsResponse) {
    return <LoginRequired description="Please login to access the seller dashboard." />;
  }

  const dashboard = dashboardResponse?.data;
  const products = productsResponse?.data ?? [];
  const orders = ordersResponse?.data ?? [];
  const kyc = kycResponse?.data;
  const boostedProducts = products.filter((product) => product.isBoosted);
  const expiringProducts = products.filter((product) => Boolean(product.expiresAt));

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
            <Link href="/seller/dashboard" className="rounded-md bg-gray-100 px-3 py-2 text-gray-900">
              Overview
            </Link>
            <Link href="/sell" className="rounded-md px-3 py-2 hover:bg-gray-100 hover:text-gray-900">
              New listing
            </Link>
            <Link href="/kyc" className="rounded-md px-3 py-2 hover:bg-gray-100 hover:text-gray-900">
              KYC status
            </Link>
            <Link href="/swap" className="rounded-md px-3 py-2 hover:bg-gray-100 hover:text-gray-900">
              Swap requests
            </Link>
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

          {!dashboardResponse ? (
            <div className="mt-6">
              <ApiErrorPanel message="Seller analytics API unavailable. Showing fallback product and order data." />
            </div>
          ) : null}

          <div className="mt-8 grid gap-5 md:grid-cols-4">
            <StatCard
              label="Total sales"
              value={String(dashboard?.totalSales ?? orders.length)}
              helper="Completed seller orders"
            />
            <StatCard
              label="Sales value"
              value={formatPrice(dashboard?.totalSalesValue ?? 0)}
              helper="From seller dashboard API"
            />
            <StatCard
              label="Active listings"
              value={String(dashboard?.productsCount ?? products.length)}
              helper="Your product catalog"
            />
            <StatCard
              label="KYC"
              value={kyc?.status ?? "Not submitted"}
              helper="Verification status"
            />
          </div>

          {dashboard?.productPerformance?.length ? (
            <div className="mt-8 rounded-2xl border border-gray-200 bg-white p-6 shadow-card">
              <h2 className="text-xl font-semibold text-gray-900">Product performance</h2>
              <div className="mt-5 space-y-3">
                {dashboard.productPerformance.slice(0, 5).map((row) => (
                  <div
                    key={row.productId}
                    className="flex items-center justify-between rounded-xl bg-gray-50 p-4 text-sm"
                  >
                    <span className="font-medium text-gray-700">{row.productId}</span>
                    <div className="flex gap-4 text-gray-500">
                      <span>{row.unitsSold} sold</span>
                      <span>{formatPrice(row.revenue)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : null}

          <div className="mt-8 grid gap-6 lg:grid-cols-2">
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-card">
              <h2 className="text-xl font-semibold text-gray-900">Boosted listings</h2>
              <div className="mt-5 space-y-3">
                {boostedProducts.length ? (
                  boostedProducts.slice(0, 4).map((product) => (
                    <Link
                      key={product.id}
                      href={`/products/${product.slug}`}
                      className="flex items-center justify-between rounded-xl bg-gray-50 p-4"
                    >
                      <span className="font-semibold text-gray-900">{product.title}</span>
                      <StatusBadge label="Boosted" />
                    </Link>
                  ))
                ) : (
                  <EmptyState title="No boosted products" />
                )}
              </div>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-card">
              <h2 className="text-xl font-semibold text-gray-900">Expiring soon</h2>
              <div className="mt-5 space-y-3">
                {expiringProducts.length ? (
                  expiringProducts.slice(0, 4).map((product) => (
                    <Link
                      key={product.id}
                      href={`/products/${product.slug}`}
                      className="flex items-center justify-between rounded-xl bg-gray-50 p-4"
                    >
                      <span className="font-semibold text-gray-900">{product.title}</span>
                      <span className="text-xs text-amber-700">
                        {product.expiresAt
                          ? new Date(product.expiresAt).toLocaleDateString("en-BD")
                          : ""}
                      </span>
                    </Link>
                  ))
                ) : (
                  <EmptyState title="No expiring listings" />
                )}
              </div>
            </div>
          </div>

          <div className="mt-8 rounded-2xl border border-gray-200 bg-white p-6 shadow-card">
            <h2 className="text-xl font-semibold text-gray-900">Your listings</h2>
            <div className="mt-5 space-y-4">
              {products.slice(0, 6).map((product) => (
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
                <EmptyState
                  title="No seller listings yet"
                  description="Create one from the sell page."
                />
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

          {dashboard?.payoutSummary ? (
            <div className="mt-8 rounded-2xl border border-gray-200 bg-white p-6 shadow-card">
              <h2 className="text-xl font-semibold text-gray-900">Payout summary</h2>
              <pre className="mt-4 overflow-auto rounded-xl bg-gray-50 p-4 text-xs text-gray-600">
                {JSON.stringify(dashboard.payoutSummary, null, 2)}
              </pre>
            </div>
          ) : null}
        </section>
      </div>
    </main>
  );
}
