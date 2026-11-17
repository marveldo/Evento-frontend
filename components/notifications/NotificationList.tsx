import { BellIcon } from "@radix-ui/react-icons";
import { formatDistanceToNowStrict, isValid, parseISO } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";
import type { NotificationItem } from "@/lib/types";

// The app shows times in WAT (see EventCard). Formatting in a fixed zone also keeps the result
// the same whether this renders on the server (UTC) or in the browser.
const TIME_ZONE = "Africa/Lagos";
const dayKey = new Intl.DateTimeFormat("en-CA", { timeZone: TIME_ZONE, year: "numeric", month: "2-digit", day: "2-digit" });
const dayName = new Intl.DateTimeFormat("en-GB", { timeZone: TIME_ZONE, weekday: "long", day: "numeric", month: "long", year: "numeric" });
const clock = new Intl.DateTimeFormat("en-US", { timeZone: TIME_ZONE, hour: "numeric", minute: "2-digit" });

function dayLabel(date: Date) {
  const key = dayKey.format(date);
  if (key === dayKey.format(new Date())) return "Today";
  if (key === dayKey.format(new Date(Date.now() - 24 * 60 * 60 * 1000))) return "Yesterday";
  return dayName.format(date);
}

// Groups notifications (already newest first) under a heading per day.
function groupByDay(items: NotificationItem[]) {
  const groups: { label: string; items: { item: NotificationItem; date: Date | null }[] }[] = [];
  for (const item of items) {
    const parsed = parseISO(item.created_at);
    const date = isValid(parsed) ? parsed : null;
    const label = date ? dayLabel(date) : "Earlier";
    const last = groups[groups.length - 1];
    if (last?.label === label) last.items.push({ item, date });
    else groups.push({ label, items: [{ item, date }] });
  }
  return groups;
}

function NotificationRow({ item, date }: { item: NotificationItem; date: Date | null }) {
  return (
    <li className="flex items-start gap-x-4 border-b border-[#EBEBEB] py-5 last:border-b-0">
      <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-brand-light text-brand">
        <BellIcon className="size-5" />
      </span>
      <div className="flex min-w-0 flex-1 flex-col gap-y-1">
        <p className="break-words font-nunito text-[16px] leading-[24px] text-[#1E1E1E]">{item.message}</p>
        {date && (
          <time dateTime={item.created_at} className="font-nunito text-[12px] font-[500] leading-[20px] text-[#676767]">
            {formatDistanceToNowStrict(date, { addSuffix: true })}
          </time>
        )}
      </div>
      {date && (
        <span className="hidden shrink-0 font-nunito text-[12px] font-[600] leading-[20px] text-brand-text sm:block">
          {clock.format(date)} WAT
        </span>
      )}
    </li>
  );
}

export function NotificationList({ items }: { items: NotificationItem[] }) {
  return (
    <div className="flex flex-col gap-y-8">
      {groupByDay(items).map((group) => (
        <section key={group.label} aria-label={group.label}>
          <h2 className="pb-1 font-nunito text-[14px] font-[600] leading-[24px] text-[#959595]">{group.label}</h2>
          <ul className="rounded-[8px] bg-white px-4 shadow-sm shadow-[#1018281A] sm:px-6">
            {group.items.map(({ item, date }) => (
              <NotificationRow key={item.id} item={item} date={date} />
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}

export function NotificationListSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="flex flex-col gap-y-2">
      <Skeleton className="h-4 w-24" />
      <div className="rounded-[8px] bg-white px-4 shadow-sm shadow-[#1018281A] sm:px-6">
        {Array.from({ length: rows }, (_, index) => (
          <div key={index} className="flex items-start gap-x-4 border-b border-[#EBEBEB] py-5 last:border-b-0">
            <Skeleton className="size-10 shrink-0 rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-3 w-24" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
