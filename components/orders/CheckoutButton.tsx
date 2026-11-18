"use client";

import { useCheckout } from "@/components/orders/useCheckout";

export function CheckoutButton({ orderId }: { orderId: string }) {
  const { starting, startCheckout } = useCheckout();
  return (
    <button
      type="button"
      onClick={() => startCheckout(orderId)}
      disabled={starting}
      className="rounded-full bg-brand px-3 py-1 font-nunito text-[12px] font-[700] text-white disabled:opacity-60"
    >
      {starting ? "Opening…" : "Checkout"}
    </button>
  );
}
