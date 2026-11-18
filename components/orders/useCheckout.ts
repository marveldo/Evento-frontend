"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api, ApiError } from "@/lib/api/client";
import { notifyApiError, notifyError } from "@/lib/toast";

export function useCheckout() {
  const router = useRouter();
  const [starting, setStarting] = useState(false);

  const startCheckout = async (orderId: string) => {
    setStarting(true);
    try {
      const { authorization_url } = await api.checkout(orderId);
      window.location.assign(authorization_url);
    } catch (error) {
      setStarting(false);
      if (error instanceof ApiError && error.status === 400) {
        notifyError("Can't check out", error.message);
        router.refresh();
      } else notifyApiError(error, "Couldn't start the checkout");
    }
  };

  return { starting, startCheckout };
}
