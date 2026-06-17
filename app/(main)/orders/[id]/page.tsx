import Link from "next/link";
import { notFound } from "next/navigation";
import {
  applyCouponAction,
  cancelOrderAction,
  createGatewayPaymentAction,
  createPaymentAction,
  createReturnRequestAction,
  initGatewayPaymentAction,
} from "@/app/actions";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { formatPrice, type Order, type ReturnRequest } from "@/lib/api";
import { safeServerApiGet, serverApiGet } from "@/lib/server-api";

type OrderDetailPageProps = {
  params: Promise<{ id: string }>;
};

const GATEWAY_PROVIDERS = ["BKASH", "NAGAD", "SSLCOMMERZ"];

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
  const payment = order.payment;
  const canInitGateway =
    payment &&
    GATEWAY_PROVIDERS.includes(payment.provider) &&
    payment.status !== "COMPLETED";

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

        {payment ? (
          <div className="mt-6 rounded-xl bg-gray-50 p-4">
            <p className="text-sm font-medium text-gray-500">Payment</p>
            <div className="mt-2 flex flex-wrap items-center gap-3">
              <StatusBadge label={payment.provider} />
              <StatusBadge label={payment.status} />
              <span className="font-semibold text-gray-900">
                {formatPrice(payment.amount, payment.currency)}
              </span>
            </div>
            {canInitGateway ? (
              <form action={initGatewayPaymentAction} className="mt-4">
                <input type="hidden" name="paymentId" value={payment.id} />
                <input type="hidden" name="orderId" value={order.id} />
                <button className="rounded-md bg-brand-500 px-4 py-2 text-sm font-semibold text-white">
                  Pay with {payment.provider}
                </button>
              </form>
            ) : null}
          </div>
        ) : (
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <form action={createPaymentAction} className="rounded-xl bg-gray-50 p-4">
              <input type="hidden" name="orderId" value={order.id} />
              <label className="grid gap-2 text-sm font-medium text-gray-700">
                Manual / COD payment
                <select name="provider" className="rounded-md border border-gray-200 px-3 py-2 text-sm">
                  <option value="COD">Cash on Delivery</option>
                  <option value="MANUAL">Manual</option>
                </select>
              </label>
              <button className="mt-3 rounded-md bg-brand-500 px-4 py-2 text-sm font-semibold text-white">
                Record payment
              </button>
            </form>

            <form action={createGatewayPaymentAction} className="rounded-xl bg-gray-50 p-4">
              <input type="hidden" name="orderId" value={order.id} />
              <label className="grid gap-2 text-sm font-medium text-gray-700">
                Online gateway
                <select name="provider" className="rounded-md border border-gray-200 px-3 py-2 text-sm">
                  <option value="BKASH">bKash</option>
                  <option value="NAGAD">Nagad</option>
                  <option value="SSLCOMMERZ">SSLCommerz</option>
                </select>
              </label>
              <button className="mt-3 rounded-md bg-gray-900 px-4 py-2 text-sm font-semibold text-white">
                Start gateway payment
              </button>
            </form>
          </div>
        )}

        <form action={applyCouponAction} className="mt-6 rounded-xl bg-gray-50 p-4">
          <input type="hidden" name="orderId" value={order.id} />
          <input type="hidden" name="orderAmount" value={Number(order.total)} />
          <label className="grid gap-2 text-sm font-medium text-gray-700">
            Apply coupon to order
            <div className="flex gap-2">
              <input
                name="code"
                className="flex-1 rounded-md border border-gray-200 px-3 py-2 text-sm"
                placeholder="Coupon code"
              />
              <button className="rounded-md bg-brand-500 px-4 py-2 text-sm font-semibold text-white">
                Apply
              </button>
            </div>
          </label>
        </form>

        <form action={createReturnRequestAction} className="mt-6 rounded-xl bg-gray-50 p-4">
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
