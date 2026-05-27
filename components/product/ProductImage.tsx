import Image from "next/image";
import { productImageUrl, type Product } from "@/lib/api";

type ProductImageProps = {
  product?: Pick<Product, "images" | "title"> | null;
  className?: string;
  priority?: boolean;
  sizes?: string;
};

export function ProductImage({
  product,
  className = "relative h-48 w-full overflow-hidden",
  priority = false,
  sizes = "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw",
}: ProductImageProps) {
  const src = productImageUrl(product);

  if (!src) {
    return (
      <div
        className={className}
        style={{
          background:
            "linear-gradient(135deg, #eff6ff 0%, #93c5fd 45%, #2563eb 100%)",
        }}
        aria-label={product?.title ?? "Product image"}
      />
    );
  }

  return (
    <div className={`${className} bg-gray-100`}>
      <Image
        src={src}
        alt={product?.title ?? "Product image"}
        fill
        priority={priority}
        sizes={sizes}
        className="object-cover"
      />
    </div>
  );
}
