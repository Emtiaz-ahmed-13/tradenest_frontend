"use client";

import { useEffect, useRef, useState } from "react";
import { API_BASE_URL } from "@/lib/api";

type PresignedUploadResponse = {
  data?: {
    key: string;
    uploadUrl: string;
    publicUrl?: string;
    method: "PUT";
    headers?: Record<string, string>;
  };
  message?: string;
};

const allowedImageTypes = ["image/jpeg", "image/png", "image/webp"];
const maxImageSizeBytes = 5 * 1024 * 1024;

function formatFileSize(bytes: number) {
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function ProductImageUploader() {
  const [previewUrl, setPreviewUrl] = useState("");
  const [publicUrl, setPublicUrl] = useState("");
  const [objectKey, setObjectKey] = useState("");
  const [status, setStatus] = useState("Choose a product image to upload.");
  const [error, setError] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    return () => {
      if (previewUrl.startsWith("blob:")) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  async function uploadFile(file: File) {
    setError("");
    setPublicUrl("");
    setObjectKey("");

    if (!allowedImageTypes.includes(file.type)) {
      setError("Only JPG, PNG, or WebP images are allowed.");
      return;
    }

    if (file.size > maxImageSizeBytes) {
      setError(`Image must be smaller than ${formatFileSize(maxImageSizeBytes)}.`);
      return;
    }

    if (previewUrl.startsWith("blob:")) {
      URL.revokeObjectURL(previewUrl);
    }

    setPreviewUrl(URL.createObjectURL(file));
    setStatus("Creating secure R2 upload URL...");
    setIsUploading(true);

    try {
      const presignResponse = await fetch(
        `${API_BASE_URL}/api/v1/uploads/presigned-url`,
        {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            purpose: "PRODUCT_IMAGE",
            fileName: file.name,
            contentType: file.type,
            sizeBytes: file.size,
          }),
        },
      );
      const presignPayload =
        (await presignResponse.json()) as PresignedUploadResponse;

      if (!presignResponse.ok || !presignPayload.data) {
        throw new Error(
          presignPayload.message ?? "Could not create upload URL.",
        );
      }

      if (!presignPayload.data.publicUrl) {
        throw new Error(
          "R2_PUBLIC_URL is missing in backend .env, so the uploaded image cannot be shown publicly.",
        );
      }

      setStatus("Uploading image to R2...");

      const uploadResponse = await fetch(presignPayload.data.uploadUrl, {
        method: presignPayload.data.method,
        headers: {
          "Content-Type": file.type,
          ...(presignPayload.data.headers ?? {}),
        },
        body: file,
      });

      if (!uploadResponse.ok) {
        throw new Error(
          "R2 upload failed. Check bucket CORS and R2 credentials.",
        );
      }

      setPublicUrl(presignPayload.data.publicUrl);
      setObjectKey(presignPayload.data.key);
      setStatus("Image uploaded to R2. Submit the listing to save it.");
    } catch (uploadError) {
      setError(
        uploadError instanceof Error
          ? uploadError.message
          : "Image upload failed.",
      );
      setStatus("Upload failed.");
    } finally {
      setIsUploading(false);
    }
  }

  return (
    <div className="mt-5 rounded-xl border border-dashed border-brand-200 bg-brand-50 p-5">
      <input type="hidden" name="imageUrl" value={publicUrl} />
      <input type="hidden" name="imageKey" value={objectKey} />

      <div className="grid gap-4 sm:grid-cols-[180px_1fr] sm:items-center">
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="relative h-40 overflow-hidden rounded-xl border border-brand-200 bg-white text-left shadow-sm"
        >
          {previewUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={previewUrl}
              alt="Product upload preview"
              className="h-full w-full object-cover"
            />
          ) : (
            <span className="flex h-full items-center justify-center px-4 text-center text-sm font-semibold text-brand-700">
              Choose product photo
            </span>
          )}
        </button>

        <div>
          <p className="text-sm font-semibold text-brand-800">
            Upload image to your R2 bucket
          </p>
          <p className="mt-2 text-sm leading-6 text-gray-600">
            JPG, PNG, or WebP. Max {formatFileSize(maxImageSizeBytes)}. After
            upload, the saved R2 public URL will be used on product cards and
            details.
          </p>
          <input
            ref={fileInputRef}
            type="file"
            accept={allowedImageTypes.join(",")}
            className="sr-only"
            onChange={(event) => {
              const file = event.target.files?.[0];

              if (file) {
                void uploadFile(file);
              }
            }}
          />
          <button
            type="button"
            disabled={isUploading}
            onClick={() => fileInputRef.current?.click()}
            className="mt-4 rounded-md bg-brand-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-600 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isUploading ? "Uploading..." : "Select image"}
          </button>
          <p className="mt-3 text-sm text-gray-600">{status}</p>
          {error ? (
            <p className="mt-2 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
              {error}
            </p>
          ) : null}
          {publicUrl ? (
            <p className="mt-2 break-all text-xs text-green-700">{publicUrl}</p>
          ) : null}
        </div>
      </div>
    </div>
  );
}
