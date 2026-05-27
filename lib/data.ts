export const categories = [
  {
    name: "Electronics",
    count: "1,240 listings",
    icon: "PH",
    accent: "from-blue-50 to-blue-100 text-brand-700",
  },
  {
    name: "Fashion",
    count: "860 listings",
    icon: "ST",
    accent: "from-rose-50 to-orange-100 text-orange-700",
  },
  {
    name: "Home Living",
    count: "540 listings",
    icon: "HM",
    accent: "from-emerald-50 to-green-100 text-green-700",
  },
  {
    name: "Sports",
    count: "320 listings",
    icon: "SP",
    accent: "from-amber-50 to-yellow-100 text-amber-700",
  },
];

export const products = [
  {
    slug: "iphone-15-pro",
    title: "iPhone 15 Pro 256GB",
    price: 118000,
    condition: "Used",
    location: "Dhanmondi, Dhaka",
    seller: "Arif Hossain",
    rating: "4.9",
    image: "linear-gradient(135deg, #dbeafe 0%, #60a5fa 55%, #1d4ed8 100%)",
    badge: "Verified",
  },
  {
    slug: "sony-wh-1000xm5",
    title: "Sony WH-1000XM5 Headphones",
    price: 28500,
    condition: "New",
    location: "Gulshan, Dhaka",
    seller: "AudioHub BD",
    rating: "4.8",
    image: "linear-gradient(135deg, #f8fafc 0%, #cbd5e1 55%, #334155 100%)",
    badge: "Fast Delivery",
  },
  {
    slug: "macbook-air-m2",
    title: "MacBook Air M2 13 inch",
    price: 104000,
    condition: "Used",
    location: "Banani, Dhaka",
    seller: "Nusrat Jahan",
    rating: "5.0",
    image: "linear-gradient(135deg, #eff6ff 0%, #93c5fd 45%, #2563eb 100%)",
    badge: "Top Rated",
  },
  {
    slug: "canon-eos-m50",
    title: "Canon EOS M50 Mark II",
    price: 62000,
    condition: "Used",
    location: "Uttara, Dhaka",
    seller: "Frame House",
    rating: "4.7",
    image: "linear-gradient(135deg, #f1f5f9 0%, #94a3b8 50%, #0f172a 100%)",
    badge: "Limited",
  },
  {
    slug: "ergonomic-chair",
    title: "Ergonomic Office Chair",
    price: 14500,
    condition: "New",
    location: "Mirpur, Dhaka",
    seller: "WorkWell",
    rating: "4.6",
    image: "linear-gradient(135deg, #ecfdf5 0%, #86efac 55%, #22c55e 100%)",
    badge: "New Arrival",
  },
  {
    slug: "playstation-5",
    title: "PlayStation 5 Disc Edition",
    price: 73500,
    condition: "Used",
    location: "Bashundhara, Dhaka",
    seller: "GameNest",
    rating: "4.9",
    image: "linear-gradient(135deg, #fef3c7 0%, #fbbf24 55%, #f59e0b 100%)",
    badge: "Hot Deal",
  },
];

export const orders = [
  { id: "TN-2401", item: "MacBook Air M2 13 inch", status: "Delivered", total: 104000, date: "May 24, 2026" },
  { id: "TN-2402", item: "Sony WH-1000XM5 Headphones", status: "Processing", total: 28500, date: "May 25, 2026" },
  { id: "TN-2403", item: "Ergonomic Office Chair", status: "Pending", total: 14500, date: "May 26, 2026" },
];

export const conversations = [
  { name: "Arif Hossain", item: "iPhone 15 Pro", time: "10:42 PM", unread: 2 },
  { name: "AudioHub BD", item: "Sony headphones", time: "8:15 PM", unread: 0 },
  { name: "Frame House", item: "Canon EOS M50", time: "Yesterday", unread: 1 },
];

export function formatPrice(amount: number) {
  return new Intl.NumberFormat("en-BD", {
    style: "currency",
    currency: "BDT",
    maximumFractionDigits: 0,
  }).format(amount);
}
