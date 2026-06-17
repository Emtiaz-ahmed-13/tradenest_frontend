"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import {
  getAuthErrorMessage,
  getAuthNetworkErrorMessage,
} from "@/lib/auth-errors";

export function LoginForm() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email") ?? "");
    const password = String(formData.get("password") ?? "");

    try {
      const { error: authError } = await authClient.signIn.email({
        email,
        password,
        callbackURL: "/profile",
        rememberMe: true,
      });

      if (authError) {
        setError(
          getAuthErrorMessage(
            authError,
            "Login failed. Please check your credentials.",
          ),
        );
        return;
      }
    } catch (requestError) {
      setError(getAuthNetworkErrorMessage(requestError));
      return;
    } finally {
      setIsSubmitting(false);
    }

    router.push("/profile");
    router.refresh();
  }

  return (
    <section className="mx-auto max-w-md rounded-2xl border border-gray-200 bg-white p-8 shadow-card">
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-600">
        Welcome back
      </p>
      <h1 className="mt-3 text-3xl font-bold tracking-tight text-gray-900">
        Login to TradeNest
      </h1>
      <p className="mt-3 text-sm leading-6 text-gray-500">
        Continue managing orders, saved listings, and seller conversations.
      </p>

      <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
        <label className="grid gap-2 text-sm font-medium text-gray-700">
          Email address
          <input
            name="email"
            type="email"
            autoComplete="email"
            required
            className="rounded-md border border-gray-200 px-4 py-3 text-sm outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-100"
            placeholder="you@example.com"
          />
        </label>
        <label className="grid gap-2 text-sm font-medium text-gray-700">
          Password
          <input
            name="password"
            type="password"
            autoComplete="current-password"
            required
            className="rounded-md border border-gray-200 px-4 py-3 text-sm outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-100"
            placeholder="Enter password"
          />
        </label>

        {error ? (
          <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-md bg-brand-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-brand-600 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isSubmitting ? "Logging in..." : "Login"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-gray-500">
        New here?{" "}
        <Link href="/register" className="font-semibold text-brand-600">
          Create an account
        </Link>
      </p>
    </section>
  );
}
