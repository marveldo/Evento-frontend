import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, PencilLine, Share, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { UserAvatar } from "@/components/common/UserAvatar";
import { RegisterButton } from "@/components/events/RegisterButton";
import { clockTime, fullDate, orDash, price } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { EventItem } from "@/lib/types";
import calendarIcon from "@/public/majesticons_calendar-line.svg";
import locationIcon from "@/public/Frame 742.svg";
import changeIcon from "@/public/CHANGE.svg";

function InfoRow({ icon, title, children }: { icon: typeof calendarIcon; title: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-x-4">
      <Image src={icon} alt="" height={44} width={44} className="shrink-0" />
      <div className="flex min-w-0 flex-col gap-y-1">
        <div className="font-nunito text-[15px] font-[500] text-[#1E1E1E]">{title}</div>
        <p className="font-nunito text-[12px] text-[#676767]">{children}</p>
      </div>
    </div>
  );
}

// Small detail card with a solid offset shadow in its accent colour.
function InfoCard({ label, value, accent }: { label: string; value: React.ReactNode; accent: string }) {
  return (
    <div className="flex min-w-0 flex-col gap-y-2 rounded-[6px] border bg-white px-3 py-2.5" style={{ borderColor: accent, boxShadow: `2px 2px 0 0 ${accent}` }}>
      <p className="font-nunito text-[13px] font-[600] text-[#1E1E1E]">{label}</p>
      <p className="truncate font-nunito text-[11px] text-[#676767]">{value}</p>
    </div>
  );
}

const ACTION = "h-11 w-full gap-x-2 rounded-[6px] border text-[13px] font-[500]";

interface EventOverviewProps {
  event: EventItem;
  isHost: boolean;
  viewerEmail: string;
  attendeesHref: string;
  shareHref: string;
  editHref: string;
}

export function EventOverview({ event, isHost, viewerEmail, attendeesHref, shareHref, editHref }: EventOverviewProps) {
  const categories = event.category.map((tag) => tag.tag_name).filter(Boolean).join(", ");
  const mapsHref = event.location ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(event.location)}` : null;

  return (
    <div className="space-y-10">
      <div className="grid grid-cols-1 gap-x-8 gap-y-6 md:grid-cols-2">
        <div className="space-y-4">
          <div className="relative aspect-square w-full overflow-hidden rounded-[8px] bg-brand-light">
            {event.event_image && (
              <Image src={event.event_image} alt={event.event_name ?? "Event"} fill priority sizes="(min-width: 768px) 50vw, 100vw" className="object-cover" />
            )}
            {isHost && (
              <Link href={editHref} className="absolute bottom-3 right-3" aria-label="Change event image">
                <Image src={changeIcon} alt="" height={36} width={36} />
              </Link>
            )}
          </div>
          <div className="flex items-center gap-x-3">
            <UserAvatar name={event.hosted_by.full_name} image={event.hosted_by.profile_img} className="size-8" />
            <p className="font-nunito text-[14px] font-[500]">Hosted by {orDash(event.hosted_by.full_name)}</p>
          </div>
        </div>

        <div className="flex min-w-0 flex-col gap-y-5">
          <h1 className="break-words font-montserrat text-[26px] font-[600] leading-tight md:text-[32px]">{orDash(event.event_name)}</h1>

          <InfoRow icon={calendarIcon} title={fullDate(event.start_date)}>
            {clockTime(event.start_time)} to {clockTime(event.time)}
          </InfoRow>
          <InfoRow
            icon={locationIcon}
            title={
              mapsHref ? (
                <a href={mapsHref} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-x-1 hover:text-brand">
                  Location <ArrowUpRight className="size-4" />
                </a>
              ) : (
                "Location"
              )
            }
          >
            {orDash(event.location)}
          </InfoRow>

          <div className="grid grid-cols-1 gap-3 pr-[2px] min-[420px]:grid-cols-3">
            <InfoCard label="Event category" value={orDash(categories)} accent="#360789" />
            <InfoCard label="Event capacity" value={`${orDash(event.capacity)} persons`} accent="#E0580C" />
            <InfoCard label="Ticket type" value={price(event.price)} accent="#12B76A" />
          </div>

          {isHost ? (
            <Button asChild variant="brandOutline" className={ACTION}>
              <Link href={editHref}>
                <PencilLine className="size-4" />
                Edit Event
              </Link>
            </Button>
          ) : (
            <div className="w-full space-y-4 rounded-[12px] border-[0.5px] border-[#C0C0C0] p-3 font-nunito text-[15px]">
              <p>Hello! To join the event, please register below.</p>
              <RegisterButton eventId={event.id} email={viewerEmail} />
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <Button asChild variant="brandOutline" className={ACTION}>
              <Link href={attendeesHref} scroll={false}>
                <Users className="size-4" />
                View Attendees
              </Link>
            </Button>
            <Button asChild variant="brandOutline" className={cn(ACTION)}>
              <Link href={shareHref} scroll={false}>
                <Share className="size-4" />
                Share event
              </Link>
            </Button>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <h2 className="font-montserrat text-[18px] font-[600] md:text-[20px]">About this event</h2>
        <p className="whitespace-pre-line font-nunito text-[14px] leading-[22px] text-[#4D4D4D] md:text-[15px] md:leading-[24px]">
          {orDash(event.description)}
        </p>
      </div>
    </div>
  );
}
