import Link from "next/link";
import { cn } from "@/lib/utils";

interface UnderlineTabsProps<T extends string> {
  active: T;
  tabs: { value: T; label: string; href: string }[];
  label: string;
  className?: string;
}

// Full-width underlined tabs: the active one is dark with an orange underline.
export function UnderlineTabs<T extends string>({ active, tabs, label, className }: UnderlineTabsProps<T>) {
  return (
    <nav aria-label={label} className={cn("grid w-full", className)} style={{ gridTemplateColumns: `repeat(${tabs.length}, minmax(0, 1fr))` }}>
      {tabs.map((tab) => {
        const selected = tab.value === active;
        return (
          <Link
            key={tab.value}
            href={tab.href}
            scroll={false}
            aria-current={selected ? "page" : undefined}
            className={cn(
              "border-b-2 px-2 pb-3 text-center font-nunito text-[13px] transition-colors md:text-[15px]",
              selected ? "border-brand font-[600] text-[#1E1E1E]" : "border-[#EBEBEB] font-[500] text-[#B1B1B1] hover:text-[#676767]",
            )}
          >
            {tab.label}
          </Link>
        );
      })}
    </nav>
  );
}
