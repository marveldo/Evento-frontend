import Link from "next/link";
import { PlusIcon } from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/common/Container";
import { EmptyState } from "@/components/common/EmptyState";
import { LoadFailed } from "@/components/common/LoadFailed";
import { EventsCalendar } from "@/components/dashboard/EventsCalendar";
import { StatCard } from "@/components/dashboard/StatCard";
import { EventGrid } from "@/components/events/EventGrid";
import { getCurrentUser, load } from "@/lib/server/data";
import calendarIcon from "@/public/calendericon.svg";
import upcomingIcon from "@/public/Firsticon.svg";
import createdIcon from "@/public/Tabs.svg";
import pastIcon from "@/public/Trusted.svg";

export default async function DashboardPage() {
  const loaded = await load(getCurrentUser());
  if (loaded.error) {
    return (
      <Container className="mb-40 flex-grow pt-32">
        <LoadFailed unavailable={loaded.error.unavailable} />
      </Container>
    );
  }
  const user = loaded.data;
  const upcoming = user.upcoming_events;
  const eventDates = upcoming.flatMap((event) => (event.start_date ? [event.start_date] : []));

  return (
    <Container className="mb-40 flex-grow space-y-12 pt-32">
      <h1 className="font-montserrat text-[24px] font-[500] leading-[32px]">Welcome {user.full_name},</h1>

      <div className="grid grid-cols-2 justify-between gap-x-12 gap-y-4 max-[400px]:grid-cols-1 sm:gap-x-24 lg:grid-cols-3">
        <StatCard value={user.upcoming_events_count} label="Upcoming events" icon={upcomingIcon} />
        <StatCard value={user.created_events_count} label="Created events" icon={createdIcon} />
        <StatCard value={user.past_events_count} label="Past events" icon={pastIcon} />
      </div>

      <div className="grid grid-cols-1 gap-x-24 lg:grid-cols-3">
        <div className="col-start-1 col-end-3 space-y-4">
          <p className="font-nunito text-[20px] font-[600]">Upcoming Events</p>
          {upcoming.length > 0 ? (
            <EventGrid events={upcoming.slice(0, 6)} className="gap-x-12 gap-y-4 md:grid-cols-2 lg:grid-cols-2" />
          ) : (
            <EmptyState image={calendarIcon} title="Hey there! 👋 It seems like this corner is a bit quiet">
              Click the{" "}
              <Link className="text-brand" href="/create-event">
                create event
              </Link>{" "}
              or{" "}
              <Link className="text-brand" href="/home">
                explore
              </Link>{" "}
              event button to get started
            </EmptyState>
          )}
        </div>

        <div className="hidden h-full w-full flex-col gap-y-5 font-nunito lg:flex">
          <EventsCalendar dates={eventDates} />
          <Button asChild variant="brand" className="w-full py-6">
            <Link href="/create-event">
              Create event <PlusIcon className="ml-2 size-5" />
            </Link>
          </Button>
          <Button asChild variant="brandOutline" className="w-full py-6">
            <Link href="/home">Explore</Link>
          </Button>
        </div>
      </div>
    </Container>
  );
}
