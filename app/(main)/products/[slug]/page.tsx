import Link from "next/link";
import { notFound } from "next/navigation";
import { addToCartAction, createConversationAction } from "@/app/actions";
import { StatusBadge } from "@/components/shared/StatusBadge";
import {
  formatPrice,
  productImageStyle,
  type Product,
  type Review,
} from "@/lib/api";
import { serverApiGet } from "@/lib/server-api";

type ProductDetailPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const { slug } = await params;
  const productResponse = await serverApiGet<Product>(`/products/${slug}`).catch(
    () => null,
  );
  const product = productResponse?.data;

  if (!product) {
    notFound();
  }

  const reviewsResponse = await serverApiGet<Review[]>(
    `/reviews/product/${product.id}`,
  ).catch(() => ({ data: [] as Review[] }));
  const reviews = reviewsResponse.data;
  const sellerName =
    product.seller?.sellerProfile?.shopName ??
    product.seller?.name ??
    "TradeNest seller";

  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <Link href="/products" className="text-sm font-semibold text-brand-600">
        Back to products
      </Link>

      <div className="mt-6 grid gap-10 lg:grid-cols-[1fr_420px]">
        <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-card">
          <div
            className="h-[520px] rounded-xl"
            style={productImageStyle(product)}
            aria-label={product.title}
          />
          <div className="mt-4 grid grid-cols-4 gap-3">
            {(product.images?.length ? product.images : [null, null, null, null]).slice(0, 4).map((image, index) => (
              <div
                key={image?.id ?? index}
                className="h-24 rounded-lg bg-gray-100"
                style={image ? productImageStyle({ ...product, images: [image] }) : undefined}
              />
            ))}
          </div>
        </div>

        <aside className="h-fit rounded-2xl border border-gray-200 bg-white p-6 shadow-card">
          <div className="flex items-center justify-between gap-4">
            <StatusBadge label={product.condition} />
            <span className="rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-700">
              {product.status ?? "ACTIVE"}
            </span>
          </div>
          <h1 className="mt-5 text-3xl font-bold tracking-tight text-gray-900">
            {product.title}
          </h1>
          <p className="mt-3 text-4xl font-bold text-brand-600">
            {formatPrice(product.price, product.currency)}
          </p>
          <p className="mt-3 text-sm text-gray-500">
            {product.location ?? product.category?.name ?? "Bangladesh"}
          </p>

          <div className="mt-6 rounded-xl bg-gray-50 p-4">
            <p className="text-sm font-medium text-gray-500">Seller</p>
            <div className="mt-3 flex items-center justify-between">
              <div>
                <p className="font-semibold text-gray-900">{sellerName}</p>
                <p className="text-sm text-gray-500">
                  {product.seller?.sellerProfile?.rating ?? "New"} seller rating
                </p>
              </div>
              <span className="rounded-full bg-success/10 px-3 py-1 text-xs font-semibold text-green-700">
                {product.seller?.sellerProfile?.isVerified ? "Verified" : "Seller"}
              </span>
            </div>
          </div>

          <div className="mt-6 grid gap-3">
            <form action={addToCartAction.bind(null, product.id)}>
              <button
                className="w-full rounded-md bg-brand-500 px-5 py-3 text-center text-sm font-semibold text-white transition hover:bg-brand-600"
                type="submit"
              >
                Add to cart
              </button>
            </form>
            <form action={createConversationAction}>
              <input type="hidden" name="participantId" value={product.seller?.id ?? ""} />
              <input type="hidden" name="productId" value={product.id} />
              <button
                type="submit"
                className="w-full rounded-md border border-gray-200 bg-white px-5 py-3 text-center text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
                disabled={!product.seller?.id}
              >
                Message seller
              </button>
            </form>
            <Link
              href="/orders"
              className="rounded-md bg-brand-500 px-5 py-3 text-center text-sm font-semibold text-white transition hover:bg-brand-600"
            >
              View orders
            </Link>
          </div>

          <div className="mt-6 border-t border-gray-200 pt-6">
            <h2 className="text-lg font-semibold text-gray-900">Details</h2>
            <p className="mt-3 text-sm leading-6 text-gray-500">
              {product.description}
            </p>
            <p className="mt-4 text-sm text-gray-500">
              Stock: {product.stock ?? 0} | Category: {product.category?.name ?? "N/A"}
            </p>
          </div>
        </aside>
      </div>

      <section className="mt-10 rounded-2xl border border-gray-200 bg-white p-6 shadow-card">
        <h2 className="text-xl font-semibold text-gray-900">Reviews</h2>
        <div className="mt-5 space-y-4">
          {reviews.length ? reviews.map((review) => (
            <div key={review.id} className="rounded-xl bg-gray-50 p-4">
              <div className="flex items-center justify-between">
                <p className="font-semibold text-gray-900">
                  {review.author?.name ?? "Buyer"}
                </p>
                <StatusBadge label={`${review.rating}/5`} />
              </div>
              <p className="mt-2 text-sm text-gray-600">{review.comment}</p>
              {review.sellerReply ? (
                <p className="mt-3 rounded-lg bg-white p-3 text-sm text-gray-600">
                  Seller reply: {review.sellerReply}
                </p>
              ) : null}
            </div>
          )) : (
            <p className="text-sm text-gray-500">No reviews yet.</p>
          )}
        </div>
      </section>
    </section>
  );
}
