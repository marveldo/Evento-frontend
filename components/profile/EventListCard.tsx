import Image from "next/image";
import Link from "next/link";
import { CalendarIcon, ClockIcon } from "@radix-ui/react-icons";
import { LocationIcon } from "@/components/common/icons";
import { Skeleton } from "@/components/ui/skeleton";
import { clockTime, orDash, price, shortDate } from "@/lib/format";
import type { EventItem } from "@/lib/types";

// The horizontal event card used by the profile's list view.
export function EventListCard({ event }: { event: EventItem }) {
  return (
    <Link
      href={`/events/${event.id}`}
      className="flex overflow-hidden rounded-[8px] border border-[#F0F0F0] bg-white shadow-sm shadow-[#1018281A] transition-shadow hover:shadow-md"
    >
      <div className="relative w-[38%] max-w-[180px] shrink-0 bg-brand-light">
        {event.event_image ? (
          <Image src={event.event_image} alt={event.event_name ?? "Event"} fill sizes="180px" className="object-cover" />
        ) : (
          <div className="flex h-full min-h-[112px] items-center justify-center text-brand">
            <CalendarIcon className="size-6" />
          </div>
        )}
      </div>
      <div className="flex min-w-0 flex-1 flex-col gap-y-1.5 p-3 md:p-4">
        <div className="flex items-start justify-between gap-x-2">
          <p className="font-nunito text-[12px] font-[600] leading-[20px] text-brand-text">{shortDate(event.start_date)}</p>
          <span className="shrink-0 rounded-[4px] bg-brand-light px-2 py-0.5 text-[11px] leading-[18px] text-brand-text">{price(event.price)}</span>
        </div>
        <h3 className="truncate font-montserrat text-[16px] font-[600] leading-[22px] md:text-[18px]">{orDash(event.event_name)}</h3>
        <p className="flex items-center gap-x-1 font-nunito text-[12px] font-[500] text-[#676767]">
          <LocationIcon className="size-4 shrink-0" />
          <span className="truncate">{orDash(event.location)}</span>
        </p>
        <p className="flex items-center gap-x-1 font-nunito text-[12px] font-[500] text-[#676767]">
          <ClockIcon className="size-4 shrink-0" />
          {clockTime(event.start_time)} WAT
        </p>
      </div>
    </Link>
  );
}

export function EventListSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="flex flex-col gap-y-4">
      {Array.from({ length: count }, (_, index) => (
        <div key={index} className="flex overflow-hidden rounded-[8px] border border-[#F0F0F0] bg-white">
          <Skeleton className="h-[120px] w-[38%] max-w-[180px] rounded-none" />
          <div className="flex-1 space-y-2 p-4">
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
            <Skeleton className="h-3 w-1/3" />
          </div>
        </div>
      ))}
    </div>
  );
}
