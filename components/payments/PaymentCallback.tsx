"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Spinner } from "@/components/common/icons";
import { api } from "@/lib/api/client";
import { notifyApiError, notifyError, notifySuccess } from "@/lib/toast";

export function PaymentCallback({ reference }: { reference: string }) {
  const router = useRouter();
  const started = useRef(false);

  useEffect(() => {
    if (started.current) return;
    started.current = true;

    api
      .verifyPayment(reference)
      .then((order) => {
        if (order.status === "success") notifySuccess("Payment confirmed", "You're registered for the event.");
        else if (order.status === "pending")
          notifySuccess("Payment received", "We'll register you as soon as Paystack confirms it.");
        else notifyError("Payment failed", "Your registration wasn't completed.");
        router.replace(order.event_id ? `/events/${order.event_id}` : "/home");
        router.refresh();
      })
      .catch((error) => {
        notifyApiError(error, "Couldn't confirm the payment");
        router.replace("/home");
      });
  }, [reference, router]);

  return (
    <div className="flex flex-col items-center gap-y-4 text-center">
      <Spinner className="size-8 text-brand" />
      <p className="font-montserrat text-[20px] font-[700]">Confirming your payment…</p>
      <p className="font-nunito text-[14px] font-[600] text-[#676767]">This only takes a moment.</p>
    </div>
  );
}
