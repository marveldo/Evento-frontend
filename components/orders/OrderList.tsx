import Image from "next/image";
import Link from "next/link";
import { isValid, parseISO } from "date-fns";
import { CheckOrderButton } from "@/components/orders/CheckOrderButton";
import { CheckoutButton } from "@/components/orders/CheckoutButton";
import { Skeleton } from "@/components/ui/skeleton";
import { money } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { Order, OrderStatus } from "@/lib/types";

const TIME_ZONE = "Africa/Lagos";
const when = new Intl.DateTimeFormat("en-GB", { timeZone: TIME_ZONE, day: "numeric", month: "short", year: "numeric", hour: "numeric", minute: "2-digit" });
const eventDay = new Intl.DateTimeFormat("en-GB", { timeZone: "UTC", weekday: "short", day: "numeric", month: "short", year: "numeric" });

const STATUS: Record<OrderStatus, { label: string; className: string }> = {
  success: { label: "Paid", className: "bg-[#E7F6EC] text-[#0F7B3A]" },
  pending: { label: "Pending", className: "bg-[#FFF4E0] text-[#A15C00]" },
  failed: { label: "Failed", className: "bg-[#FDECEC] text-[#B42318]" },
  abandoned: { label: "Abandoned", className: "bg-[#F2F2F2] text-[#676767]" },
  refunded: { label: "Refunded", className: "bg-[#E8F0FE] text-[#1A56DB]" },
};

function formatDate(value: string | null | undefined, format: Intl.DateTimeFormat) {
  if (!value) return null;
  const date = parseISO(value);
  return isValid(date) ? format.format(date) : null;
}

export function OrderStatusBadge({ status }: { status: OrderStatus }) {
  const { label, className } = STATUS[status] ?? STATUS.pending;
  return <span className={cn("rounded-full px-3 py-1 font-nunito text-[12px] font-[700]", className)}>{label}</span>;
}

function OrderRow({ order }: { order: Order }) {
  const event = order.event;
  const name = event?.event_name ?? "Event no longer available";
  const date = formatDate(order.paid_at ?? order.created_at, when);
  const startDate = formatDate(event?.start_date && `${event.start_date}T00:00:00Z`, eventDay);

  return (
    <li className="flex items-center gap-x-4 border-b border-[#EBEBEB] py-5 last:border-b-0">
      <div className="relative size-16 shrink-0 overflow-hidden rounded-[8px] bg-brand-light">
        {event?.event_image && <Image src={event.event_image} alt="" fill sizes="64px" className="object-cover" />}
      </div>
      <div className="flex min-w-0 flex-1 flex-col gap-y-1">
        {event ? (
          <Link href={`/events/${event.id}`} className="truncate font-montserrat text-[16px] font-[700] hover:text-brand">
            {name}
          </Link>
        ) : (
          <p className="truncate font-montserrat text-[16px] font-[700] text-[#676767]">{name}</p>
        )}
        <p className="font-nunito text-[13px] font-[600] text-[#676767]">
          {[startDate, date && `${order.paid_at ? "Paid" : "Ordered"} ${date}`].filter(Boolean).join(" · ")}
        </p>
        <p className="truncate font-nunito text-[11px] text-[#959595]" title={order.reference}>
          Ref {order.reference}
        </p>
      </div>
      <div className="flex shrink-0 flex-col items-end gap-y-2">
        <p className="font-nunito text-[16px] font-[800]">{money(order.amount, order.currency)}</p>
        <OrderStatusBadge status={order.status} />
        {order.status === "pending" && (
          <div className="flex items-center gap-x-3">
            {order.checkout_url && <CheckOrderButton reference={order.reference} />}
            <CheckoutButton orderId={order.id} />
          </div>
        )}
      </div>
    </li>
  );
}

export function OrderList({ orders }: { orders: Order[] }) {
  return (
    <ul className="rounded-[12px] border border-[#EBEBEB] bg-white px-5">
      {orders.map((order) => (
        <OrderRow key={order.id} order={order} />
      ))}
    </ul>
  );
}

export function OrderListSkeleton() {
  return (
    <div className="rounded-[12px] border border-[#EBEBEB] bg-white px-5">
      {Array.from({ length: 4 }, (_, i) => (
        <div key={i} className="flex items-center gap-x-4 border-b border-[#EBEBEB] py-5 last:border-b-0">
          <Skeleton className="size-16 rounded-[8px]" />
          <div className="flex flex-1 flex-col gap-y-2">
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="h-3 w-1/3" />
          </div>
          <Skeleton className="h-6 w-20" />
        </div>
      ))}
    </div>
  );
}
