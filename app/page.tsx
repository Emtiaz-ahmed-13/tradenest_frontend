import Link from "next/link";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { ProductGrid } from "@/components/product/ProductGrid";
import {
  formatPrice,
  productImageStyle,
  type Category,
  type Product,
} from "@/lib/api";
import { serverApiGet } from "@/lib/server-api";

const trustSignals = [
  { value: "12k+", label: "verified buyers" },
  { value: "4.9/5", label: "seller rating" },
  { value: "24h", label: "avg. response" },
];

const buyerSteps = [
  {
    title: "Discover verified listings",
    description:
      "Search active products by category, condition, seller, and price from one clean marketplace.",
  },
  {
    title: "Chat before checkout",
    description:
      "Start a buyer-seller conversation, ask questions, and keep product context attached.",
  },
  {
    title: "Track every order",
    description:
      "Cart, checkout, payment records, returns, and invoices stay connected to the order timeline.",
  },
];

const sellerTools = [
  "Seller onboarding",
  "Product review workflow",
  "Order management",
  "Payment records",
  "Buyer messaging",
  "Performance overview",
];

const safetyItems = [
  {
    title: "Admin moderation",
    description:
      "Products can be reviewed, approved, rejected, and monitored before going live.",
  },
  {
    title: "Verified reviews",
    description:
      "Review flows are tied to purchases, with seller replies and flag handling built in.",
  },
  {
    title: "Notification control",
    description:
      "Users can manage in-app, email, SMS, push, order, product, and promotion preferences.",
  },
];

export default async function Home() {
  const [productsResponse, categoriesResponse] = await Promise.all([
    serverApiGet<Product[]>("/products?limit=3").catch(() => ({ data: [] })),
    serverApiGet<Category[]>("/categories").catch(() => ({ data: [] })),
  ]);
  const products = productsResponse.data;
  const categories = categoriesResponse.data;
  const heroProduct = products[0];

  return (
    <div className="min-h-screen bg-surface">
      <Navbar />
      <main>
        {/* 1. Hero */}
        <section className="overflow-hidden bg-white">
          <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[1.02fr_0.98fr] lg:px-8 lg:py-18">
            <div>
              <p className="mb-4 inline-flex rounded-full bg-brand-50 px-4 py-2 text-sm font-semibold text-brand-700 ring-1 ring-brand-200">
                Trusted local marketplace for Bangladesh
              </p>
              <h1 className="max-w-3xl text-5xl font-bold tracking-tight text-gray-900 sm:text-6xl lg:text-7xl">
                Buy and sell faster with confidence.
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-gray-700">
                TradeNest brings verified sellers, clean product discovery,
                secure order tracking, and direct messaging into one modern
                marketplace experience.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/products"
                  className="rounded-md bg-brand-500 px-6 py-3 text-center text-sm font-semibold text-white shadow-lg shadow-brand-500/20 transition hover:bg-brand-600"
                >
                  Browse products
                </Link>
                <Link
                  href="/sell"
                  className="rounded-md border border-brand-200 bg-brand-50 px-6 py-3 text-center text-sm font-semibold text-brand-700 transition hover:bg-brand-100"
                >
                  Start selling
                </Link>
              </div>

              <div className="mt-10 grid max-w-xl grid-cols-3 gap-4">
                {trustSignals.map((signal) => (
                  <div key={signal.label}>
                    <p className="text-2xl font-bold text-gray-900">{signal.value}</p>
                    <p className="mt-1 text-sm text-gray-500">{signal.label}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative mx-auto w-full max-w-xl">
              <div className="absolute -left-6 top-10 hidden rounded-2xl border border-gray-200 bg-white p-4 shadow-card md:block">
                <p className="text-xs font-medium text-gray-500">New offer</p>
                <p className="mt-1 text-lg font-bold text-brand-600">
                  {formatPrice(heroProduct?.price ?? 0, heroProduct?.currency)}
                </p>
              </div>

              <div className="absolute -right-4 bottom-16 z-10 hidden rounded-2xl border border-gray-200 bg-white p-4 shadow-card md:block">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-100 text-sm font-bold text-brand-700">
                    AH
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">Verified seller</p>
                    <p className="text-xs text-gray-500">
                      {heroProduct?.seller?.sellerProfile?.rating ?? "New"} rating
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-4xl bg-linear-to-br from-brand-50 via-white to-brand-100 p-4 shadow-card">
                <div className="rounded-3xl border border-white bg-white/85 p-5 shadow-card backdrop-blur">
                  <div
                    className="relative h-72 overflow-hidden rounded-xl"
                    style={productImageStyle(heroProduct)}
                  >
                    <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-gray-900/65 to-transparent p-5">
                      <span className="rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-brand-700">
                        {heroProduct?.status ?? "Marketplace"}
                      </span>
                      <h2 className="mt-3 text-2xl font-bold text-white">
                        {heroProduct?.title ?? "Fresh listings"}
                      </h2>
                      <p className="mt-1 text-sm text-white/80">
                        {heroProduct?.location ?? "Browse active products"}
                      </p>
                    </div>
                  </div>

                  <div className="mt-5 flex items-center justify-between gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Current price</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {formatPrice(heroProduct?.price ?? 0, heroProduct?.currency)}
                      </p>
                    </div>
                    <Link
                      href={heroProduct ? `/products/${heroProduct.slug}` : "/products"}
                      className="rounded-md bg-gray-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-gray-700"
                    >
                      View details
                    </Link>
                  </div>

                  <div className="mt-5 grid grid-cols-3 gap-3">
                    {["Verified", "Fast", "Secure"].map((item) => (
                      <div key={item} className="rounded-lg bg-gray-50 p-3 text-center">
                        <p className="text-sm font-semibold text-gray-900">{item}</p>
                        <p className="mt-1 text-xs text-gray-500">Trade</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 2. Marketplace Metrics */}
        <section className="border-y border-gray-200 bg-surface">
          <div className="mx-auto grid max-w-7xl gap-4 px-4 py-8 sm:px-6 md:grid-cols-4 lg:px-8">
            {[
              { value: `${categories.length}+`, label: "live categories" },
              { value: `${products.length}+`, label: "featured listings" },
              { value: "40+", label: "backend features wired" },
              { value: "1", label: "unified marketplace" },
            ].map((metric) => (
              <div
                key={metric.label}
                className="rounded-2xl border border-gray-200 bg-white p-6 shadow-card"
              >
                <p className="text-3xl font-bold text-gray-900">{metric.value}</p>
                <p className="mt-2 text-sm font-medium text-gray-500">{metric.label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 3. Categories */}
        <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="mb-8 flex items-end justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-600">
                Categories
              </p>
              <h2 className="mt-2 text-3xl font-semibold text-gray-900">
                Shop by popular needs
              </h2>
            </div>
            <Link href="/products" className="text-sm font-semibold text-brand-600">
              View all
            </Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {categories.slice(0, 4).map((category, index) => (
              <Link
                href={`/products?categoryId=${category.id}`}
                key={category.id}
                className="group rounded-xl border border-gray-200 bg-white p-5 shadow-card transition hover:-translate-y-1 hover:shadow-card-hover"
              >
                <div
                  className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-linear-to-br from-blue-50 to-blue-100 text-sm font-bold text-brand-700"
                >
                  {category.name.slice(0, 2).toUpperCase() || `C${index + 1}`}
                </div>
                <div className="flex items-end justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {category.name}
                    </h3>
                    <p className="mt-2 text-sm text-gray-500">
                      {category.children?.length ?? 0} sub-categories
                    </p>
                  </div>
                  <span className="text-lg text-gray-300 transition group-hover:translate-x-1 group-hover:text-brand-500">
                    -&gt;
                  </span>
                </div>
              </Link>
            ))}
            {!categories.length ? (
              <div className="rounded-xl border border-dashed border-gray-200 bg-white p-5 text-sm text-gray-500 lg:col-span-4">
                No categories found yet.
              </div>
            ) : null}
          </div>
        </section>

        {/* 4. Featured Products */}
        <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
          <div className="mb-8 flex items-end justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-600">
                Featured
              </p>
              <h2 className="mt-2 text-3xl font-semibold text-gray-900">
                Fresh listings near you
              </h2>
            </div>
            <Link href="/products" className="text-sm font-semibold text-brand-600">
              Explore marketplace
            </Link>
          </div>
          <ProductGrid products={products} />
        </section>

        {/* 5. Buyer Journey */}
        <section className="bg-white">
          <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
            <div className="max-w-3xl">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-600">
                Buyer experience
              </p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight text-gray-900 sm:text-4xl">
                From discovery to delivery, every step is connected.
              </h2>
              <p className="mt-4 text-gray-500">
                TradeNest is built around real marketplace actions: browse,
                compare, message, cart, checkout, payment record, return, and
                order tracking.
              </p>
            </div>

            <div className="mt-10 grid gap-5 md:grid-cols-3">
              {buyerSteps.map((step, index) => (
                <div
                  key={step.title}
                  className="rounded-2xl border border-gray-200 bg-surface p-6"
                >
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-500 text-sm font-bold text-white">
                    {index + 1}
                  </span>
                  <h3 className="mt-5 text-lg font-semibold text-gray-900">
                    {step.title}
                  </h3>
                  <p className="mt-3 text-sm leading-6 text-gray-500">
                    {step.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 6. Seller Tools */}
        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-600">
                Seller studio
              </p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight text-gray-900 sm:text-4xl">
                A professional flow for sellers, not just a listing form.
              </h2>
              <p className="mt-4 text-gray-500">
                Sellers can onboard, submit products for review, manage active
                listings, handle buyer conversations, and track seller orders.
              </p>
              <Link
                href="/seller/dashboard"
                className="mt-6 inline-flex rounded-md bg-gray-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-gray-700"
              >
                Open seller dashboard
              </Link>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {sellerTools.map((tool) => (
                <div
                  key={tool}
                  className="rounded-2xl border border-gray-200 bg-white p-5 shadow-card"
                >
                  <p className="font-semibold text-gray-900">{tool}</p>
                  <p className="mt-2 text-sm text-gray-500">
                    Connected to backend APIs for real marketplace operations.
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 7. Trust And Safety */}
        <section className="bg-white">
          <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
            <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-600">
                  Trust layer
                </p>
                <h2 className="mt-3 text-3xl font-semibold tracking-tight text-gray-900 sm:text-4xl">
                  Moderation, reviews, and notifications built into the core.
                </h2>
                <p className="mt-4 text-gray-500">
                  Marketplace growth only works when users can trust sellers,
                  product quality, order status, and support signals.
                </p>
              </div>

              <div className="grid gap-4">
                {safetyItems.map((item) => (
                  <div
                    key={item.title}
                    className="rounded-2xl border border-gray-200 bg-surface p-6 shadow-card"
                  >
                    <h3 className="text-lg font-semibold text-gray-900">{item.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-gray-500">
                      {item.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* 8. Final CTA */}
        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="overflow-hidden rounded-3xl bg-linear-to-br from-brand-600 to-brand-900 p-8 shadow-card sm:p-12">
            <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-100">
                  Ready for real users
                </p>
                <h2 className="mt-3 max-w-3xl text-3xl font-bold tracking-tight text-white sm:text-4xl">
                  Start browsing, selling, or managing the marketplace today.
                </h2>
                <p className="mt-4 max-w-2xl text-brand-100">
                  The homepage now highlights the full product experience while
                  staying connected to the backend catalog and category APIs.
                </p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
                <Link
                  href="/products"
                  className="rounded-md bg-white px-6 py-3 text-center text-sm font-semibold text-brand-700 transition hover:bg-brand-50"
                >
                  Browse products
                </Link>
                <Link
                  href="/sell"
                  className="rounded-md border border-white/40 px-6 py-3 text-center text-sm font-semibold text-white transition hover:bg-white/10"
                >
                  Create listing
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
