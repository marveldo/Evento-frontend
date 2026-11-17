import { Container } from "@/components/common/Container";
import { StatCardSkeleton } from "@/components/dashboard/StatCard";
import { EventGridSkeleton } from "@/components/events/EventGrid";

export default function DashboardLoading() {
  return (
    <Container className="mb-40 flex-grow space-y-12 pt-32">
      <div className="grid grid-cols-2 gap-x-12 gap-y-4 max-[400px]:grid-cols-1 sm:gap-x-24 lg:grid-cols-3">
        <StatCardSkeleton />
        <StatCardSkeleton />
        <StatCardSkeleton />
      </div>
      <EventGridSkeleton className="md:grid-cols-2 lg:grid-cols-2 lg:w-2/3" />
    </Container>
  );
}
