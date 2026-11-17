import Link from "next/link";
import { MusicIcon } from "@/components/common/icons";
import { EVENT_CATEGORIES } from "@/lib/categories";
import { cn } from "@/lib/utils";

export function CategoryFilter({ active }: { active: string }) {
  return (
    <div className="flex flex-nowrap gap-5 overflow-x-scroll md:flex-wrap md:justify-center md:overflow-x-hidden">
      {EVENT_CATEGORIES.map((category) => (
        <Link
          key={category}
          href={`/home?tag=${encodeURIComponent(category)}`}
          className={cn(
            "flex items-center gap-x-1 rounded-full border border-brand-soft p-2",
            category === active && "bg-brand text-white",
          )}
        >
          <MusicIcon />
          <p className="font-nunito text-[10px] font-[700] md:text-[16px]">{category}</p>
        </Link>
      ))}
    </div>
  );
}
