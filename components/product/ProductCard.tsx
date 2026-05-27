import Link from "next/link";
import {
  formatPrice,
  productImageStyle,
  type Product,
} from "@/lib/api";
import { StatusBadge } from "@/components/shared/StatusBadge";

type ProductCardProps = {
  product: Product;
};

export function ProductCard({ product }: ProductCardProps) {
  const sellerName =
    product.seller?.sellerProfile?.shopName ??
    product.seller?.name ??
    "TradeNest seller";
  const rating = product.seller?.sellerProfile?.rating ?? "New";

  return (
    <Link
      href={`/products/${product.slug}`}
      className="group overflow-hidden rounded-xl border border-gray-200 bg-white shadow-card transition hover:-translate-y-1 hover:shadow-card-hover"
    >
      <div
        className="relative h-48"
        style={productImageStyle(product)}
        aria-label={product.title}
      >
        <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-gray-700 shadow-sm">
          {product.status ?? "ACTIVE"}
        </span>
      </div>
      <div className="space-y-4 p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="line-clamp-2 text-lg font-semibold text-gray-900 group-hover:text-brand-600">
              {product.title}
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              {product.location ?? product.category?.name ?? "Bangladesh"}
            </p>
          </div>
          <StatusBadge label={product.condition} />
        </div>
        <div className="flex items-end justify-between">
          <div>
            <p className="text-xl font-bold text-gray-900">
              {formatPrice(product.price, product.currency)}
            </p>
            <p className="text-xs text-gray-500">Seller: {sellerName}</p>
          </div>
          <span className="rounded-md bg-brand-50 px-2 py-1 text-xs font-semibold text-brand-700">
            {rating} rated
          </span>
        </div>
      </div>
    </Link>
  );
}
