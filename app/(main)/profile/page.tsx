import Link from "next/link";
import {
  createAddressAction,
  registerPushTokenAction,
  sellerOnboardingAction,
  updateNotificationPreferencesAction,
  updateProfileAction,
} from "@/app/actions";
import { StatCard } from "@/components/shared/StatCard";
import type { Address, NotificationPreference, User } from "@/lib/api";
import { safeServerApiGet } from "@/lib/server-api";

export default async function ProfilePage() {
  const [userResponse, addressesResponse, preferencesResponse] = await Promise.all([
    safeServerApiGet<User>("/users/me"),
    safeServerApiGet<Address[]>("/users/me/addresses"),
    safeServerApiGet<NotificationPreference>("/notifications/preferences/me"),
  ]);
  const user = userResponse?.data;
  const addresses = addressesResponse?.data ?? [];
  const preferences = preferencesResponse?.data;

  if (!user) {
    return (
      <section className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-card">
          <h1 className="text-3xl font-bold text-gray-900">Login required</h1>
          <p className="mt-3 text-gray-500">Please login to view your profile.</p>
          <Link
            href="/login"
            className="mt-6 inline-flex rounded-md bg-brand-500 px-5 py-3 text-sm font-semibold text-white"
          >
            Login
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-card">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
          <div className="flex h-24 w-24 items-center justify-center rounded-full bg-brand-100 text-2xl font-bold text-brand-700">
            {user.name?.slice(0, 2).toUpperCase() ?? "TN"}
          </div>
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-600">
              Profile
            </p>
            <h1 className="mt-2 text-4xl font-bold tracking-tight text-gray-900">
              {user.name ?? "TradeNest user"}
            </h1>
            <p className="mt-2 text-gray-500">
              {user.role} account | {user.email}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-8 grid gap-5 md:grid-cols-3">
        <StatCard label="Role" value={user.role ?? "BUYER"} helper="Current marketplace role" />
        <StatCard label="Addresses" value={String(addresses.length)} helper="Saved delivery addresses" />
        <StatCard
          label="Seller rating"
          value={String(user.sellerProfile?.rating ?? "New")}
          helper={user.sellerProfile?.shopName ?? "No seller profile yet"}
        />
      </div>

      <div className="mt-8 rounded-2xl border border-gray-200 bg-white p-6 shadow-card">
        <h2 className="text-xl font-semibold text-gray-900">Account settings</h2>
        <form action={updateProfileAction} className="mt-5 grid gap-4 sm:grid-cols-2">
          <label className="grid gap-2 text-sm font-medium text-gray-700">
            Full name
            <input
              name="name"
              defaultValue={user.name ?? ""}
              className="rounded-md border border-gray-200 px-4 py-3 text-sm outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-100"
            />
          </label>
          <label className="grid gap-2 text-sm font-medium text-gray-700">
            Phone number
            <input
              name="phone"
              defaultValue={user.phone ?? ""}
              className="rounded-md border border-gray-200 px-4 py-3 text-sm outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-100"
            />
          </label>
          <label className="grid gap-2 text-sm font-medium text-gray-700 sm:col-span-2">
            Avatar URL
            <input
              name="image"
              defaultValue={user.image ?? ""}
              className="rounded-md border border-gray-200 px-4 py-3 text-sm outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-100"
            />
          </label>
          <button className="rounded-md bg-brand-500 px-5 py-3 text-sm font-semibold text-white sm:w-fit">
            Save profile
          </button>
        </form>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-2">
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-card">
          <h2 className="text-xl font-semibold text-gray-900">Delivery addresses</h2>
          <div className="mt-5 space-y-3">
            {addresses.map((address) => (
              <div key={address.id} className="rounded-xl bg-gray-50 p-4 text-sm">
                <p className="font-semibold text-gray-900">
                  {address.label ?? "Address"} {address.isDefault ? "(Default)" : ""}
                </p>
                <p className="mt-1 text-gray-500">
                  {address.fullName}, {address.phone}
                </p>
                <p className="text-gray-500">
                  {address.line1}, {address.city} {address.postalCode}
                </p>
              </div>
            ))}
          </div>
          <form action={createAddressAction} className="mt-5 grid gap-3">
            <input name="label" className="rounded-md border border-gray-200 px-3 py-2 text-sm" placeholder="Label" />
            <input name="fullName" className="rounded-md border border-gray-200 px-3 py-2 text-sm" placeholder="Full name" required />
            <input name="phone" className="rounded-md border border-gray-200 px-3 py-2 text-sm" placeholder="Phone" required />
            <input name="line1" className="rounded-md border border-gray-200 px-3 py-2 text-sm" placeholder="Address line" required />
            <div className="grid grid-cols-2 gap-3">
              <input name="city" className="rounded-md border border-gray-200 px-3 py-2 text-sm" placeholder="City" required />
              <input name="postalCode" className="rounded-md border border-gray-200 px-3 py-2 text-sm" placeholder="Postal code" required />
            </div>
            <label className="flex items-center gap-2 text-sm text-gray-600">
              <input name="isDefault" type="checkbox" className="accent-brand-500" />
              Set as default
            </label>
            <button className="rounded-md bg-gray-900 px-4 py-2 text-sm font-semibold text-white">
              Add address
            </button>
          </form>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-card">
          <h2 className="text-xl font-semibold text-gray-900">Seller & notifications</h2>
          {user.sellerProfile ? (
            <div className="mt-5 rounded-xl bg-brand-50 p-4">
              <p className="font-semibold text-brand-900">{user.sellerProfile.shopName}</p>
              <p className="mt-1 text-sm text-brand-700">{user.sellerProfile.description}</p>
            </div>
          ) : (
            <form action={sellerOnboardingAction} className="mt-5 grid gap-3">
              <input name="shopName" className="rounded-md border border-gray-200 px-3 py-2 text-sm" placeholder="Shop name" required />
              <textarea name="description" className="rounded-md border border-gray-200 px-3 py-2 text-sm" placeholder="Shop description" />
              <button className="rounded-md bg-brand-500 px-4 py-2 text-sm font-semibold text-white">
                Become a seller
              </button>
            </form>
          )}

          <form action={updateNotificationPreferencesAction} className="mt-6 space-y-3 rounded-xl bg-gray-50 p-4 text-sm">
            <p className="font-semibold text-gray-900">Notification preferences</p>
            {(
              [
                ["inApp", "In-app"],
                ["email", "Email"],
                ["sms", "SMS"],
                ["push", "Push"],
                ["orderUpdates", "Order updates"],
                ["productUpdates", "Product updates"],
                ["promotions", "Promotions"],
              ] as const
            ).map(([name, label]) => (
              <label key={name} className="flex items-center gap-2 text-gray-600">
                <input
                  type="checkbox"
                  name={name}
                  defaultChecked={preferences?.[name] ?? true}
                  className="accent-brand-500"
                />
                {label}
              </label>
            ))}
            <button className="rounded-md bg-gray-900 px-4 py-2 text-sm font-semibold text-white">
              Save preferences
            </button>
          </form>
          <form action={registerPushTokenAction} className="mt-4 space-y-3 rounded-xl bg-gray-50 p-4 text-sm">
            <p className="font-semibold text-gray-900">Push token</p>
            <input
              name="token"
              required
              className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
              placeholder="Web push token"
            />
            <button className="rounded-md border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-700">
              Register token
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
