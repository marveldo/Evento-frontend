import { Skeleton } from "@/components/ui/skeleton";
import { Container } from "@/components/common/Container";

export default function EventLoading() {
  return (
    <Container className="mb-40 space-y-8 pt-28">
      <div className="grid grid-cols-3">
        {[0, 1, 2].map((index) => (
          <div key={index} className="flex justify-center border-b-2 border-[#EBEBEB] pb-3">
            <Skeleton className="h-4 w-24" />
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 gap-x-8 gap-y-6 md:grid-cols-2">
        <div className="space-y-4">
          <Skeleton className="aspect-square w-full rounded-[8px]" />
          <Skeleton className="h-5 w-40" />
        </div>
        <div className="flex flex-col gap-y-5">
          <Skeleton className="h-9 w-3/4" />
          <Skeleton className="h-11 w-2/3" />
          <Skeleton className="h-11 w-1/2" />
          <div className="grid grid-cols-3 gap-3">
            <Skeleton className="h-[60px] rounded-[6px]" />
            <Skeleton className="h-[60px] rounded-[6px]" />
            <Skeleton className="h-[60px] rounded-[6px]" />
          </div>
          <Skeleton className="h-11" />
          <div className="grid grid-cols-2 gap-3">
            <Skeleton className="h-11" />
            <Skeleton className="h-11" />
          </div>
        </div>
      </div>
      <div className="space-y-3">
        <Skeleton className="h-6 w-48" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
      </div>
    </Container>
  );
}
