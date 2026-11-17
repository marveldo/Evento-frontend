import { api, ApiError } from "@/lib/api/client";
import type { PhotoKind } from "@/lib/types";

export const PHOTO_TYPES = ["image/jpeg", "image/png", "image/webp"];
export const PHOTO_MAX_BYTES = 2 * 1024 * 1024;

export async function uploadPhoto(file: File, kind: PhotoKind): Promise<string> {
  const signature = await api.photoSignature(kind);

  const form = new FormData();
  for (const [key, value] of Object.entries(signature.fields)) form.append(key, value);
  form.append("file", file);

  let res: Response;
  try {
    res = await fetch(signature.upload_url, { method: "POST", body: form });
  } catch {
    throw new ApiError(0, "Couldn't reach the image store. Check your connection and try again.");
  }
  const json = await res.json().catch(() => null);
  if (!res.ok || !json?.public_id) throw new ApiError(res.status, json?.error?.message ?? "The photo upload failed.");
  return signature.public_id;
}
