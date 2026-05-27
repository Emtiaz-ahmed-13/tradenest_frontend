import { createProductAction } from "@/app/actions";
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
            <input type="hidden" name="listingType" value="MARKETPLACE" />
            <input type="hidden" name="status" value="PENDING_REVIEW" />
          </div>

          <label className="mt-5 grid gap-2 text-sm font-medium text-gray-700">
            Description
            <textarea
              name="description"
              rows={6}
              required
              className="rounded-md border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-brand-500 focus:ring-4 focus:ring-brand-100"
              placeholder="Describe condition, accessories, warranty, and pickup details."
            />
          </label>

          <label className="mt-5 grid gap-2 text-sm font-medium text-gray-700">
            Product image URL
            <input
              name="imageUrl"
              className="rounded-md border border-dashed border-brand-200 bg-brand-50 px-4 py-3 text-sm outline-none transition focus:border-brand-500 focus:ring-4 focus:ring-brand-100"
              placeholder="Paste an R2/public image URL"
            />
          </label>

          <button className="mt-6 rounded-md bg-brand-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-brand-600">
            Submit for review
          </button>
        </form>

        <aside className="h-fit rounded-2xl border border-gray-200 bg-white p-6 shadow-card">
          <h2 className="text-lg font-semibold text-gray-900">Listing tips</h2>
          <div className="mt-5 space-y-4 text-sm leading-6 text-gray-500">
            <p>Use natural daylight photos and show all important angles.</p>
            <p>Be honest about condition to reduce buyer disputes.</p>
            <p>Keep pricing competitive by checking similar listings.</p>
          </div>
        </aside>
      </div>
    </section>
  );
}
