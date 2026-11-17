"use client";

import Link from "next/link";
import { ChevronDown, CircleX, LayoutGrid, Rows2 } from "lucide-react";
import { useRouter } from "nextjs-toploader/app";
import { Checkbox } from "@/components/ui/checkbox";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { activeFilters, FILTER_GROUPS, profileHref, type ProfileQuery } from "@/lib/profile-query";
import { cn } from "@/lib/utils";

const VIEWS = [
  { value: "grid", label: "Grid view", icon: LayoutGrid },
  { value: "list", label: "List view", icon: Rows2 },
] as const;

// "Filter By" menu, grid/list switch, and the chips for the filters that are on.
export function ProfileToolbar({ query }: { query: ProfileQuery }) {
  const router = useRouter();
  const chips = activeFilters(query);

  return (
    <div className="flex flex-col gap-y-4">
      <div className="flex items-center justify-between gap-x-4">
        <Popover>
          <PopoverTrigger className="flex items-center gap-x-2 rounded-[6px] py-1 font-nunito text-[15px] font-[600] text-[#1E1E1E] hover:text-brand">
            Filter By <ChevronDown className="size-4" />
            {chips.length > 0 && (
              <span className="flex size-5 items-center justify-center rounded-full bg-brand text-[11px] font-[700] text-white">{chips.length}</span>
            )}
          </PopoverTrigger>
          <PopoverContent align="start" className="w-[240px] space-y-4 p-4">
            {FILTER_GROUPS.map((group) => (
              <fieldset key={group.key} className="space-y-2">
                <legend className="pb-1 font-nunito text-[12px] font-[600] uppercase tracking-wide text-[#959595]">{group.label}</legend>
                {group.options.map((option) => {
                  const checked = query[group.key] === option.value;
                  const id = `filter-${group.key}-${option.value}`;
                  return (
                    <label key={option.value} htmlFor={id} className="flex cursor-pointer items-center gap-x-3 font-nunito text-[14px]">
                      <Checkbox
                        id={id}
                        checked={checked}
                        // One choice per group: picking one replaces the other; unticking clears it.
                        onCheckedChange={(on) => router.push(profileHref(query, { [group.key]: on ? option.value : undefined }), { scroll: false })}
                        className="border-brand data-[state=checked]:bg-brand data-[state=checked]:text-white"
                      />
                      {option.label}
                    </label>
                  );
                })}
              </fieldset>
            ))}
          </PopoverContent>
        </Popover>

        <div className="flex items-center gap-x-2" role="group" aria-label="Layout">
          {VIEWS.map(({ value, label, icon: Icon }) => (
            <Link
              key={value}
              href={profileHref(query, { view: value, page: query.page })}
              scroll={false}
              aria-label={label}
              aria-current={query.view === value ? "true" : undefined}
              className={cn(
                "flex size-8 items-center justify-center rounded-[6px] border transition-colors",
                query.view === value ? "border-brand-soft bg-brand-light text-brand" : "border-transparent text-brand hover:bg-brand-light/60",
              )}
            >
              <Icon className="size-[18px]" />
            </Link>
          ))}
        </div>
      </div>

      {chips.length > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          {chips.map((chip) => (
            <Link
              key={chip.label}
              href={profileHref(query, chip.clear)}
              scroll={false}
              aria-label={`Remove filter: ${chip.label}`}
              className="flex items-center gap-x-2 rounded-[6px] bg-brand-light px-3 py-1.5 font-nunito text-[12px] font-[500] text-brand-text transition-colors hover:bg-brand-soft/40"
            >
              {chip.label}
              <CircleX className="size-4" />
            </Link>
          ))}
          <Link
            href={profileHref(query, { role: undefined, price: undefined })}
            scroll={false}
            className="px-2 font-nunito text-[12px] font-[600] text-brand hover:underline"
          >
            Clear All
          </Link>
        </div>
      )}
    </div>
  );
}
