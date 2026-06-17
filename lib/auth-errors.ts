const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

export function getAuthErrorMessage(
  error: { message?: string } | null | undefined,
  fallback = "Authentication failed. Please try again.",
) {
  return error?.message ?? fallback;
}

export function getAuthNetworkErrorMessage(error: unknown) {
  if (error instanceof TypeError && error.message === "Failed to fetch") {
    return `Cannot reach the API at ${API_BASE}. Start the backend with "cd tradenest_backend && npm run start:dev" and ensure PostgreSQL is running.`;
  }

  if (error instanceof Error && error.message) {
    return error.message;
  }

  return `Cannot reach the API at ${API_BASE}. Check that the backend is running.`;
}
