"use client";

import Link from "next/link";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { LoadingButton } from "@/components/common/LoadingButton";
import { useCheckout } from "@/components/orders/useCheckout";
import { money } from "@/lib/format";
import type { Order } from "@/lib/types";

interface CheckoutDialogProps {
  order: Order | null;
  onOpenChange: (open: boolean) => void;
}

export function CheckoutDialog({ order, onOpenChange }: CheckoutDialogProps) {
  const { starting, startCheckout } = useCheckout();
  if (!order) return null;

  return (
    <AlertDialog open onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Your order is ready</AlertDialogTitle>
          <AlertDialogDescription>
            Pay {money(order.amount, order.currency)} for {order.event?.event_name ?? "this event"} with Paystack to finish
            registering. You can also pay later from your{" "}
            <Link href="/orders" className="text-brand underline">
              orders
            </Link>
            .
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="flex items-center justify-between rounded-[8px] bg-brand-light px-4 py-3 font-nunito">
          <span className="text-[14px] font-[600]">Total</span>
          <span className="text-[18px] font-[800]">{money(order.amount, order.currency)}</span>
        </div>
        <p className="truncate font-nunito text-[11px] text-[#959595]">Ref {order.reference}</p>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={starting}>Not now</AlertDialogCancel>
          <LoadingButton variant="brand" loading={starting} onClick={() => startCheckout(order.id)}>
            Proceed to checkout
          </LoadingButton>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
