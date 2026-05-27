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
  role?: "BUYER" | "SELLER" | "ADMIN";
  isActive?: boolean;
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

export type Product = {
  id: string;
  slug: string;
  title: string;
  description: string;
  price: number | string;
  compareAtPrice?: number | string | null;
  currency?: string;
  condition: string;
  listingType?: string;
  status?: string;
  stock?: number;
  location?: string | null;
  viewCount?: number;
  category?: Category | null;
  seller?: User | null;
  sellerId?: string;
  images?: ProductImage[];
  createdAt?: string;
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
