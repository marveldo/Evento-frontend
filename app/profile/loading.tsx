import { Container } from "@/components/common/Container";
import { Skeleton } from "@/components/ui/skeleton";
import { EventListSkeleton } from "@/components/profile/EventListCard";

export default function ProfileLoading() {
  return (
    <main className="w-full flex-grow bg-[#F7F7F7] pb-40" style={{ paddingTop: "var(--navbar-height, 73px)" }}>
      <div className="h-[120px] bg-brand-light md:h-[180px]" />
      <Container>
        <div className="mx-auto max-w-[860px] space-y-4">
          <Skeleton className="-mt-12 size-24 rounded-full border-4 border-white md:-mt-14 md:size-28" />
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-full max-w-[560px]" />
          <Skeleton className="h-4 w-2/3 max-w-[420px]" />
        </div>
      </Container>
      <Container className="pt-12">
        <div className="mx-auto max-w-[860px] space-y-8">
          <div className="grid grid-cols-2">
            <div className="border-b-2 border-brand pb-3" />
            <div className="border-b-2 border-[#EBEBEB] pb-3" />
          </div>
          <div className="rounded-[16px] bg-white p-4 md:p-8">
            <EventListSkeleton count={3} />
          </div>
        </div>
      </Container>
    </main>
  );
}
