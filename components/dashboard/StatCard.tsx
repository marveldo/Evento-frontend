import Image, { type StaticImageData } from "next/image";
import { Skeleton } from "@/components/ui/skeleton";

const CARD = "flex w-full min-w-[120px] items-center justify-between p-4 shadow-sm shadow-[#1018280F]";

export function StatCard({ value, label, icon }: { value: number; label: string; icon: StaticImageData }) {
  return (
    <div className={CARD}>
      <div className="flex flex-col gap-y-4">
        <p className="font-montserrat text-[24px] font-[700] leading-[40px] sm:text-[32px]">{value}</p>
        <p className="font-nunito text-[16px] leading-[28px] sm:text-[20px]">{label}</p>
      </div>
      <div className="hidden sm:block">
        <Image src={icon} alt="" />
      </div>
    </div>
  );
}

export function StatCardSkeleton() {
  return (
    <div className={CARD}>
      <div className="flex flex-col gap-y-4">
        <Skeleton className="h-[30px] w-[80px] rounded-xl md:w-[200px]" />
        <Skeleton className="h-[40px] w-[120px] rounded-xl md:w-[250px]" />
      </div>
    </div>
  );
}
