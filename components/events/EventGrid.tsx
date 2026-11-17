import { Skeleton } from "@/components/ui/skeleton";
import { EventCard } from "@/components/events/EventCard";
import { cn } from "@/lib/utils";
import type { EventItem } from "@/lib/types";

const GRID = "grid grid-cols-1 gap-[56px] md:grid-cols-2 lg:grid-cols-3";

export function EventGrid({ events, className }: { events: EventItem[]; className?: string }) {
  if (events.length === 0) return <p className="font-nunito text-[#676767]">No events here yet.</p>;
  return (
    <div className={cn(GRID, className)}>
      {events.map((event) => (
        <EventCard key={event.id} event={event} />
      ))}
    </div>
  );
}

export function EventGridSkeleton({ count = 3, className }: { count?: number; className?: string }) {
  return (
    <div className={cn(GRID, className)}>
      {Array.from({ length: count }, (_, index) => (
        <div key={index} className="flex flex-col space-y-3">
          <Skeleton className="h-[180px] w-full rounded-xl" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
          </div>
        </div>
      ))}
    </div>
  );
}
