import { apiRequest } from "@/lib/api";

type PresignedUpload = {
  key: string;
  uploadUrl: string;
  publicUrl?: string;
  method: string;
  headers: {
    "Content-Type": string;
  };
};

export async function uploadProductImage(file: File) {
  const presign = await apiRequest<PresignedUpload>("/uploads/presigned-url", {
    method: "POST",
    body: JSON.stringify({
      purpose: "PRODUCT_IMAGE",
      fileName: file.name,
      contentType: file.type,
      sizeBytes: file.size,
    }),
  });

  const { uploadUrl, publicUrl, key, headers } = presign.data;

  if (!publicUrl) {
    throw new Error(
      "R2 public URL is missing. Set R2_PUBLIC_URL in backend .env and restart the API.",
    );
  }

  const uploadResponse = await fetch(uploadUrl, {
    method: "PUT",
    headers: {
      "Content-Type": headers["Content-Type"] ?? file.type,
    },
    body: file,
  });

  if (!uploadResponse.ok) {
    throw new Error("Image upload to R2 failed. Check bucket CORS and credentials.");
  }

  return { publicUrl, key };
}
