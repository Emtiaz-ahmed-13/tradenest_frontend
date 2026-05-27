import Link from "next/link";
import {
  approveProductAction,
  rejectProductAction,
  resolveReviewFlagAction,
} from "@/app/actions";
import { StatCard } from "@/components/shared/StatCard";
import { StatusBadge } from "@/components/shared/StatusBadge";
import type { Product, Review, User } from "@/lib/api";
import { safeServerApiGet } from "@/lib/server-api";

export default async function AdminDashboardPage() {
  const [usersResponse, productsResponse, reviewsResponse] = await Promise.all([
    safeServerApiGet<User[]>("/admin/users"),
    safeServerApiGet<Product[]>("/admin/products/moderation"),
    safeServerApiGet<Review[]>("/admin/reviews/flagged"),
  ]);
  const users = usersResponse?.data ?? [];
  const moderationProducts = productsResponse?.data ?? [];
  const flaggedReviews = reviewsResponse?.data ?? [];

  return (
    <main className="min-h-screen bg-surface">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[260px_1fr] lg:px-8">
        <aside className="h-fit rounded-2xl border border-gray-200 bg-white p-5 shadow-card">
          <Link href="/" className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-900 text-sm font-bold text-white">
              TN
            </span>
            <span className="font-bold text-gray-900">Admin Panel</span>
          </Link>
          <nav className="mt-8 grid gap-2 text-sm font-medium text-gray-500">
            {["Overview", "Users", "Listings", "Orders", "Moderation"].map((item) => (
              <span key={item} className="rounded-md px-3 py-2 hover:bg-gray-100 hover:text-gray-900">
                {item}
              </span>
            ))}
          </nav>
        </aside>

        <section>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-600">
            Admin dashboard
          </p>
          <h1 className="mt-2 text-4xl font-bold tracking-tight text-gray-900">
            Monitor marketplace health.
          </h1>
          <p className="mt-3 text-gray-500">
            Review users, listings, disputes, and marketplace trust signals.
          </p>

          <div className="mt-8 grid gap-5 md:grid-cols-3">
            <StatCard label="Users" value={String(users.length)} helper="Loaded from admin API" />
            <StatCard label="Listings" value={String(moderationProducts.length)} helper="Pending moderation" />
            <StatCard label="Flagged reviews" value={String(flaggedReviews.length)} helper="Need admin action" />
          </div>

          <div className="mt-8 rounded-2xl border border-gray-200 bg-white p-6 shadow-card">
            <h2 className="text-xl font-semibold text-gray-900">Product moderation queue</h2>
            <div className="mt-5 space-y-4">
              {moderationProducts.map((product) => (
                <div key={product.id} className="rounded-xl bg-gray-50 p-4">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="font-semibold text-gray-900">{product.title}</p>
                      <p className="mt-1 text-sm text-gray-500">
                        Seller: {product.seller?.name ?? "Unknown"}
                      </p>
                    </div>
                    <StatusBadge label={product.status ?? "PENDING"} />
                  </div>
                  <div className="mt-4 flex gap-3">
                    <form action={approveProductAction}>
                      <input type="hidden" name="productId" value={product.id} />
                      <button className="rounded-md bg-brand-500 px-4 py-2 text-sm font-semibold text-white">
                        Approve
                      </button>
                    </form>
                    <form action={rejectProductAction} className="flex gap-2">
                      <input type="hidden" name="productId" value={product.id} />
                      <input
                        name="reason"
                        className="rounded-md border border-gray-200 px-3 py-2 text-sm"
                        placeholder="Reason"
                      />
                      <button className="rounded-md border border-red-200 px-4 py-2 text-sm font-semibold text-red-700">
                        Reject
                      </button>
                    </form>
                  </div>
                </div>
              ))}
              {!moderationProducts.length ? (
                <p className="text-sm text-gray-500">No products waiting for review.</p>
              ) : null}
            </div>
          </div>

          <div className="mt-8 rounded-2xl border border-gray-200 bg-white p-6 shadow-card">
            <h2 className="text-xl font-semibold text-gray-900">Flagged reviews</h2>
            <div className="mt-5 space-y-4">
              {flaggedReviews.map((review) => (
                <div key={review.id} className="flex items-center justify-between gap-4 rounded-xl bg-gray-50 p-4">
                  <div>
                    <p className="font-semibold text-gray-900">
                      {review.author?.name ?? "Reviewer"} rated {review.rating}/5
                    </p>
                    <p className="mt-1 text-sm text-gray-500">{review.comment}</p>
                  </div>
                  <form action={resolveReviewFlagAction}>
                    <input type="hidden" name="reviewId" value={review.id} />
                    <button className="rounded-md bg-gray-900 px-4 py-2 text-sm font-semibold text-white">
                      Resolve
                    </button>
                  </form>
                </div>
              ))}
              {!flaggedReviews.length ? (
                <p className="text-sm text-gray-500">No flagged reviews.</p>
              ) : null}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
