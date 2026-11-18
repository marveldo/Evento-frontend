"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { LoadingButton } from "@/components/common/LoadingButton";
import { CheckoutDialog } from "@/components/orders/CheckoutDialog";
import { api, ApiError } from "@/lib/api/client";
import { price as formatPrice } from "@/lib/format";
import { notifyApiError, notifyError, notifySuccess } from "@/lib/toast";
import type { Order } from "@/lib/types";

interface RegisterButtonProps {
  eventId: string;
  email: string;
  price: number | null;
}

export function RegisterButton({ eventId, email, price }: RegisterButtonProps) {
  const [pending, startTransition] = useTransition();
  const [order, setOrder] = useState<Order | null>(null);
  const router = useRouter();

  const register = () =>
    startTransition(async () => {
      try {
        const registration = await api.registerForEvent(eventId, email);
        if (registration.status === "payment_required") {
          setOrder(registration.order);
          return;
        }
        notifySuccess("You're registered", "You'll find yourself in the attendees list.");
        router.refresh();
      } catch (error) {
        if (error instanceof ApiError && error.status === 400) notifyError("Already registered", "You have already registered for this event.");
        else notifyApiError(error, "Couldn't register");
      }
    });

  return (
    <>
      <LoadingButton variant="brand" size="xl" className="w-full text-[12px]" loading={pending} onClick={register}>
        Click to Register · {formatPrice(price)}
      </LoadingButton>
      <CheckoutDialog order={order} onOpenChange={(open) => !open && setOrder(null)} />
    </>
  );
}
