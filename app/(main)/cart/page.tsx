import Link from "next/link";
import {
  placeOrderAction,
  removeCartItemAction,
  updateCartItemAction,
} from "@/app/actions";
import { StatusBadge } from "@/components/shared/StatusBadge";
import {
  formatPrice,
  productImageStyle,
  type Address,
  type Cart,
} from "@/lib/api";
import { safeServerApiGet } from "@/lib/server-api";

export default async function CartPage() {
  const [cartResponse, addressesResponse] = await Promise.all([
    safeServerApiGet<Cart>("/cart"),
    safeServerApiGet<Address[]>("/users/me/addresses"),
  ]);
  const cart = cartResponse?.data;
  const addresses = addressesResponse?.data ?? [];

  if (!cartResponse) {
    return (
      <section className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-card">
          <h1 className="text-3xl font-bold text-gray-900">Login required</h1>
          <p className="mt-3 text-gray-500">Please login to manage your cart.</p>
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
      <h1 className="text-4xl font-bold tracking-tight text-gray-900">Your cart</h1>
      <p className="mt-3 text-gray-500">Review items before confirming the order.</p>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_360px]">
        <div className="space-y-4">
          {cart?.items.length ? cart.items.map((item) => (
            <div key={item.id} className="flex gap-5 rounded-xl border border-gray-200 bg-white p-4 shadow-card">
              <div
                className="h-28 w-28 shrink-0 rounded-lg"
                style={productImageStyle(item.product)}
              />
              <div className="flex flex-1 flex-col justify-between">
                <div>
                  <div className="flex items-start justify-between gap-4">
                    <h2 className="text-lg font-semibold text-gray-900">
                      {item.product.title}
                    </h2>
                    <StatusBadge label={item.product.condition} />
                  </div>
                  <p className="mt-1 text-sm text-gray-500">
                    {item.product.location ?? item.product.category?.name}
                  </p>
                </div>
                <div className="flex flex-wrap items-end justify-between gap-3">
                  <p className="text-lg font-bold text-gray-900">
                    {formatPrice(item.lineTotal, cart.currency)}
                  </p>
                  <div className="flex items-center gap-2">
                    <form action={updateCartItemAction} className="flex items-center gap-2">
                      <input type="hidden" name="itemId" value={item.id} />
                      <input
                        name="quantity"
                        type="number"
                        min={1}
                        defaultValue={item.quantity}
                        className="w-16 rounded-md border border-gray-200 px-2 py-1 text-sm"
                      />
                      <button className="text-sm font-semibold text-brand-600">
                        Update
                      </button>
                    </form>
                    <form action={removeCartItemAction}>
                      <input type="hidden" name="itemId" value={item.id} />
                      <button className="text-sm font-semibold text-red-600">
                        Remove
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          )) : (
            <div className="rounded-xl border border-dashed border-gray-200 bg-white p-8 text-center text-sm text-gray-500">
              Your cart is empty.
            </div>
          )}
        </div>

        <aside className="h-fit rounded-xl border border-gray-200 bg-white p-6 shadow-card">
          <h2 className="text-lg font-semibold text-gray-900">Order summary</h2>
          <div className="mt-5 space-y-3 text-sm">
            <div className="flex justify-between text-gray-500">
              <span>Subtotal</span>
              <span>{formatPrice(cart?.subtotal ?? 0, cart?.currency)}</span>
            </div>
            <div className="flex justify-between text-gray-500">
              <span>Service fee</span>
              <span>{formatPrice(0, cart?.currency)}</span>
            </div>
            <div className="border-t border-gray-200 pt-3 flex justify-between font-bold text-gray-900">
              <span>Total</span>
              <span>{formatPrice(cart?.subtotal ?? 0, cart?.currency)}</span>
            </div>
          </div>
          <form action={placeOrderAction} className="mt-6 space-y-4">
            <label className="grid gap-2 text-sm font-medium text-gray-700">
              Shipping address
              <select
                name="shippingAddressId"
                className="rounded-md border border-gray-200 px-3 py-2 text-sm"
                required={addresses.length > 0}
              >
                <option value="">Use default address</option>
                {addresses.map((address) => (
                  <option key={address.id} value={address.id}>
                    {address.label ?? address.city} - {address.line1}
                  </option>
                ))}
              </select>
            </label>
            <textarea
              name="notes"
              rows={3}
              className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
              placeholder="Delivery notes"
            />
            <button
              disabled={!cart?.items.length}
              className="w-full rounded-md bg-brand-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-brand-600 disabled:cursor-not-allowed disabled:opacity-60"
            >
              Confirm order
            </button>
          </form>
        </aside>
      </div>
    </section>
  );
}
