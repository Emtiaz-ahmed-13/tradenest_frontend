"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import {
  getAuthErrorMessage,
  getAuthNetworkErrorMessage,
} from "@/lib/auth-errors";

export function RegisterForm() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    const formData = new FormData(event.currentTarget);
    const name = String(formData.get("name") ?? "");
    const email = String(formData.get("email") ?? "");
    const password = String(formData.get("password") ?? "");

    try {
      const { error: authError } = await authClient.signUp.email({
        name,
        email,
        password,
        callbackURL: "/profile",
      });

      if (authError) {
        setError(
          getAuthErrorMessage(authError, "Registration failed. Please try again."),
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
        Join TradeNest
      </p>
      <h1 className="mt-3 text-3xl font-bold tracking-tight text-gray-900">
        Create your account
      </h1>
      <p className="mt-3 text-sm leading-6 text-gray-500">
        Start buying, selling, and messaging verified marketplace users.
      </p>

      <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
        <label className="grid gap-2 text-sm font-medium text-gray-700">
          Full name
          <input
            name="name"
            autoComplete="name"
            required
            className="rounded-md border border-gray-200 px-4 py-3 text-sm outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-100"
            placeholder="Your name"
          />
        </label>
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
            autoComplete="new-password"
            minLength={8}
            required
            className="rounded-md border border-gray-200 px-4 py-3 text-sm outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-100"
            placeholder="Create password"
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
          {isSubmitting ? "Creating account..." : "Create account"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-gray-500">
        Already have an account?{" "}
        <Link href="/login" className="font-semibold text-brand-600">
          Login
        </Link>
      </p>
    </section>
  );
}
