import { Container } from "@/components/common/Container";
import { LoadFailed } from "@/components/common/LoadFailed";
import { AttendeesTable } from "@/components/events/AttendeesTable";
import { EventOverview } from "@/components/events/EventOverview";
import { EventShare } from "@/components/events/EventShare";
import { UnderlineTabs } from "@/components/common/UnderlineTabs";

type EventTab = "overview" | "attendees" | "share";
import { getAttendees, getEvent, load } from "@/lib/server/data";
import { getSession } from "@/lib/server/session";

interface EventPageProps {
  params: { id: string };
  searchParams: { tab?: string; page?: string };
}

function pageNumber(value: string | undefined) {
  const page = Number(value);
  return Number.isInteger(page) && page > 0 ? page : 1;
}

export default async function EventPage({ params, searchParams }: EventPageProps) {
  const tab: EventTab = searchParams.tab === "attendees" || searchParams.tab === "share" ? searchParams.tab : "overview";
  const page = pageNumber(searchParams.page);
  const base = `/events/${params.id}`;
  const attendeesHref = (n: number) => `${base}?tab=attendees&page=${n}`;
  const shareHref = `${base}?tab=share`;

  const [loadedEvent, loadedAttendees] = await Promise.all([
    load(getEvent(params.id)),
    tab === "attendees" ? load(getAttendees(params.id, page)) : null,
  ]);
  const failure = loadedEvent.error ?? loadedAttendees?.error;
  if (failure || !loadedEvent.data) {
    return (
      <Container className="mb-40 pt-28">
        <LoadFailed unavailable={failure?.unavailable ?? true} />
      </Container>
    );
  }
  const event = loadedEvent.data;
  const attendees = loadedAttendees?.data ?? null;
  const session = getSession();

  return (
    <Container className="mb-40 pt-28">
      <UnderlineTabs
        label="Event sections"
        active={tab}
        tabs={[
          { value: "overview", label: "Event Overview", href: base },
          { value: "attendees", label: "Attendees", href: attendeesHref(1) },
          { value: "share", label: "Share Invites", href: shareHref },
        ]}
      />
      <div className="pt-8">
        {tab === "attendees" && attendees ? (
          <AttendeesTable attendees={attendees} page={page} pageHref={attendeesHref} />
        ) : tab === "share" ? (
          <EventShare event={event} />
        ) : (
          <EventOverview
            event={event}
            isHost={session?.user.id === event.hosted_by.id}
            viewerEmail={session?.user.email ?? ""}
            attendeesHref={attendeesHref(1)}
            shareHref={shareHref}
            editHref={`${base}/edit`}
          />
        )}
      </div>
    </Container>
  );
}
