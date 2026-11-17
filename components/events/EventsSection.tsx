import { LoadFailed } from "@/components/common/LoadFailed";
import { Pagination } from "@/components/common/Pagination";
import { EventGrid } from "@/components/events/EventGrid";
import { getEvents, load } from "@/lib/server/data";

interface EventsSectionProps {
  tag: string;
  page?: number;
  // When given, page numbers are shown under the grid and link to these URLs.
  pageHref?: (page: number) => string;
}

export async function EventsSection({ tag, page = 1, pageHref }: EventsSectionProps) {
  const result = await load(getEvents(tag, page));
  if (result.error) return <LoadFailed unavailable={result.error.unavailable} compact />;
  const { data: events, total_pages: totalPages } = result.data;

  return (
    <div className="flex flex-col gap-y-10">
      <EventGrid events={events} />
      {pageHref && (
        <div className="flex justify-center">
          <Pagination page={page} totalPages={totalPages} href={pageHref} scroll={false} />
        </div>
      )}
    </div>
  );
}
