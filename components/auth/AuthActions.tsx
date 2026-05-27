"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

export function AuthActions() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  async function handleSignOut() {
    await authClient.signOut();
    router.push("/");
    router.refresh();
  }

  if (isPending) {
    return <div className="h-9 w-24 rounded-md bg-gray-100" />;
  }

  if (session?.user) {
    return (
      <div className="flex items-center gap-3">
        <Link
          href="/profile"
          className="hidden items-center gap-2 rounded-full bg-gray-50 py-1.5 pl-1.5 pr-3 text-sm font-medium text-gray-700 ring-1 ring-gray-200 transition hover:bg-gray-100 sm:flex"
        >
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-brand-100 text-xs font-bold text-brand-700">
            {session.user.name?.charAt(0).toUpperCase() ?? "U"}
          </span>
          {session.user.name ?? "Profile"}
        </Link>
        <button
          type="button"
          onClick={handleSignOut}
          className="rounded-md border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
        >
          Logout
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <Link
        href="/login"
        className="hidden rounded-md px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100 sm:block"
      >
        Login
      </Link>
      <Link
        href="/register"
        className="rounded-md bg-brand-500 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-600"
      >
        Join now
      </Link>
    </div>
  );
}
