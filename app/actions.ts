"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { apiRequest, type Order } from "@/lib/api";

async function authHeaders() {
  const headers = new Headers();
  const cookie = (await cookies()).toString();

  if (cookie) {
    headers.set("Cookie", cookie);
  }

  return headers;
}

async function authedRequest<T>(
  path: string,
  init: RequestInit = {},
) {
  const headers = await authHeaders();
  const incoming = new Headers(init.headers);

  incoming.forEach((value, key) => headers.set(key, value));

  return apiRequest<T>(path, {
    ...init,
    headers,
  });
}

function value(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
}

export async function addToCartAction(productId: string) {
  await authedRequest("/cart/items", {
    method: "POST",
    body: JSON.stringify({ productId, quantity: 1 }),
  });

  revalidatePath("/cart");
  redirect("/cart");
}

export async function updateCartItemAction(formData: FormData) {
  const itemId = value(formData, "itemId");
  const quantity = Number(value(formData, "quantity"));

  await authedRequest(`/cart/items/${itemId}`, {
    method: "PATCH",
    body: JSON.stringify({ quantity }),
  });

  revalidatePath("/cart");
}

export async function removeCartItemAction(formData: FormData) {
  const itemId = value(formData, "itemId");

  await authedRequest(`/cart/items/${itemId}`, {
    method: "DELETE",
  });

  revalidatePath("/cart");
}

export async function placeOrderAction(formData: FormData) {
  const shippingAddressId = value(formData, "shippingAddressId");
  const notes = value(formData, "notes");

  const response = await authedRequest<Order[]>("/orders", {
    method: "POST",
    body: JSON.stringify({
      ...(shippingAddressId ? { shippingAddressId } : {}),
      ...(notes ? { notes } : {}),
    }),
  });

  revalidatePath("/cart");
  revalidatePath("/orders");
  redirect(`/orders/${response.data[0]?.id ?? ""}`);
}

export async function createPaymentAction(formData: FormData) {
  const orderId = value(formData, "orderId");
  const provider = value(formData, "provider") || "COD";
  const providerRef = value(formData, "providerRef");

  await authedRequest("/payments", {
    method: "POST",
    body: JSON.stringify({
      orderId,
      provider,
      ...(providerRef ? { providerRef } : {}),
    }),
  });

  revalidatePath(`/orders/${orderId}`);
}

export async function cancelOrderAction(formData: FormData) {
  const orderId = value(formData, "orderId");

  await authedRequest(`/orders/${orderId}/cancel`, {
    method: "PATCH",
  });

  revalidatePath("/orders");
  revalidatePath(`/orders/${orderId}`);
}

export async function createReturnRequestAction(formData: FormData) {
  const orderId = value(formData, "orderId");
  const reason = value(formData, "reason");

  await authedRequest("/returns", {
    method: "POST",
    body: JSON.stringify({ orderId, reason }),
  });

  revalidatePath(`/orders/${orderId}`);
}

export async function createConversationAction(formData: FormData) {
  const participantId = value(formData, "participantId");
  const productId = value(formData, "productId");

  await authedRequest("/chat/conversations", {
    method: "POST",
    body: JSON.stringify({
      participantId,
      ...(productId ? { productId } : {}),
    }),
  });

  revalidatePath("/messages");
  redirect("/messages");
}

export async function sendMessageAction(formData: FormData) {
  const conversationId = value(formData, "conversationId");
  const body = value(formData, "body");

  await authedRequest(`/chat/conversations/${conversationId}/messages`, {
    method: "POST",
    body: JSON.stringify({ body }),
  });

  revalidatePath("/messages");
}

export async function updateProfileAction(formData: FormData) {
  await authedRequest("/users/me", {
    method: "PATCH",
    body: JSON.stringify({
      name: value(formData, "name"),
      phone: value(formData, "phone") || undefined,
      image: value(formData, "image") || undefined,
    }),
  });

  revalidatePath("/profile");
}

export async function createAddressAction(formData: FormData) {
  await authedRequest("/users/me/addresses", {
    method: "POST",
    body: JSON.stringify({
      label: value(formData, "label") || undefined,
      fullName: value(formData, "fullName"),
      phone: value(formData, "phone"),
      line1: value(formData, "line1"),
      line2: value(formData, "line2") || undefined,
      city: value(formData, "city"),
      state: value(formData, "state") || undefined,
      postalCode: value(formData, "postalCode"),
      country: "BD",
      isDefault: formData.get("isDefault") === "on",
    }),
  });

  revalidatePath("/profile");
}

export async function sellerOnboardingAction(formData: FormData) {
  await authedRequest("/users/me/seller-onboarding", {
    method: "POST",
    body: JSON.stringify({
      shopName: value(formData, "shopName"),
      description: value(formData, "description") || undefined,
    }),
  });

  revalidatePath("/profile");
  revalidatePath("/seller/dashboard");
}

export async function createProductAction(formData: FormData) {
  const imageUrl = value(formData, "imageUrl");

  await authedRequest("/products", {
    method: "POST",
    body: JSON.stringify({
      title: value(formData, "title"),
      description: value(formData, "description"),
      condition: value(formData, "condition"),
      listingType: value(formData, "listingType"),
      status: value(formData, "status"),
      price: Number(value(formData, "price")),
      stock: Number(value(formData, "stock") || 1),
      categoryId: value(formData, "categoryId"),
      location: value(formData, "location") || undefined,
      images: imageUrl
        ? [{ url: imageUrl, alt: value(formData, "title"), isPrimary: true }]
        : undefined,
    }),
  });

  revalidatePath("/products");
  revalidatePath("/seller/dashboard");
  redirect("/seller/dashboard");
}

export async function approveProductAction(formData: FormData) {
  const productId = value(formData, "productId");

  await authedRequest(`/admin/products/${productId}/approve`, {
    method: "PATCH",
  });

  revalidatePath("/admin/dashboard");
}

export async function rejectProductAction(formData: FormData) {
  const productId = value(formData, "productId");

  await authedRequest(`/admin/products/${productId}/reject`, {
    method: "PATCH",
    body: JSON.stringify({ reason: value(formData, "reason") || "Rejected" }),
  });

  revalidatePath("/admin/dashboard");
}

export async function resolveReviewFlagAction(formData: FormData) {
  const reviewId = value(formData, "reviewId");

  await authedRequest(`/admin/reviews/${reviewId}/resolve-flag`, {
    method: "PATCH",
  });

  revalidatePath("/admin/dashboard");
}
