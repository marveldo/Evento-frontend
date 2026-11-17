import Link from "next/link";
import { Container } from "@/components/common/Container";
import { EmptyState } from "@/components/common/EmptyState";
import { LoadFailed } from "@/components/common/LoadFailed";
import { Pagination } from "@/components/common/Pagination";
import { SectionHeading } from "@/components/common/SectionHeading";
import { LiveRefresh } from "@/components/notifications/LiveRefresh";
import { NotificationList } from "@/components/notifications/NotificationList";
import { getNotifications, load } from "@/lib/server/data";
import bellImage from "@/public/calendericon.svg";

export const metadata = { title: "Notifications | Evento" };

function pageNumber(value: string | undefined) {
  const page = Number(value);
  return Number.isInteger(page) && page > 0 ? page : 1;
}

export default async function NotificationsPage({ searchParams }: { searchParams: { page?: string } }) {
  const page = pageNumber(searchParams.page);
  const loaded = await load(getNotifications(page));
  const href = (n: number) => (n === 1 ? "/notifications" : `/notifications?page=${n}`);

  return (
    <Container className="mb-40 flex-grow pt-28">
      <LiveRefresh />
      <div className="mx-auto flex w-full max-w-[760px] flex-col gap-y-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <SectionHeading eyebrow="Inbox" title="Notifications" />
          {loaded.data && loaded.data.count > 0 && (
            <p className="font-nunito text-[14px] font-[600] text-[#676767]">
              {loaded.data.count} {loaded.data.count === 1 ? "notification" : "notifications"}
            </p>
          )}
        </div>

        {loaded.error ? (
          <LoadFailed unavailable={loaded.error.unavailable} />
        ) : loaded.data.data.length > 0 ? (
          <>
            <NotificationList items={loaded.data.data} />
            <div className="flex justify-center">
              <Pagination page={page} totalPages={loaded.data.total_pages} href={href} />
            </div>
          </>
        ) : (
          <EmptyState image={bellImage} title={page > 1 ? "No notifications on this page" : "You're all caught up"}>
            {page > 1 ? (
              <Link className="text-brand" href="/notifications">
                Back to the latest
              </Link>
            ) : (
              <>
                Event reminders and updates will show up here.{" "}
                <Link className="text-brand" href="/home">
                  Explore events
                </Link>
              </>
            )}
          </EmptyState>
        )}
      </div>
    </Container>
  );
}
