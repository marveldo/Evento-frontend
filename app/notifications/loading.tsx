import { Container } from "@/components/common/Container";
import { SectionHeading } from "@/components/common/SectionHeading";
import { NotificationListSkeleton } from "@/components/notifications/NotificationList";

export default function NotificationsLoading() {
  return (
    <Container className="mb-40 flex-grow pt-28">
      <div className="mx-auto flex w-full max-w-[760px] flex-col gap-y-8">
        <SectionHeading eyebrow="Inbox" title="Notifications" />
        <NotificationListSkeleton />
      </div>
    </Container>
  );
}
