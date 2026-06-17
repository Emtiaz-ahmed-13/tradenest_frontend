"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  apiRequest,
  type CouponValidation,
  type GatewayInitResponse,
  type Order,
  type Payment,
} from "@/lib/api";

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

function parseTags(raw: string) {
  return raw
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);
}

export async function createProductAction(formData: FormData) {
  const imageUrl = value(formData, "imageUrl");
  const imageKey = value(formData, "imageKey");
  const title = value(formData, "title");
  const tags = parseTags(value(formData, "tags"));
  const expiresAt = value(formData, "expiresAt");
  const boostedUntil = value(formData, "boostedUntil");

  await authedRequest("/products", {
    method: "POST",
    body: JSON.stringify({
      title,
      description: value(formData, "description"),
      richDescription: value(formData, "richDescription") || undefined,
      condition: value(formData, "condition"),
      listingType: value(formData, "listingType"),
      status: value(formData, "status"),
      price: Number(value(formData, "price")),
      stock: Number(value(formData, "stock") || 1),
      categoryId: value(formData, "categoryId"),
      location: value(formData, "location") || undefined,
      isBoosted: formData.get("isBoosted") === "on",
      ...(expiresAt ? { expiresAt } : {}),
      ...(boostedUntil ? { boostedUntil } : {}),
      ...(tags.length ? { tags } : {}),
      images: imageUrl
        ? [
            {
              url: imageUrl,
              key: imageKey || undefined,
              alt: title,
              isPrimary: true,
            },
          ]
        : undefined,
    }),
  });

  revalidatePath("/products");
  revalidatePath("/seller/dashboard");
  redirect("/seller/dashboard");
}

export async function bulkUploadProductsAction(formData: FormData) {
  const payload = value(formData, "productsJson");

  await authedRequest("/products/bulk", {
    method: "POST",
    body: JSON.stringify({ products: JSON.parse(payload) }),
  });

  revalidatePath("/products");
  revalidatePath("/seller/dashboard");
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

export async function validateCouponAction(formData: FormData) {
  const code = value(formData, "code");
  const orderAmount = Number(value(formData, "orderAmount"));

  await authedRequest<CouponValidation>("/coupons/validate", {
    method: "POST",
    body: JSON.stringify({ code, orderAmount }),
  });

  revalidatePath("/cart");
}

export async function applyCouponAction(formData: FormData) {
  const code = value(formData, "code");
  const orderAmount = Number(value(formData, "orderAmount"));
  const orderId = value(formData, "orderId");

  await authedRequest("/coupons/apply", {
    method: "POST",
    body: JSON.stringify({
      code,
      orderAmount,
      ...(orderId ? { orderId } : {}),
    }),
  });

  revalidatePath("/cart");
  revalidatePath("/orders");
}

export async function submitKycAction(formData: FormData) {
  await authedRequest("/kyc", {
    method: "POST",
    body: JSON.stringify({
      nidNumber: value(formData, "nidNumber"),
      frontImageUrl: value(formData, "frontImageUrl"),
      backImageUrl: value(formData, "backImageUrl"),
      selfieUrl: value(formData, "selfieUrl"),
    }),
  });

  revalidatePath("/kyc");
  revalidatePath("/profile");
}

export async function generateReferralCodeAction() {
  await authedRequest("/referral/code", { method: "POST" });
  revalidatePath("/referrals");
}

export async function trackReferralAction(formData: FormData) {
  await authedRequest("/referral/track", {
    method: "POST",
    body: JSON.stringify({ code: value(formData, "code") }),
  });

  revalidatePath("/referrals");
  revalidatePath("/profile");
}

export async function rewardReferralAction(formData: FormData) {
  const referralId = value(formData, "referralId");
  const amount = value(formData, "amount");

  await authedRequest(`/referral/${referralId}/reward`, {
    method: "POST",
    body: JSON.stringify({
      ...(amount ? { amount: Number(amount) } : {}),
    }),
  });

  revalidatePath("/admin/dashboard");
}

export async function createSwapRequestAction(formData: FormData) {
  const productId = value(formData, "productId");
  const offeredProductId = value(formData, "offeredProductId");
  const cashAmount = value(formData, "cashAmount");
  const message = value(formData, "message");

  await authedRequest("/swap/requests", {
    method: "POST",
    body: JSON.stringify({
      productId,
      ...(offeredProductId ? { offeredProductId } : {}),
      ...(cashAmount ? { cashAmount: Number(cashAmount) } : {}),
      ...(message ? { message } : {}),
    }),
  });

  revalidatePath("/swap");
}

export async function counterSwapOfferAction(formData: FormData) {
  const requestId = value(formData, "requestId");
  const offeredProductId = value(formData, "offeredProductId");
  const cashAmount = value(formData, "cashAmount");
  const message = value(formData, "message");

  await authedRequest(`/swap/requests/${requestId}/offers`, {
    method: "POST",
    body: JSON.stringify({
      ...(offeredProductId ? { offeredProductId } : {}),
      ...(cashAmount ? { cashAmount: Number(cashAmount) } : {}),
      ...(message ? { message } : {}),
    }),
  });

  revalidatePath("/swap");
}

export async function acceptSwapOfferAction(formData: FormData) {
  const requestId = value(formData, "requestId");
  const offerId = value(formData, "offerId");

  await authedRequest(`/swap/requests/${requestId}/offers/${offerId}/accept`, {
    method: "PATCH",
  });

  revalidatePath("/swap");
}

export async function rejectSwapRequestAction(formData: FormData) {
  const requestId = value(formData, "requestId");

  await authedRequest(`/swap/requests/${requestId}/reject`, {
    method: "PATCH",
  });

  revalidatePath("/swap");
}

export async function cancelSwapRequestAction(formData: FormData) {
  const requestId = value(formData, "requestId");

  await authedRequest(`/swap/requests/${requestId}/cancel`, {
    method: "PATCH",
  });

  revalidatePath("/swap");
}

export async function completeSwapRequestAction(formData: FormData) {
  const requestId = value(formData, "requestId");

  await authedRequest(`/swap/requests/${requestId}/complete`, {
    method: "PATCH",
  });

  revalidatePath("/swap");
}

export async function initGatewayPaymentAction(formData: FormData) {
  const paymentId = value(formData, "paymentId");
  const orderId = value(formData, "orderId");
  const returnUrl = value(formData, "returnUrl");
  const cancelUrl = value(formData, "cancelUrl");

  const response = await authedRequest<GatewayInitResponse>(
    `/payments/${paymentId}/init-gateway`,
    {
      method: "POST",
      body: JSON.stringify({
        ...(returnUrl ? { returnUrl } : {}),
        ...(cancelUrl ? { cancelUrl } : {}),
      }),
    },
  );

  revalidatePath(`/orders/${orderId}`);

  if (response.data.redirectUrl) {
    redirect(response.data.redirectUrl);
  }
}

export async function createGatewayPaymentAction(formData: FormData) {
  const orderId = value(formData, "orderId");
  const provider = value(formData, "provider");

  const paymentResponse = await authedRequest<Payment>("/payments", {
    method: "POST",
    body: JSON.stringify({ orderId, provider }),
  });

  revalidatePath(`/orders/${orderId}`);

  const payment = paymentResponse.data;
  const gatewayProviders = ["BKASH", "NAGAD", "SSLCOMMERZ"];

  if (gatewayProviders.includes(provider)) {
    const initResponse = await authedRequest<GatewayInitResponse>(
      `/payments/${payment.id}/init-gateway`,
      { method: "POST", body: JSON.stringify({}) },
    );

    if (initResponse.data.redirectUrl) {
      redirect(initResponse.data.redirectUrl);
    }
  }
}

export async function updateNotificationPreferencesAction(formData: FormData) {
  const fields = [
    "inApp",
    "email",
    "sms",
    "push",
    "orderUpdates",
    "productUpdates",
    "promotions",
  ] as const;

  const payload = Object.fromEntries(
    fields.map((field) => [field, formData.get(field) === "on"]),
  );

  await authedRequest("/notifications/preferences/me", {
    method: "PATCH",
    body: JSON.stringify(payload),
  });

  revalidatePath("/profile");
}

export async function registerPushTokenAction(formData: FormData) {
  await authedRequest("/notifications/push-tokens", {
    method: "POST",
    body: JSON.stringify({
      token: value(formData, "token"),
      platform: value(formData, "platform") || "web",
    }),
  });

  revalidatePath("/profile");
}

export async function createCouponAction(formData: FormData) {
  await authedRequest("/coupons", {
    method: "POST",
    body: JSON.stringify({
      code: value(formData, "code"),
      description: value(formData, "description") || undefined,
      discountType: value(formData, "discountType"),
      discountValue: Number(value(formData, "discountValue")),
      minOrderAmount: value(formData, "minOrderAmount")
        ? Number(value(formData, "minOrderAmount"))
        : undefined,
      maxDiscount: value(formData, "maxDiscount")
        ? Number(value(formData, "maxDiscount"))
        : undefined,
      usageLimit: value(formData, "usageLimit")
        ? Number(value(formData, "usageLimit"))
        : undefined,
      isActive: formData.get("isActive") !== "off",
    }),
  });

  revalidatePath("/admin/dashboard");
}

export async function createFlashSaleAction(formData: FormData) {
  await authedRequest("/flash-sale", {
    method: "POST",
    body: JSON.stringify({
      title: value(formData, "title"),
      description: value(formData, "description") || undefined,
      startsAt: value(formData, "startsAt"),
      endsAt: value(formData, "endsAt"),
    }),
  });

  revalidatePath("/admin/dashboard");
  revalidatePath("/flash-sales");
}

export async function activateFlashSaleAction(formData: FormData) {
  const flashSaleId = value(formData, "flashSaleId");

  await authedRequest(`/flash-sale/${flashSaleId}/activate`, {
    method: "PATCH",
  });

  revalidatePath("/admin/dashboard");
  revalidatePath("/flash-sales");
}

export async function cancelFlashSaleAction(formData: FormData) {
  const flashSaleId = value(formData, "flashSaleId");

  await authedRequest(`/flash-sale/${flashSaleId}/cancel`, {
    method: "PATCH",
  });

  revalidatePath("/admin/dashboard");
  revalidatePath("/flash-sales");
}

export async function createBannerAction(formData: FormData) {
  await authedRequest("/admin/banners", {
    method: "POST",
    body: JSON.stringify({
      title: value(formData, "title"),
      imageUrl: value(formData, "imageUrl"),
      linkUrl: value(formData, "linkUrl") || undefined,
      position: value(formData, "position") || "home",
      sortOrder: value(formData, "sortOrder")
        ? Number(value(formData, "sortOrder"))
        : undefined,
      isActive: formData.get("isActive") !== "off",
    }),
  });

  revalidatePath("/admin/dashboard");
}

export async function deleteBannerAction(formData: FormData) {
  const bannerId = value(formData, "bannerId");

  await authedRequest(`/admin/banners/${bannerId}`, {
    method: "DELETE",
  });

  revalidatePath("/admin/dashboard");
}

export async function updateAdminSettingsAction(formData: FormData) {
  const settingsJson = value(formData, "settingsJson");

  await authedRequest("/admin/settings", {
    method: "PATCH",
    body: JSON.stringify({ settings: JSON.parse(settingsJson) }),
  });

  revalidatePath("/admin/dashboard");
}

export async function approveKycAction(formData: FormData) {
  const kycId = value(formData, "kycId");

  await authedRequest(`/kyc/${kycId}/approve`, {
    method: "PATCH",
    body: JSON.stringify({
      adminNote: value(formData, "adminNote") || undefined,
    }),
  });

  revalidatePath("/admin/dashboard");
}

export async function rejectKycAction(formData: FormData) {
  const kycId = value(formData, "kycId");

  await authedRequest(`/kyc/${kycId}/reject`, {
    method: "PATCH",
    body: JSON.stringify({
      adminNote: value(formData, "adminNote") || "Rejected",
    }),
  });

  revalidatePath("/admin/dashboard");
}
