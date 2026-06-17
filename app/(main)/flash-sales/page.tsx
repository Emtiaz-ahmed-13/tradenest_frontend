import Link from "next/link";
import { EmptyState } from "@/components/shared/EmptyState";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatusBadge } from "@/components/shared/StatusBadge";
import {
  formatPrice,
  productImageStyle,
  type FlashSale,
} from "@/lib/api";
import { safeServerApiGet } from "@/lib/server-api";

export default async function FlashSalesPage() {
  const response = await safeServerApiGet<FlashSale[]>("/flash-sale/active");
  const flashSales = response?.data ?? [];

  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <PageHeader
        eyebrow="Flash sales"
        title="Limited-time deals"
        description="Active flash sales with discounted prices on selected products."
      />

      <div className="mt-10 space-y-8">
        {flashSales.length ? (
          flashSales.map((sale) => (
            <div
              key={sale.id}
              className="rounded-2xl border border-gray-200 bg-white p-6 shadow-card"
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{sale.title}</h2>
                  {sale.description ? (
                    <p className="mt-2 text-sm text-gray-500">{sale.description}</p>
                  ) : null}
                  <p className="mt-2 text-xs text-gray-400">
                    Ends {new Date(sale.endsAt).toLocaleString("en-BD")}
                  </p>
                </div>
                <StatusBadge label={sale.status} />
              </div>

              <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {(sale.products ?? []).map((entry) => (
                  <Link
                    key={entry.id}
                    href={`/products/${entry.product.slug}`}
                    className="flex gap-4 rounded-xl border border-gray-100 bg-gray-50 p-4 transition hover:border-brand-200"
                  >
                    <div
                      className="h-20 w-20 shrink-0 rounded-lg"
                      style={productImageStyle(entry.product)}
                    />
                    <div>
                      <p className="font-semibold text-gray-900">
                        {entry.product.title}
                      </p>
                      <p className="mt-1 text-lg font-bold text-brand-600">
                        {formatPrice(entry.salePrice, entry.product.currency)}
                      </p>
                      <p className="text-xs text-gray-400 line-through">
                        {formatPrice(entry.product.price, entry.product.currency)}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ))
        ) : (
          <EmptyState
            title="No active flash sales"
            description="Check back soon for limited-time marketplace deals."
          />
        )}
      </div>
    </section>
  );
}
