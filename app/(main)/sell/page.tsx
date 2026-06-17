import { bulkUploadProductsAction, createProductAction } from "@/app/actions";
import { ProductImageUploader } from "@/components/product/ProductImageUploader";
import { PageHeader } from "@/components/shared/PageHeader";
import type { Category } from "@/lib/api";
import { serverApiGet } from "@/lib/server-api";

export default async function SellPage() {
  const categories = (
    await serverApiGet<Category[]>("/categories").catch(() => ({
      data: [] as Category[],
    }))
  ).data;

  return (
    <section className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
      <PageHeader
        eyebrow="Create listing"
        title="Sell with a polished product page."
        description="Add clear product details, condition, price, and photos so buyers can decide with confidence."
      />

      <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_320px]">
        <form action={createProductAction} className="rounded-2xl border border-gray-200 bg-white p-6 shadow-card">
          <div className="grid gap-5 sm:grid-cols-2">
            <label className="grid gap-2 text-sm font-medium text-gray-700">
              Product title
              <input
                name="title"
                required
                className="rounded-md border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-brand-500 focus:ring-4 focus:ring-brand-100"
                placeholder="Enter product title"
              />
            </label>
            <label className="grid gap-2 text-sm font-medium text-gray-700">
              Price
              <input
                name="price"
                type="number"
                min={0}
                required
                className="rounded-md border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-brand-500 focus:ring-4 focus:ring-brand-100"
                placeholder="BDT price"
              />
            </label>
            <label className="grid gap-2 text-sm font-medium text-gray-700">
              Category
              <select
                name="categoryId"
                required
                className="rounded-md border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-brand-500 focus:ring-4 focus:ring-brand-100"
              >
                <option value="">Choose category</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </label>
            <label className="grid gap-2 text-sm font-medium text-gray-700">
              Location
              <input
                name="location"
                className="rounded-md border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-brand-500 focus:ring-4 focus:ring-brand-100"
                placeholder="Dhaka, Bangladesh"
              />
            </label>
            <label className="grid gap-2 text-sm font-medium text-gray-700">
              Condition
              <select
                name="condition"
                defaultValue="USED"
                className="rounded-md border border-gray-200 px-4 py-3 text-sm"
              >
                <option value="NEW">New</option>
                <option value="USED">Used</option>
                <option value="REFURBISHED">Refurbished</option>
              </select>
            </label>
            <label className="grid gap-2 text-sm font-medium text-gray-700">
              Stock
              <input
                name="stock"
                type="number"
                min={1}
                defaultValue={1}
                className="rounded-md border border-gray-200 px-4 py-3 text-sm"
              />
            </label>
            <label className="grid gap-2 text-sm font-medium text-gray-700">
              Tags (comma separated)
              <input
                name="tags"
                className="rounded-md border border-gray-200 px-4 py-3 text-sm"
                placeholder="electronics, warranty, like-new"
              />
            </label>
            <label className="grid gap-2 text-sm font-medium text-gray-700">
              Listing expiry
              <input
                name="expiresAt"
                type="datetime-local"
                className="rounded-md border border-gray-200 px-4 py-3 text-sm"
              />
            </label>
            <label className="flex items-center gap-3 text-sm font-medium text-gray-700 sm:col-span-2">
              <input type="checkbox" name="isBoosted" className="h-4 w-4 accent-brand-500" />
              Boost this listing
            </label>
            <label className="grid gap-2 text-sm font-medium text-gray-700 sm:col-span-2">
              Boosted until
              <input
                name="boostedUntil"
                type="datetime-local"
                className="rounded-md border border-gray-200 px-4 py-3 text-sm"
              />
            </label>
            <input type="hidden" name="listingType" value="MARKETPLACE" />
            <input type="hidden" name="status" value="PENDING_REVIEW" />
          </div>

          <label className="mt-5 grid gap-2 text-sm font-medium text-gray-700">
            Description
            <textarea
              name="description"
              rows={4}
              required
              className="rounded-md border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-brand-500 focus:ring-4 focus:ring-brand-100"
              placeholder="Describe condition, accessories, warranty, and pickup details."
            />
          </label>

          <label className="mt-5 grid gap-2 text-sm font-medium text-gray-700">
            Rich description (optional)
            <textarea
              name="richDescription"
              rows={4}
              className="rounded-md border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-brand-500 focus:ring-4 focus:ring-brand-100"
              placeholder="Long-form details, specs, or formatted notes."
            />
          </label>

          <ProductImageUploader />

          <button className="mt-6 rounded-md bg-brand-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-brand-600">
            Submit for review
          </button>
        </form>

        <aside className="space-y-6">
          <div className="h-fit rounded-2xl border border-gray-200 bg-white p-6 shadow-card">
            <h2 className="text-lg font-semibold text-gray-900">Listing tips</h2>
            <div className="mt-5 space-y-4 text-sm leading-6 text-gray-500">
              <p>Use natural daylight photos and show all important angles.</p>
              <p>Be honest about condition to reduce buyer disputes.</p>
              <p>Keep pricing competitive by checking similar listings.</p>
            </div>
          </div>

          <form
            action={bulkUploadProductsAction}
            className="rounded-2xl border border-gray-200 bg-white p-6 shadow-card"
          >
            <h2 className="text-lg font-semibold text-gray-900">Bulk upload</h2>
            <p className="mt-2 text-sm text-gray-500">
              Paste a JSON array of product objects matching the create product API.
            </p>
            <textarea
              name="productsJson"
              rows={8}
              required
              className="mt-4 w-full rounded-md border border-gray-200 px-3 py-2 font-mono text-xs"
              placeholder='[{"title":"Item","description":"...","condition":"USED","price":1000,"categoryId":"..."}]'
            />
            <button className="mt-4 rounded-md border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-700">
              Bulk upload
            </button>
          </form>
        </aside>
      </div>
    </section>
  );
}
