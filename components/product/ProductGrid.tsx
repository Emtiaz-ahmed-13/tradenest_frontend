import { serverApiGet } from "@/lib/server-api";
import type { Product } from "@/lib/api";
import { ProductCard } from "@/components/product/ProductCard";

type ProductGridProps = {
  limit?: number;
  products?: Product[];
};

export async function ProductGrid({ limit, products }: ProductGridProps) {
  const visibleProducts =
    products ??
    (
      await serverApiGet<Product[]>(
        `/products?limit=${limit ?? 12}`,
      ).catch(() => ({ data: [] as Product[] }))
    ).data;

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {visibleProducts.length ? visibleProducts.map((product) => (
        <ProductCard key={product.slug} product={product} />
      )) : (
        <div className="rounded-xl border border-dashed border-gray-200 bg-white p-8 text-sm text-gray-500 lg:col-span-3">
          No active products found. Add a listing from the seller page to see it here.
        </div>
      )}
    </div>
  );
}
