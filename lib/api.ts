export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

export type ApiResponse<T> = {
  success: boolean;
  message: string;
  data: T;
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    totalPages?: number;
    [key: string]: unknown;
  };
  timestamp?: string;
  path?: string;
};

export type SellerProfile = {
  id: string;
  shopName: string;
  slug: string;
  description?: string | null;
  rating?: number | string | null;
  totalSales?: number;
  isVerified?: boolean;
};

export type User = {
  id: string;
  name?: string | null;
  email?: string | null;
  emailVerified?: boolean;
  image?: string | null;
  phone?: string | null;
  role?: "BUYER" | "SELLER" | "ADMIN" | "MODERATOR";
  isActive?: boolean;
  referralCode?: string | null;
  createdAt?: string;
  sellerProfile?: SellerProfile | null;
};

export type Category = {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  parentId?: string | null;
  children?: Category[];
};

export type ProductImage = {
  id?: string;
  url: string;
  key?: string | null;
  alt?: string | null;
  isPrimary?: boolean;
  sortOrder?: number;
};

export type ProductTag = {
  id: string;
  name: string;
};

export type Product = {
  id: string;
  slug: string;
  title: string;
  description: string;
  richDescription?: string | null;
  price: number | string;
  compareAtPrice?: number | string | null;
  currency?: string;
  condition: string;
  listingType?: string;
  status?: string;
  stock?: number;
  location?: string | null;
  viewCount?: number;
  isBoosted?: boolean;
  boostedUntil?: string | null;
  expiresAt?: string | null;
  tags?: ProductTag[];
  category?: Category | null;
  seller?: User | null;
  sellerId?: string;
  images?: ProductImage[];
  createdAt?: string;
};

export type SearchResult = {
  products: Product[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

export type Wallet = {
  id: string;
  balance: number | string;
  held: number | string;
  currency: string;
};

export type WalletTransaction = {
  id: string;
  type: string;
  amount: number | string;
  balanceAfter: number | string;
  reference?: string | null;
  description?: string | null;
  createdAt: string;
};

export type Coupon = {
  id: string;
  code: string;
  description?: string | null;
  discountType: "PERCENTAGE" | "FIXED";
  discountValue: number | string;
  minOrderAmount?: number | string | null;
  maxDiscount?: number | string | null;
  usageLimit?: number | null;
  perUserLimit?: number;
  usedCount?: number;
  isActive?: boolean;
  startsAt?: string | null;
  expiresAt?: string | null;
};

export type CouponValidation = {
  valid: boolean;
  reason?: string;
  discount?: number;
  coupon?: Coupon;
};

export type FlashSaleProduct = {
  id: string;
  salePrice: number | string;
  stockLimit?: number | null;
  soldCount?: number;
  product: Product;
};

export type FlashSale = {
  id: string;
  title: string;
  description?: string | null;
  status: string;
  startsAt: string;
  endsAt: string;
  products?: FlashSaleProduct[];
};

export type ReferralEntry = {
  id: string;
  code: string;
  status: string;
  rewardAmount?: number | string | null;
  rewardedAt?: string | null;
  createdAt: string;
  referredUser?: Pick<User, "id" | "name" | "email">;
};

export type ReferralSummary = {
  code: string | null;
  referredBy?: Pick<User, "id" | "name"> | null;
  referrals: ReferralEntry[];
};

export type SwapOffer = {
  id: string;
  productId?: string | null;
  cashAmount?: number | string | null;
  message?: string | null;
  isAccepted: boolean;
  offerer?: Pick<User, "id" | "name" | "email">;
  createdAt: string;
};

export type SwapRequest = {
  id: string;
  status: string;
  message?: string | null;
  createdAt: string;
  initiator?: Pick<User, "id" | "name" | "email">;
  receiver?: Pick<User, "id" | "name" | "email">;
  product?: Product;
  offers?: SwapOffer[];
};

export type KycVerification = {
  id: string;
  status: string;
  nidNumber?: string | null;
  frontImageUrl?: string | null;
  backImageUrl?: string | null;
  selfieUrl?: string | null;
  adminNote?: string | null;
  reviewedAt?: string | null;
  createdAt: string;
};

export type Banner = {
  id: string;
  title: string;
  imageUrl: string;
  linkUrl?: string | null;
  position: string;
  sortOrder: number;
  isActive: boolean;
  startsAt?: string | null;
  endsAt?: string | null;
};

export type AuditLog = {
  id: string;
  action: string;
  entityType: string;
  entityId?: string | null;
  metadata?: Record<string, unknown> | null;
  createdAt: string;
  actor?: Pick<User, "id" | "name" | "email"> | null;
};

export type AdminDashboard = {
  users: number;
  sellers: number;
  products: number;
  orders: {
    count: number;
    total: number;
    paidCount: number;
    paidTotal: number;
  };
  payments: {
    completedCount: number;
    completedTotal: number;
  };
  pendingKyc: number;
  openReturns: number;
  activeBanners: number;
};

export type AnalyticsOverview = {
  gmv: Record<string, unknown>;
  users: Record<string, unknown>;
  orders: Record<string, unknown>;
  revenueByPeriod: Array<{ period: string; revenue: number; orders: number }>;
};

export type SellerDashboard = {
  totalSales: number;
  totalSalesValue: number;
  revenue: Record<string, unknown>;
  orderCountsByStatus: Record<string, number>;
  productPerformance: Array<{
    productId: string;
    unitsSold: number;
    orderLines: number;
    revenue: number;
  }>;
  payoutSummary: Record<string, unknown>;
  productsCount: number;
};

export type PaymentTransaction = {
  id: string;
  type: string;
  status: string;
  createdAt: string;
};

export type GatewayInitResponse = {
  payment: Payment;
  providerRef?: string | null;
  redirectUrl?: string | null;
  raw?: Record<string, unknown>;
};

export type CartItem = {
  id: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
  product: Product;
};

export type Cart = {
  id: string;
  itemCount: number;
  subtotal: number;
  currency: string;
  items: CartItem[];
};

export type Address = {
  id: string;
  label?: string | null;
  fullName: string;
  phone: string;
  line1: string;
  line2?: string | null;
  city: string;
  state?: string | null;
  postalCode: string;
  country: string;
  isDefault: boolean;
};

export type OrderItem = {
  id: string;
  title: string;
  price: number | string;
  quantity: number;
  product?: Pick<Product, "id" | "slug" | "images"> | null;
};

export type Order = {
  id: string;
  orderNumber: string;
  status: string;
  subtotal: number | string;
  shippingFee: number | string;
  tax: number | string;
  total: number | string;
  currency: string;
  notes?: string | null;
  createdAt: string;
  items: OrderItem[];
  buyer?: User;
  seller?: User;
  shippingAddress?: Address | null;
  payment?: Payment | null;
};

export type Payment = {
  id: string;
  orderId: string;
  provider: string;
  providerRef?: string | null;
  status: string;
  amount: number | string;
  currency: string;
  createdAt?: string;
};

export type ReturnRequest = {
  id: string;
  orderId: string;
  reason: string;
  status: string;
  createdAt: string;
  order?: Order;
};

export type Review = {
  id: string;
  rating: number;
  comment?: string | null;
  sellerReply?: string | null;
  isFlagged?: boolean;
  createdAt: string;
  author?: User;
};

export type NotificationPreference = {
  inApp: boolean;
  email: boolean;
  sms: boolean;
  push: boolean;
  orderUpdates: boolean;
  productUpdates: boolean;
  promotions: boolean;
};

export type ConversationParticipant = {
  userId: string;
  user: User;
  lastReadAt?: string | null;
};

export type Message = {
  id: string;
  body: string;
  attachmentUrl?: string | null;
  senderId: string;
  sender?: User;
  createdAt: string;
};

export type Conversation = {
  id: string;
  product?: Pick<Product, "id" | "title" | "slug"> | null;
  participants: ConversationParticipant[];
  messages: Message[];
  lastMessageAt?: string | null;
  createdAt: string;
};

export type ApiError = Error & {
  status?: number;
  payload?: unknown;
};

export async function apiRequest<T>(
  path: string,
  init: RequestInit = {},
): Promise<ApiResponse<T>> {
  const headers = new Headers(init.headers);

  if (init.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const response = await fetch(`${API_BASE_URL}/api/v1${path}`, {
    ...init,
    headers,
    credentials: "include",
    cache: init.cache ?? "no-store",
  });

  const payload = await response.json().catch(() => null);

  if (!response.ok) {
    const error = new Error(
      payload?.message ?? `Request failed with status ${response.status}`,
    ) as ApiError;
    error.status = response.status;
    error.payload = payload;
    throw error;
  }

  return payload as ApiResponse<T>;
}

export function formatPrice(amount: number | string, currency = "BDT") {
  return new Intl.NumberFormat("en-BD", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(Number(amount));
}

export function productImageUrl(product?: Pick<Product, "images"> | null) {
  return product?.images?.[0]?.url ?? null;
}

export function productImageStyle(product?: Pick<Product, "images" | "id"> | null) {
  const imageUrl = productImageUrl(product);

  if (imageUrl) {
    return {
      backgroundImage: `url(${imageUrl})`,
      backgroundSize: "cover",
      backgroundPosition: "center",
    };
  }

  return {
    background:
      "linear-gradient(135deg, #eff6ff 0%, #93c5fd 45%, #2563eb 100%)",
  };
}
