import Link from "next/link";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { formatPrice, type Order } from "@/lib/api";
import { safeServerApiGet } from "@/lib/server-api";

export default async function OrdersPage() {
  const ordersResponse = await safeServerApiGet<Order[]>("/orders/mine");
  const orders = ordersResponse?.data ?? [];

  if (!ordersResponse) {
    return (
      <section className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-card">
          <h1 className="text-3xl font-bold text-gray-900">Login required</h1>
          <p className="mt-3 text-gray-500">Please login to view orders.</p>
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

  return (
    <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-600">
            Orders
          </p>
          <h1 className="mt-2 text-4xl font-bold tracking-tight text-gray-900">
            Track every purchase.
          </h1>
          <p className="mt-3 text-gray-500">
            Follow processing, delivery, and payment status from one place.
          </p>
        </div>
        <Link href="/products" className="rounded-md bg-brand-500 px-5 py-3 text-sm font-semibold text-white">
          Continue shopping
        </Link>
      </div>

      <div className="mt-8 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-card">
        <div className="grid grid-cols-5 border-b border-gray-200 bg-gray-50 px-5 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
          <span>Order</span>
          <span className="col-span-2">Item</span>
          <span>Status</span>
          <span className="text-right">Total</span>
        </div>
        {orders.map((order) => (
          <Link
            href={`/orders/${order.id}`}
            key={order.id}
            className="grid grid-cols-5 items-center px-5 py-5 text-sm transition hover:bg-gray-50"
          >
            <span className="font-semibold text-gray-900">{order.orderNumber}</span>
            <span className="col-span-2 text-gray-700">
              {order.items.map((item) => item.title).join(", ")}
            </span>
            <span>
              <StatusBadge label={order.status} />
            </span>
            <span className="text-right font-semibold text-gray-900">
              {formatPrice(order.total, order.currency)}
            </span>
          </Link>
        ))}
        {!orders.length ? (
          <div className="px-5 py-8 text-center text-sm text-gray-500">
            No orders yet.
          </div>
        ) : null}
      </div>
    </section>
  );
}
