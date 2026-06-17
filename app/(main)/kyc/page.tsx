import { submitKycAction } from "@/app/actions";
import { LoginRequired } from "@/components/shared/LoginRequired";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatusBadge } from "@/components/shared/StatusBadge";
import type { KycVerification } from "@/lib/api";
import { safeServerApiGet } from "@/lib/server-api";

export default async function KycPage() {
  const response = await safeServerApiGet<KycVerification>("/kyc/status");

  if (!response) {
    return <LoginRequired description="Please login to submit KYC verification." />;
  }

  const kyc = response.data;
  const canSubmit = !kyc || kyc.status === "REJECTED";

  return (
    <section className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <PageHeader
        eyebrow="Verification"
        title="KYC status"
        description="Submit identity documents for seller verification and payouts."
      />

      {kyc ? (
        <div className="mt-8 rounded-2xl border border-gray-200 bg-white p-6 shadow-card">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-lg font-semibold text-gray-900">Current status</h2>
            <StatusBadge label={kyc.status} />
          </div>
          <p className="mt-3 text-sm text-gray-500">
            Submitted {new Date(kyc.createdAt).toLocaleString("en-BD")}
          </p>
          {kyc.adminNote ? (
            <p className="mt-3 rounded-lg bg-gray-50 p-3 text-sm text-gray-600">
              Admin note: {kyc.adminNote}
            </p>
          ) : null}
        </div>
      ) : null}

      {canSubmit ? (
        <form
          action={submitKycAction}
          className="mt-8 rounded-2xl border border-gray-200 bg-white p-6 shadow-card"
        >
          <h2 className="text-lg font-semibold text-gray-900">Submit documents</h2>
          <div className="mt-5 grid gap-4">
            <label className="grid gap-2 text-sm font-medium text-gray-700">
              NID number
              <input
                name="nidNumber"
                required
                className="rounded-md border border-gray-200 px-4 py-3 text-sm"
                placeholder="National ID number"
              />
            </label>
            <label className="grid gap-2 text-sm font-medium text-gray-700">
              Front image URL
              <input
                name="frontImageUrl"
                required
                type="url"
                className="rounded-md border border-gray-200 px-4 py-3 text-sm"
                placeholder="https://..."
              />
            </label>
            <label className="grid gap-2 text-sm font-medium text-gray-700">
              Back image URL
              <input
                name="backImageUrl"
                required
                type="url"
                className="rounded-md border border-gray-200 px-4 py-3 text-sm"
                placeholder="https://..."
              />
            </label>
            <label className="grid gap-2 text-sm font-medium text-gray-700">
              Selfie URL
              <input
                name="selfieUrl"
                required
                type="url"
                className="rounded-md border border-gray-200 px-4 py-3 text-sm"
                placeholder="https://..."
              />
            </label>
          </div>
          <button className="mt-6 rounded-md bg-brand-500 px-5 py-3 text-sm font-semibold text-white">
            Submit for review
          </button>
        </form>
      ) : (
        <p className="mt-8 text-sm text-gray-500">
          Your verification is {kyc?.status?.toLowerCase()}. No further action is needed right now.
        </p>
      )}
    </section>
  );
}
