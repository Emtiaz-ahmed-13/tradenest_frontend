import {
  generateReferralCodeAction,
  trackReferralAction,
} from "@/app/actions";
import { EmptyState } from "@/components/shared/EmptyState";
import { LoginRequired } from "@/components/shared/LoginRequired";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { formatPrice, type ReferralSummary } from "@/lib/api";
import { safeServerApiGet } from "@/lib/server-api";

export default async function ReferralsPage() {
  const response = await safeServerApiGet<ReferralSummary>("/referral/mine");

  if (!response) {
    return <LoginRequired description="Please login to manage referrals." />;
  }

  const data = response.data;
  const stats = {
    total: data.referrals.length,
    pending: data.referrals.filter((item) => item.status === "PENDING").length,
    rewarded: data.referrals.filter((item) => item.status === "REWARDED").length,
    totalReward: data.referrals.reduce(
      (sum, item) => sum + Number(item.rewardAmount ?? 0),
      0,
    ),
  };

  return (
    <section className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
      <PageHeader
        eyebrow="Referrals"
        title="Invite friends, earn rewards"
        description="Share your referral code and track pending or rewarded invites."
      />

      <div className="mt-10 grid gap-5 sm:grid-cols-4">
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-card">
          <p className="text-sm text-gray-500">Total referrals</p>
          <p className="mt-2 text-2xl font-bold">{stats.total}</p>
        </div>
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-card">
          <p className="text-sm text-gray-500">Pending</p>
          <p className="mt-2 text-2xl font-bold">{stats.pending}</p>
        </div>
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-card">
          <p className="text-sm text-gray-500">Rewarded</p>
          <p className="mt-2 text-2xl font-bold">{stats.rewarded}</p>
        </div>
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-card">
          <p className="text-sm text-gray-500">Total reward</p>
          <p className="mt-2 text-2xl font-bold">
            {formatPrice(stats.totalReward)}
          </p>
        </div>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-card">
          <h2 className="text-lg font-semibold text-gray-900">Your referral code</h2>
          <p className="mt-3 rounded-xl bg-brand-50 px-4 py-3 font-mono text-lg font-bold text-brand-700">
            {data.code ?? "Not generated yet"}
          </p>
          <form action={generateReferralCodeAction} className="mt-4">
            <button className="rounded-md bg-brand-500 px-4 py-2 text-sm font-semibold text-white">
              {data.code ? "Refresh code" : "Generate code"}
            </button>
          </form>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-card">
          <h2 className="text-lg font-semibold text-gray-900">Use a referral code</h2>
          <form action={trackReferralAction} className="mt-4 space-y-3">
            <input
              name="code"
              required
              className="w-full rounded-md border border-gray-200 px-4 py-3 text-sm"
              placeholder="Enter referral code"
            />
            <button className="rounded-md bg-gray-900 px-4 py-2 text-sm font-semibold text-white">
              Apply referral
            </button>
          </form>
          {data.referredBy ? (
            <p className="mt-4 text-sm text-gray-500">
              Referred by {data.referredBy.name ?? "another user"}
            </p>
          ) : null}
        </div>
      </div>

      <div className="mt-8 rounded-2xl border border-gray-200 bg-white p-6 shadow-card">
        <h2 className="text-xl font-semibold text-gray-900">Referral history</h2>
        <div className="mt-5 space-y-3">
          {data.referrals.length ? (
            data.referrals.map((referral) => (
              <div
                key={referral.id}
                className="flex flex-wrap items-center justify-between gap-3 rounded-xl bg-gray-50 p-4"
              >
                <div>
                  <p className="font-semibold text-gray-900">
                    {referral.referredUser?.name ?? referral.referredUser?.email ?? "User"}
                  </p>
                  <p className="mt-1 text-sm text-gray-500">
                    {new Date(referral.createdAt).toLocaleDateString("en-BD")}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <StatusBadge label={referral.status} />
                  {referral.rewardAmount ? (
                    <span className="font-semibold text-green-700">
                      {formatPrice(referral.rewardAmount)}
                    </span>
                  ) : null}
                </div>
              </div>
            ))
          ) : (
            <EmptyState
              title="No referrals yet"
              description="Share your code to start earning rewards."
            />
          )}
        </div>
      </div>
    </section>
  );
}
