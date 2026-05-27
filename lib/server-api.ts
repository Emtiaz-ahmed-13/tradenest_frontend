import { cookies } from "next/headers";
import { apiRequest, type ApiResponse } from "@/lib/api";

async function cookieHeader() {
  return (await cookies()).toString();
}

export async function serverApiGet<T>(
  path: string,
  init: RequestInit = {},
): Promise<ApiResponse<T>> {
  const headers = new Headers(init.headers);
  const cookie = await cookieHeader();

  if (cookie) {
    headers.set("Cookie", cookie);
  }

  return apiRequest<T>(path, {
    ...init,
    headers,
  });
}

export async function safeServerApiGet<T>(path: string) {
  try {
    return await serverApiGet<T>(path);
  } catch {
    return null;
  }
}
