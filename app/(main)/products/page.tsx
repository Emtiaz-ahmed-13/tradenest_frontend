import { ProductGrid } from "@/components/product/ProductGrid";
import { PageHeader } from "@/components/shared/PageHeader";
import type { Category, Product } from "@/lib/api";
import { serverApiGet } from "@/lib/server-api";

const filters = ["Newest", "Verified sellers", "Under BDT 50k", "Fast delivery"];

type ProductsPageProps = {
  searchParams: Promise<{
    q?: string;
    categoryId?: string;
    condition?: string;
    minPrice?: string;
    maxPrice?: string;
  }>;
};

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const params = await searchParams;
  const query = new URLSearchParams();

  for (const [key, value] of Object.entries(params)) {
    if (value) {
      query.set(key, value);
    }
  }

  const [productsResponse, categoriesResponse] = await Promise.all([
    serverApiGet<Product[]>(`/products?${query.toString()}`).catch(() => ({
      data: [] as Product[],
      meta: { total: 0 },
    })),
    serverApiGet<Category[]>("/categories").catch(() => ({ data: [] as Category[] })),
  ]);
  const products = productsResponse.data;
  const categories = categoriesResponse.data;

  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <PageHeader
        eyebrow="Marketplace"
        title="Find the right product quickly."
        description="Browse verified listings with clean filters, condition badges, seller ratings, and location context."
      />

      <div className="mt-10 grid gap-8 lg:grid-cols-[280px_1fr]">
        <aside className="h-fit rounded-xl border border-gray-200 bg-white p-5 shadow-card">
          <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
          <form className="mt-5 space-y-5">
            <label className="grid gap-2 text-sm font-medium text-gray-700">
              Search
              <input
                name="q"
                defaultValue={params.q}
                className="rounded-md border border-gray-200 px-3 py-2 text-sm outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-100"
                placeholder="Product name..."
              />
            </label>
            <div>
              <p className="mb-3 text-sm font-medium text-gray-700">Category</p>
              <div className="grid gap-2">
                {categories.map((category) => (
                  <label key={category.id} className="flex items-center gap-3 text-sm text-gray-500">
                    <input
                      type="radio"
                      name="categoryId"
                      value={category.id}
                      defaultChecked={params.categoryId === category.id}
                      className="h-4 w-4 rounded border-gray-200 accent-brand-500"
                    />
                    {category.name}
                  </label>
                ))}
              </div>
            </div>
            <label className="grid gap-2 text-sm font-medium text-gray-700">
              Condition
              <select
                name="condition"
                defaultValue={params.condition ?? ""}
                className="rounded-md border border-gray-200 px-3 py-2 text-sm"
              >
                <option value="">Any condition</option>
                <option value="NEW">New</option>
                <option value="USED">Used</option>
                <option value="REFURBISHED">Refurbished</option>
              </select>
            </label>
            <div className="grid grid-cols-2 gap-3">
              <label className="grid gap-2 text-sm font-medium text-gray-700">
                Min
                <input
                  name="minPrice"
                  type="number"
                  defaultValue={params.minPrice}
                  className="rounded-md border border-gray-200 px-3 py-2 text-sm"
                />
              </label>
              <label className="grid gap-2 text-sm font-medium text-gray-700">
                Max
                <input
                  name="maxPrice"
                  type="number"
                  defaultValue={params.maxPrice}
                  className="rounded-md border border-gray-200 px-3 py-2 text-sm"
                />
              </label>
            </div>
            <div>
              <p className="mb-3 text-sm font-medium text-gray-700">Quick filters</p>
              <div className="flex flex-wrap gap-2">
                {filters.map((filter) => (
                  <span key={filter} className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">
                    {filter}
                  </span>
                ))}
              </div>
            </div>
            <button className="w-full rounded-md bg-brand-500 px-4 py-2 text-sm font-semibold text-white">
              Apply filters
            </button>
          </form>
        </aside>

        <div>
          <div className="mb-5 flex items-center justify-between rounded-xl border border-gray-200 bg-white px-4 py-3 shadow-card">
            <p className="text-sm text-gray-500">
              Showing {products.length} active products
            </p>
            <select className="rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700">
              <option>Sort by newest</option>
              <option>Price low to high</option>
              <option>Top rated</option>
            </select>
          </div>
          <ProductGrid products={products} />
        </div>
      </div>
    </section>
  );
}
