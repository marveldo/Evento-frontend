import Image from "next/image";
import Link from "next/link";
import { ClockIcon } from "@radix-ui/react-icons";
import { LocationIcon } from "@/components/common/icons";
import { clockTime, orDash, price, shortDate } from "@/lib/format";
import type { EventItem } from "@/lib/types";

function Detail({ icon, children }: { icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-x-1 font-nunito text-[12px] font-[500] leading-[20px] text-[#676767]">
      {icon}
      <p>{children}</p>
    </div>
  );
}

export function EventCard({ event }: { event: EventItem }) {
  return (
    <Link href={`/events/${event.id}`} className="overflow-hidden rounded-[8px]">
      <div className="relative h-[180px] w-full bg-brand-light">
        {event.event_image && (
          <Image src={event.event_image} alt={event.event_name ?? "Event"} fill sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw" className="object-cover" />
        )}
      </div>
      <div className="flex flex-col gap-y-3 bg-white p-4 shadow-sm shadow-[#1018281A]">
        <div className="flex w-full items-center justify-between">
          <p className="font-nunito text-[12px] font-[600] leading-[20px] text-brand-text">{shortDate(event.start_date)}</p>
          <div className="bg-brand-light p-1 text-[12px] leading-[20px] text-brand-text">{price(event.price)}</div>
        </div>
        <h3 className="font-montserrat text-[20px] font-[600] leading-[24px]">{orDash(event.event_name)}</h3>
        <Detail icon={<LocationIcon />}>{orDash(event.location)}</Detail>
        <Detail icon={<ClockIcon className="size-5" />}>{clockTime(event.start_time)} WAT</Detail>
      </div>
    </Link>
  );
}
