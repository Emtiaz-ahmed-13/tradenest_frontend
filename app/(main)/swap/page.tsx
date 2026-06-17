import Link from "next/link";
import {
  acceptSwapOfferAction,
  cancelSwapRequestAction,
  completeSwapRequestAction,
  counterSwapOfferAction,
  createSwapRequestAction,
  rejectSwapRequestAction,
} from "@/app/actions";
import { EmptyState } from "@/components/shared/EmptyState";
import { LoginRequired } from "@/components/shared/LoginRequired";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { formatPrice, type Product, type SwapRequest } from "@/lib/api";
import { safeServerApiGet } from "@/lib/server-api";

export default async function SwapPage() {
  const [swapResponse, productsResponse] = await Promise.all([
    safeServerApiGet<SwapRequest[]>("/swap/requests/mine"),
    safeServerApiGet<Product[]>("/products/mine"),
  ]);

  if (!swapResponse) {
    return <LoginRequired description="Please login to manage swap requests." />;
  }

  const swaps = swapResponse.data ?? [];
  const myProducts = productsResponse?.data ?? [];

  return (
    <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
      <PageHeader
        eyebrow="Swap"
        title="Product swap requests"
        description="Propose trades with other sellers using your listings or cash offers."
      />

      <form
        action={createSwapRequestAction}
        className="mt-10 rounded-2xl border border-gray-200 bg-white p-6 shadow-card"
      >
        <h2 className="text-lg font-semibold text-gray-900">Create swap request</h2>
        <p className="mt-2 text-sm text-gray-500">
          You need an active seller account and must offer one of your products or a cash amount.
        </p>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <label className="grid gap-2 text-sm font-medium text-gray-700">
            Target product ID
            <input
              name="productId"
              required
              className="rounded-md border border-gray-200 px-4 py-3 text-sm"
              placeholder="Product you want"
            />
          </label>
          <label className="grid gap-2 text-sm font-medium text-gray-700">
            Your offered product
            <select
              name="offeredProductId"
              className="rounded-md border border-gray-200 px-4 py-3 text-sm"
            >
              <option value="">Cash offer instead</option>
              {myProducts.map((product) => (
                <option key={product.id} value={product.id}>
                  {product.title}
                </option>
              ))}
            </select>
          </label>
          <label className="grid gap-2 text-sm font-medium text-gray-700">
            Cash amount (optional)
            <input
              name="cashAmount"
              type="number"
              min={0}
              className="rounded-md border border-gray-200 px-4 py-3 text-sm"
              placeholder="BDT"
            />
          </label>
          <label className="grid gap-2 text-sm font-medium text-gray-700 sm:col-span-2">
            Message
            <textarea
              name="message"
              rows={3}
              className="rounded-md border border-gray-200 px-4 py-3 text-sm"
              placeholder="Explain your swap proposal"
            />
          </label>
        </div>
        <button className="mt-5 rounded-md bg-brand-500 px-5 py-3 text-sm font-semibold text-white">
          Send swap request
        </button>
      </form>

      <div className="mt-10 space-y-4">
        {swaps.length ? (
          swaps.map((swap) => (
            <div
              key={swap.id}
              className="rounded-2xl border border-gray-200 bg-white p-6 shadow-card"
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="font-semibold text-gray-900">
                    {swap.product?.title ?? "Product swap"}
                  </p>
                  <p className="mt-1 text-sm text-gray-500">
                    With {swap.receiver?.name ?? swap.initiator?.name ?? "user"}
                  </p>
                  {swap.product ? (
                    <Link
                      href={`/products/${swap.product.slug}`}
                      className="mt-2 inline-block text-sm font-semibold text-brand-600"
                    >
                      View product
                    </Link>
                  ) : null}
                </div>
                <StatusBadge label={swap.status} />
              </div>

              {swap.offers?.length ? (
                <div className="mt-4 space-y-2">
                  {swap.offers.map((offer) => (
                    <div
                      key={offer.id}
                      className="flex flex-wrap items-center justify-between gap-3 rounded-lg bg-gray-50 p-3 text-sm"
                    >
                      <div>
                        <p className="font-medium text-gray-900">
                          {offer.offerer?.name ?? "Offer"}
                        </p>
                        <p className="text-gray-500">
                          {offer.cashAmount
                            ? formatPrice(offer.cashAmount)
                            : offer.productId ?? "Product offer"}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        {offer.isAccepted ? (
                          <StatusBadge label="Accepted" />
                        ) : (
                          <form action={acceptSwapOfferAction}>
                            <input type="hidden" name="requestId" value={swap.id} />
                            <input type="hidden" name="offerId" value={offer.id} />
                            <button className="rounded-md bg-brand-500 px-3 py-1 text-xs font-semibold text-white">
                              Accept
                            </button>
                          </form>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : null}

              <div className="mt-4 flex flex-wrap gap-2">
                <form action={counterSwapOfferAction} className="flex flex-wrap gap-2">
                  <input type="hidden" name="requestId" value={swap.id} />
                  <input
                    name="cashAmount"
                    type="number"
                    min={0}
                    placeholder="Counter cash"
                    className="rounded-md border border-gray-200 px-3 py-2 text-sm"
                  />
                  <button className="rounded-md border border-gray-200 px-3 py-2 text-sm font-semibold text-gray-700">
                    Counter offer
                  </button>
                </form>
                <form action={rejectSwapRequestAction}>
                  <input type="hidden" name="requestId" value={swap.id} />
                  <button className="rounded-md border border-red-200 px-3 py-2 text-sm font-semibold text-red-700">
                    Reject
                  </button>
                </form>
                <form action={cancelSwapRequestAction}>
                  <input type="hidden" name="requestId" value={swap.id} />
                  <button className="rounded-md border border-gray-200 px-3 py-2 text-sm font-semibold text-gray-700">
                    Cancel
                  </button>
                </form>
                <form action={completeSwapRequestAction}>
                  <input type="hidden" name="requestId" value={swap.id} />
                  <button className="rounded-md bg-gray-900 px-3 py-2 text-sm font-semibold text-white">
                    Complete
                  </button>
                </form>
              </div>
            </div>
          ))
        ) : (
          <EmptyState
            title="No swap requests"
            description="Start a swap from a product page or create one above."
          />
        )}
      </div>
    </section>
  );
}
