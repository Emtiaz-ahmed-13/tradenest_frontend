import Link from "next/link";
import {
  activateFlashSaleAction,
  approveKycAction,
  approveProductAction,
  cancelFlashSaleAction,
  createBannerAction,
  createCouponAction,
  createFlashSaleAction,
  deleteBannerAction,
  rejectKycAction,
  rejectProductAction,
  resolveReviewFlagAction,
  rewardReferralAction,
  updateAdminSettingsAction,
} from "@/app/actions";
import { ApiErrorPanel } from "@/components/shared/ApiErrorPanel";
import { EmptyState } from "@/components/shared/EmptyState";
import { LoginRequired } from "@/components/shared/LoginRequired";
import { StatCard } from "@/components/shared/StatCard";
import { StatusBadge } from "@/components/shared/StatusBadge";
import type {
  AdminDashboard,
  AnalyticsOverview,
  AuditLog,
  Banner,
  FlashSale,
  Product,
  Review,
  User,
} from "@/lib/api";
import { safeServerApiGet } from "@/lib/server-api";

export default async function AdminDashboardPage() {
  const [
    dashboardResponse,
    analyticsResponse,
    usersResponse,
    productsResponse,
    reviewsResponse,
    bannersResponse,
    settingsResponse,
    auditLogsResponse,
    flashSalesResponse,
  ] = await Promise.all([
    safeServerApiGet<AdminDashboard>("/admin/dashboard"),
    safeServerApiGet<AnalyticsOverview>("/analytics/overview"),
    safeServerApiGet<User[]>("/admin/users"),
    safeServerApiGet<Product[]>("/admin/products/moderation"),
    safeServerApiGet<Review[]>("/admin/reviews/flagged"),
    safeServerApiGet<Banner[]>("/admin/banners"),
    safeServerApiGet<Record<string, unknown>>("/admin/settings"),
    safeServerApiGet<AuditLog[]>("/admin/audit-logs"),
    safeServerApiGet<FlashSale[]>("/flash-sale"),
  ]);

  if (
    !dashboardResponse &&
    !usersResponse &&
    !productsResponse
  ) {
    return <LoginRequired description="Please login as admin to access this panel." />;
  }

  const dashboard = dashboardResponse?.data;
  const analytics = analyticsResponse?.data;
  const users = usersResponse?.data ?? [];
  const moderationProducts = productsResponse?.data ?? [];
  const flaggedReviews = reviewsResponse?.data ?? [];
  const banners = bannersResponse?.data ?? [];
  const settings = settingsResponse?.data ?? {};
  const auditLogs = auditLogsResponse?.data ?? [];
  const flashSales = flashSalesResponse?.data ?? [];

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
            {[
              ["Overview", "#overview"],
              ["Moderation", "#moderation"],
              ["Banners", "#banners"],
              ["Settings", "#settings"],
              ["Audit logs", "#audit"],
              ["Coupons", "#coupons"],
              ["Flash sales", "#flash-sales"],
              ["KYC", "#kyc"],
            ].map(([label, href]) => (
              <a
                key={label}
                href={href}
                className="rounded-md px-3 py-2 hover:bg-gray-100 hover:text-gray-900"
              >
                {label}
              </a>
            ))}
          </nav>
        </aside>

        <section id="overview">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-600">
            Admin dashboard
          </p>
          <h1 className="mt-2 text-4xl font-bold tracking-tight text-gray-900">
            Monitor marketplace health.
          </h1>
          <p className="mt-3 text-gray-500">
            Review users, listings, analytics, banners, and trust signals.
          </p>

          {!dashboardResponse ? (
            <div className="mt-6">
              <ApiErrorPanel message="Admin dashboard metrics unavailable. Other sections may still load." />
            </div>
          ) : null}

          <div className="mt-8 grid gap-5 md:grid-cols-4">
            <StatCard label="Users" value={String(dashboard?.users ?? users.length)} helper="Registered users" />
            <StatCard label="Sellers" value={String(dashboard?.sellers ?? 0)} helper="Seller profiles" />
            <StatCard label="Products" value={String(dashboard?.products ?? 0)} helper="Total listings" />
            <StatCard label="Pending KYC" value={String(dashboard?.pendingKyc ?? 0)} helper="Awaiting review" />
            <StatCard
              label="Paid orders"
              value={String(dashboard?.orders.paidCount ?? 0)}
              helper={dashboard ? `${dashboard.orders.paidTotal} BDT` : "GMV subset"}
            />
            <StatCard
              label="Completed payments"
              value={String(dashboard?.payments.completedCount ?? 0)}
              helper="Gateway + COD"
            />
            <StatCard label="Open returns" value={String(dashboard?.openReturns ?? 0)} helper="Needs attention" />
            <StatCard label="Active banners" value={String(dashboard?.activeBanners ?? banners.length)} helper="Live promos" />
          </div>

          {analytics ? (
            <div className="mt-8 rounded-2xl border border-gray-200 bg-white p-6 shadow-card">
              <h2 className="text-xl font-semibold text-gray-900">Analytics overview</h2>
              <pre className="mt-4 max-h-64 overflow-auto rounded-xl bg-gray-50 p-4 text-xs text-gray-600">
                {JSON.stringify(analytics, null, 2)}
              </pre>
            </div>
          ) : null}

          <div id="moderation" className="mt-8 rounded-2xl border border-gray-200 bg-white p-6 shadow-card">
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
                <EmptyState title="No products waiting for review" />
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
                <EmptyState title="No flagged reviews" />
              ) : null}
            </div>
          </div>

          <div id="banners" className="mt-8 rounded-2xl border border-gray-200 bg-white p-6 shadow-card">
            <h2 className="text-xl font-semibold text-gray-900">Banner CMS</h2>
            <form action={createBannerAction} className="mt-5 grid gap-3 sm:grid-cols-2">
              <input name="title" required placeholder="Banner title" className="rounded-md border border-gray-200 px-3 py-2 text-sm" />
              <input name="imageUrl" required placeholder="Image URL" className="rounded-md border border-gray-200 px-3 py-2 text-sm" />
              <input name="linkUrl" placeholder="Link URL" className="rounded-md border border-gray-200 px-3 py-2 text-sm" />
              <input name="position" placeholder="Position (home)" className="rounded-md border border-gray-200 px-3 py-2 text-sm" />
              <button className="rounded-md bg-brand-500 px-4 py-2 text-sm font-semibold text-white sm:col-span-2">
                Create banner
              </button>
            </form>
            <div className="mt-5 space-y-3">
              {banners.map((banner) => (
                <div key={banner.id} className="flex items-center justify-between rounded-xl bg-gray-50 p-4">
                  <div>
                    <p className="font-semibold text-gray-900">{banner.title}</p>
                    <p className="text-sm text-gray-500">{banner.position}</p>
                  </div>
                  <form action={deleteBannerAction}>
                    <input type="hidden" name="bannerId" value={banner.id} />
                    <button className="rounded-md border border-red-200 px-3 py-1 text-sm font-semibold text-red-700">
                      Delete
                    </button>
                  </form>
                </div>
              ))}
            </div>
          </div>

          <div id="settings" className="mt-8 rounded-2xl border border-gray-200 bg-white p-6 shadow-card">
            <h2 className="text-xl font-semibold text-gray-900">Platform settings</h2>
            <pre className="mt-4 rounded-xl bg-gray-50 p-4 text-xs text-gray-600">
              {JSON.stringify(settings, null, 2)}
            </pre>
            <form action={updateAdminSettingsAction} className="mt-4 space-y-3">
              <textarea
                name="settingsJson"
                rows={6}
                defaultValue={JSON.stringify(settings, null, 2)}
                className="w-full rounded-md border border-gray-200 px-3 py-2 font-mono text-xs"
              />
              <button className="rounded-md bg-gray-900 px-4 py-2 text-sm font-semibold text-white">
                Save settings
              </button>
            </form>
          </div>

          <div id="audit" className="mt-8 rounded-2xl border border-gray-200 bg-white p-6 shadow-card">
            <h2 className="text-xl font-semibold text-gray-900">Audit logs</h2>
            <div className="mt-5 space-y-3">
              {auditLogs.length ? (
                auditLogs.slice(0, 10).map((log) => (
                  <div key={log.id} className="rounded-xl bg-gray-50 p-4 text-sm">
                    <p className="font-semibold text-gray-900">
                      {log.action} · {log.entityType}
                    </p>
                    <p className="mt-1 text-gray-500">
                      {new Date(log.createdAt).toLocaleString("en-BD")}
                      {log.actor?.name ? ` · ${log.actor.name}` : ""}
                    </p>
                  </div>
                ))
              ) : (
                <EmptyState title="No audit logs loaded" />
              )}
            </div>
          </div>

          <div id="coupons" className="mt-8 rounded-2xl border border-gray-200 bg-white p-6 shadow-card">
            <h2 className="text-xl font-semibold text-gray-900">Create coupon</h2>
            <form action={createCouponAction} className="mt-5 grid gap-3 sm:grid-cols-2">
              <input name="code" required placeholder="SAVE10" className="rounded-md border border-gray-200 px-3 py-2 text-sm" />
              <select name="discountType" className="rounded-md border border-gray-200 px-3 py-2 text-sm">
                <option value="PERCENTAGE">Percentage</option>
                <option value="FIXED">Fixed amount</option>
              </select>
              <input name="discountValue" type="number" required placeholder="Discount value" className="rounded-md border border-gray-200 px-3 py-2 text-sm" />
              <input name="minOrderAmount" type="number" placeholder="Min order" className="rounded-md border border-gray-200 px-3 py-2 text-sm" />
              <input name="description" placeholder="Description" className="rounded-md border border-gray-200 px-3 py-2 text-sm sm:col-span-2" />
              <button className="rounded-md bg-brand-500 px-4 py-2 text-sm font-semibold text-white sm:col-span-2">
                Create coupon
              </button>
            </form>
          </div>

          <div id="flash-sales" className="mt-8 rounded-2xl border border-gray-200 bg-white p-6 shadow-card">
            <h2 className="text-xl font-semibold text-gray-900">Flash sale management</h2>
            <form action={createFlashSaleAction} className="mt-5 grid gap-3 sm:grid-cols-2">
              <input name="title" required placeholder="Sale title" className="rounded-md border border-gray-200 px-3 py-2 text-sm" />
              <input name="description" placeholder="Description" className="rounded-md border border-gray-200 px-3 py-2 text-sm" />
              <input name="startsAt" type="datetime-local" required className="rounded-md border border-gray-200 px-3 py-2 text-sm" />
              <input name="endsAt" type="datetime-local" required className="rounded-md border border-gray-200 px-3 py-2 text-sm" />
              <button className="rounded-md bg-brand-500 px-4 py-2 text-sm font-semibold text-white sm:col-span-2">
                Schedule flash sale
              </button>
            </form>
            <div className="mt-5 space-y-3">
              {flashSales.map((sale) => (
                <div key={sale.id} className="flex flex-wrap items-center justify-between gap-3 rounded-xl bg-gray-50 p-4">
                  <div>
                    <p className="font-semibold text-gray-900">{sale.title}</p>
                    <StatusBadge label={sale.status} />
                  </div>
                  <div className="flex gap-2">
                    <form action={activateFlashSaleAction}>
                      <input type="hidden" name="flashSaleId" value={sale.id} />
                      <button className="rounded-md bg-brand-500 px-3 py-1 text-xs font-semibold text-white">
                        Activate
                      </button>
                    </form>
                    <form action={cancelFlashSaleAction}>
                      <input type="hidden" name="flashSaleId" value={sale.id} />
                      <button className="rounded-md border border-red-200 px-3 py-1 text-xs font-semibold text-red-700">
                        Cancel
                      </button>
                    </form>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div id="kyc" className="mt-8 rounded-2xl border border-gray-200 bg-white p-6 shadow-card">
            <h2 className="text-xl font-semibold text-gray-900">KYC review</h2>
            <p className="mt-2 text-sm text-gray-500">
              {dashboard?.pendingKyc ?? 0} submissions pending. Enter a KYC ID to approve or reject.
            </p>
            <form action={approveKycAction} className="mt-4 flex flex-wrap gap-2">
              <input name="kycId" required placeholder="KYC ID" className="rounded-md border border-gray-200 px-3 py-2 text-sm" />
              <input name="adminNote" placeholder="Admin note" className="rounded-md border border-gray-200 px-3 py-2 text-sm" />
              <button className="rounded-md bg-brand-500 px-4 py-2 text-sm font-semibold text-white">
                Approve
              </button>
            </form>
            <form action={rejectKycAction} className="mt-3 flex flex-wrap gap-2">
              <input name="kycId" required placeholder="KYC ID" className="rounded-md border border-gray-200 px-3 py-2 text-sm" />
              <input name="adminNote" placeholder="Rejection reason" className="rounded-md border border-gray-200 px-3 py-2 text-sm" />
              <button className="rounded-md border border-red-200 px-4 py-2 text-sm font-semibold text-red-700">
                Reject
              </button>
            </form>
          </div>

          <div className="mt-8 rounded-2xl border border-gray-200 bg-white p-6 shadow-card">
            <h2 className="text-xl font-semibold text-gray-900">Referral rewards</h2>
            <form action={rewardReferralAction} className="mt-4 flex flex-wrap gap-2">
              <input name="referralId" required placeholder="Referral ID" className="rounded-md border border-gray-200 px-3 py-2 text-sm" />
              <input name="amount" type="number" placeholder="Reward amount" className="rounded-md border border-gray-200 px-3 py-2 text-sm" />
              <button className="rounded-md bg-gray-900 px-4 py-2 text-sm font-semibold text-white">
                Reward referral
              </button>
            </form>
          </div>
        </section>
      </div>
    </main>
  );
}
