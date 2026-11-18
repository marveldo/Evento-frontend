"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api/client";
import { notifyApiError, notifyError, notifySuccess } from "@/lib/toast";

export function CheckOrderButton({ reference }: { reference: string }) {
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  const check = () =>
    startTransition(async () => {
      try {
        const order = await api.verifyPayment(reference);
        if (order.status === "success") notifySuccess("Payment confirmed", "You're registered for the event.");
        else if (order.status === "pending") notifySuccess("Still pending", "Paystack hasn't confirmed this payment yet.");
        else notifyError("Payment failed", "Your registration wasn't completed.");
        router.refresh();
      } catch (error) {
        notifyApiError(error, "Couldn't check the payment");
      }
    });

  return (
    <button type="button" onClick={check} disabled={pending} className="font-nunito text-[12px] font-[700] text-brand underline disabled:opacity-60">
      {pending ? "Checking…" : "Check status"}
    </button>
  );
}
