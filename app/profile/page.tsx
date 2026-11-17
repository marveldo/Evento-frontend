import { Suspense } from "react";
import Link from "next/link";
import { Container } from "@/components/common/Container";
import { EmptyState } from "@/components/common/EmptyState";
import { LoadFailed } from "@/components/common/LoadFailed";
import { Pagination } from "@/components/common/Pagination";
import { UnderlineTabs } from "@/components/common/UnderlineTabs";
import { EventGrid } from "@/components/events/EventGrid";
import { EventListCard, EventListSkeleton } from "@/components/profile/EventListCard";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { ProfileToolbar } from "@/components/profile/ProfileToolbar";
import { getCurrentUser, getMyEvents, load } from "@/lib/server/data";
import { activeFilters, parseProfileQuery, profileHref, type ProfileQuery, type ProfileTab } from "@/lib/profile-query";
import calendarIcon from "@/public/calendericon.svg";

export const metadata = { title: "Profile | Evento" };

// Sits directly under the fixed navbar; Navbar.tsx sets --navbar-height.
const BELOW_NAVBAR = { paddingTop: "var(--navbar-height, 73px)" };

async function MyEvents({ query }: { query: ProfileQuery }) {
  const loaded = await load(getMyEvents({ when: query.tab, role: query.role, price: query.price, page: query.page }));
  if (loaded.error) return <LoadFailed unavailable={loaded.error.unavailable} compact />;
  const { data: events, count, total_pages } = loaded.data;

  if (count === 0) {
    const filtered = activeFilters(query).length > 0;
    return (
      <EmptyState
        image={calendarIcon}
        title={filtered ? "No events match these filters" : query.tab === "past" ? "No past events yet" : "No upcoming events yet"}
      >
        {filtered ? (
          <Link className="text-brand" href={profileHref(query, { role: undefined, price: undefined })} scroll={false}>
            Clear filters
          </Link>
        ) : (
          <>
            <Link className="text-brand" href="/home">
              Explore events
            </Link>{" "}
            or{" "}
            <Link className="text-brand" href="/create-event">
              create one
            </Link>
          </>
        )}
      </EmptyState>
    );
  }

  return (
    <div className="flex flex-col gap-y-8">
      {query.view === "grid" ? (
        <EventGrid events={events} className="gap-6 md:grid-cols-2 lg:grid-cols-2" />
      ) : (
        <div className="flex flex-col gap-y-4">
          {events.map((event) => (
            <EventListCard key={event.id} event={event} />
          ))}
        </div>
      )}
      <div className="flex justify-center">
        <Pagination page={query.page} totalPages={total_pages} href={(page) => profileHref(query, { page })} />
      </div>
    </div>
  );
}

export default async function ProfilePage({ searchParams }: { searchParams: Record<string, string | string[] | undefined> }) {
  const query = parseProfileQuery(searchParams);
  const loaded = await load(getCurrentUser());

  if (loaded.error) {
    return (
      <main className="w-full flex-grow bg-[#F7F7F7] pb-40" style={BELOW_NAVBAR}>
        <Container className="pt-16">
          <LoadFailed unavailable={loaded.error.unavailable} />
        </Container>
      </main>
    );
  }
  const user = loaded.data;
  const tab = (value: ProfileTab, label: string, count: number) => ({
    value,
    label: `${label} (${count})`,
    href: profileHref(query, { tab: value, view: query.view }),
  });

  return (
    <main className="w-full flex-grow bg-[#F7F7F7] pb-40" style={BELOW_NAVBAR}>
      <ProfileHeader user={user} />

      <Container className="pt-12">
        <div className="mx-auto flex max-w-[860px] flex-col gap-y-8">
          <UnderlineTabs
            label="Your events"
            active={query.tab}
            tabs={[tab("upcoming", "Upcoming Events", user.upcoming_events_count), tab("past", "Past Events", user.past_events_count)]}
          />

          <section className="flex flex-col gap-y-6 rounded-[16px] bg-white p-4 shadow-sm shadow-[#1018280D] md:p-8">
            <ProfileToolbar query={query} />
            <Suspense
              key={`${query.tab}:${query.role}:${query.price}:${query.view}:${query.page}`}
              fallback={<EventListSkeleton count={3} />}
            >
              <MyEvents query={query} />
            </Suspense>
          </section>
        </div>
      </Container>
    </main>
  );
}
