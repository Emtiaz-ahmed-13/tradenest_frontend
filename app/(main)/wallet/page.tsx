import { EmptyState } from "@/components/shared/EmptyState";
import { LoginRequired } from "@/components/shared/LoginRequired";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { formatPrice, type Wallet, type WalletTransaction } from "@/lib/api";
import { safeServerApiGet } from "@/lib/server-api";

export default async function WalletPage() {
  const [walletResponse, transactionsResponse] = await Promise.all([
    safeServerApiGet<Wallet>("/wallet/me"),
    safeServerApiGet<WalletTransaction[]>("/wallet/me/transactions"),
  ]);

  if (!walletResponse) {
    return <LoginRequired description="Please login to view your wallet." />;
  }

  const wallet = walletResponse.data;
  const transactions = transactionsResponse?.data ?? [];

  return (
    <section className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
      <PageHeader
        eyebrow="Wallet"
        title="Your TradeNest wallet"
        description="Track available balance, held funds, and transaction history."
      />

      <div className="mt-10 grid gap-5 sm:grid-cols-3">
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-card">
          <p className="text-sm text-gray-500">Available balance</p>
          <p className="mt-2 text-3xl font-bold text-gray-900">
            {formatPrice(wallet.balance, wallet.currency)}
          </p>
        </div>
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-card">
          <p className="text-sm text-gray-500">Held in escrow</p>
          <p className="mt-2 text-3xl font-bold text-amber-700">
            {formatPrice(wallet.held, wallet.currency)}
          </p>
        </div>
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-card">
          <p className="text-sm text-gray-500">Transactions</p>
          <p className="mt-2 text-3xl font-bold text-brand-600">
            {transactions.length}
          </p>
        </div>
      </div>

      <div className="mt-10 rounded-2xl border border-gray-200 bg-white p-6 shadow-card">
        <h2 className="text-xl font-semibold text-gray-900">Transaction history</h2>
        <div className="mt-5 space-y-3">
          {transactions.length ? (
            transactions.map((transaction) => (
              <div
                key={transaction.id}
                className="flex flex-wrap items-center justify-between gap-3 rounded-xl bg-gray-50 p-4"
              >
                <div>
                  <p className="font-semibold text-gray-900">
                    {transaction.description ?? transaction.type}
                  </p>
                  <p className="mt-1 text-sm text-gray-500">
                    {new Date(transaction.createdAt).toLocaleString("en-BD")}
                    {transaction.reference ? ` · ${transaction.reference}` : ""}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <StatusBadge label={transaction.type} />
                  <span className="font-bold text-gray-900">
                    {formatPrice(transaction.amount, wallet.currency)}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <EmptyState
              title="No transactions yet"
              description="Wallet activity will appear here after orders, refunds, or referrals."
            />
          )}
        </div>
      </div>
    </section>
  );
}
