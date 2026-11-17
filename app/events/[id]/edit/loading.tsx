import { Skeleton } from "@/components/ui/skeleton";

export default function EditEventLoading() {
  return (
    <main className="mb-40 flex w-full justify-center pt-32">
      <div className="w-full max-w-[592px] space-y-8 px-3 md:px-0">
        <Skeleton className="h-10 w-48" />
        <div className="space-y-6 rounded-[24px] border border-[#EBEBEB] p-3 md:p-10">
          <Skeleton className="h-[278px] w-full rounded-[8px]" />
          <Skeleton className="h-14 w-full" />
          <Skeleton className="h-[92px] w-full" />
          <Skeleton className="h-28 w-full" />
          <Skeleton className="h-14 w-full" />
        </div>
      </div>
    </main>
  );
}
