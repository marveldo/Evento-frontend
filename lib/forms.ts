import type { FieldValues, Path, UseFormSetError } from "react-hook-form";
import { ApiError } from "@/lib/api/client";

export function applyFieldErrors<T extends FieldValues>(error: unknown, setError: UseFormSetError<T>, fields: readonly Path<T>[]) {
  if (!(error instanceof ApiError)) return false;
  let applied = false;
  for (const { field, message } of error.fields) {
    if ((fields as readonly string[]).includes(field)) {
      setError(field as Path<T>, { message });
      applied = true;
    }
  }
  return applied;
}
