import Link from "next/link";
import { notFound } from "next/navigation";
import {
  cancelOrderAction,
  createPaymentAction,
  createReturnRequestAction,
} from "@/app/actions";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { formatPrice, type Order, type ReturnRequest } from "@/lib/api";
import { safeServerApiGet, serverApiGet } from "@/lib/server-api";

type OrderDetailPageProps = {
  params: Promise<{ id: string }>;
};

export default async function OrderDetailPage({ params }: OrderDetailPageProps) {
  const { id } = await params;
  const orderResponse = await serverApiGet<Order>(`/orders/${id}`).catch(() => null);
  const order = orderResponse?.data;

  if (!order) {
    notFound();
  }

  const [invoiceResponse, returnsResponse] = await Promise.all([
    safeServerApiGet<Record<string, unknown>>(`/orders/${id}/invoice`),
    safeServerApiGet<ReturnRequest[]>("/returns/mine"),
  ]);
  const returnRequest = returnsResponse?.data.find(
    (request) => request.orderId === order.id,
  );

  return (
    <section className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <Link href="/orders" className="text-sm font-semibold text-brand-600">
        Back to orders
      </Link>

      <div className="mt-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-card">
        <div className="flex flex-col justify-between gap-4 border-b border-gray-200 pb-6 sm:flex-row sm:items-start">
          <div>
            <p className="text-sm text-gray-500">Order {order.orderNumber}</p>
            <h1 className="mt-2 text-3xl font-bold text-gray-900">
              {order.items.map((item) => item.title).join(", ")}
            </h1>
            <p className="mt-2 text-sm text-gray-500">
              Placed on {new Date(order.createdAt).toLocaleDateString("en-BD")}
            </p>
          </div>
          <StatusBadge label={order.status} />
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          {["Order placed", "Seller confirmed", "Delivery scheduled"].map((step) => (
            <div key={step} className="rounded-xl bg-gray-50 p-4">
              <p className="text-sm font-semibold text-gray-900">{step}</p>
              <p className="mt-2 text-xs text-gray-500">Updated in TradeNest timeline</p>
            </div>
          ))}
        </div>

        <div className="mt-6 rounded-xl bg-brand-50 p-5">
          <div className="flex justify-between text-sm text-gray-600">
            <span>Total</span>
            <span className="text-xl font-bold text-brand-700">
              {formatPrice(order.total, order.currency)}
            </span>
          </div>
        </div>

        <div className="mt-6 overflow-hidden rounded-xl border border-gray-200">
          {order.items.map((item) => (
            <div key={item.id} className="flex justify-between border-b border-gray-200 px-4 py-3 text-sm last:border-b-0">
              <span>{item.title} x {item.quantity}</span>
              <span className="font-semibold">{formatPrice(Number(item.price) * item.quantity, order.currency)}</span>
            </div>
          ))}
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <form action={createPaymentAction} className="rounded-xl bg-gray-50 p-4">
            <input type="hidden" name="orderId" value={order.id} />
            <label className="grid gap-2 text-sm font-medium text-gray-700">
              Payment provider
              <select name="provider" className="rounded-md border border-gray-200 px-3 py-2 text-sm">
                <option value="COD">Cash on Delivery</option>
                <option value="MANUAL">Manual</option>
                <option value="BKASH">bKash record</option>
                <option value="NAGAD">Nagad record</option>
                <option value="SSLCOMMERZ">SSLCommerz record</option>
              </select>
            </label>
            <input
              name="providerRef"
              className="mt-3 w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
              placeholder="Provider reference (optional)"
            />
            <button className="mt-3 rounded-md bg-brand-500 px-4 py-2 text-sm font-semibold text-white">
              Record payment
            </button>
          </form>

          <form action={createReturnRequestAction} className="rounded-xl bg-gray-50 p-4">
            <input type="hidden" name="orderId" value={order.id} />
            <textarea
              name="reason"
              rows={4}
              minLength={5}
              className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
              placeholder={returnRequest ? `Return status: ${returnRequest.status}` : "Return reason"}
              disabled={Boolean(returnRequest)}
              required
            />
            <button
              disabled={Boolean(returnRequest)}
              className="mt-3 rounded-md bg-gray-900 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
            >
              Request return
            </button>
          </form>
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <form action={cancelOrderAction}>
            <input type="hidden" name="orderId" value={order.id} />
            <button className="rounded-md border border-red-200 px-4 py-2 text-sm font-semibold text-red-700">
              Cancel order
            </button>
          </form>
          <details className="rounded-md border border-gray-200 px-4 py-2 text-sm text-gray-600">
            <summary className="cursor-pointer font-semibold text-gray-900">
              View invoice JSON
            </summary>
            <pre className="mt-3 max-h-80 overflow-auto text-xs">
              {JSON.stringify(invoiceResponse?.data ?? {}, null, 2)}
            </pre>
          </details>
        </div>
      </div>
    </section>
  );
}
