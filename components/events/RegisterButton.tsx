"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { LoadingButton } from "@/components/common/LoadingButton";
import { api, ApiError } from "@/lib/api/client";
import { notifyApiError, notifyError, notifySuccess } from "@/lib/toast";

export function RegisterButton({ eventId, email }: { eventId: string; email: string }) {
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  const register = () =>
    startTransition(async () => {
      try {
        const registration = await api.registerForEvent(eventId, email);
        if (registration.status === "payment_required") {
          window.location.assign(registration.authorization_url);
          return;
        }
        notifySuccess("You're registered", "You'll find yourself in the attendees list.");
        router.refresh();
      } catch (error) {
        if (error instanceof ApiError && error.status === 400) notifyError("Already registered", "You have already registered for this event.");
        else if (error instanceof ApiError && (error.status === 502 || error.status === 503)) notifyError("Payment unavailable", error.message);
        else notifyApiError(error, "Couldn't register");
      }
    });

  return (
    <LoadingButton variant="brand" size="xl" className="w-full text-[12px]" loading={pending} onClick={register}>
      Click to Register
    </LoadingButton>
  );
}
