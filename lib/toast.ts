import { toast } from "@/hooks/use-toast";
import { ApiError } from "@/lib/api/client";

export function notifySuccess(title: string, description?: string) {
  toast({ title, description, className: "bg-brand text-white font-nunito" });
}

export function notifyError(title: string, description?: string) {
  toast({ variant: "destructive", title, description, className: "text-white font-nunito" });
}

export function notifyApiError(error: unknown, title = "Something went wrong") {
  const description = error instanceof ApiError ? error.message : "Please try again later.";
  notifyError(title, description);
}
