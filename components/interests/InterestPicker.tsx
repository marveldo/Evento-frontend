"use client";

import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Category } from "@/lib/types";

interface InterestPickerProps {
  categories: Category[];
  value: string[];
  onChange: (value: string[]) => void;
  disabled?: boolean;
}

export function InterestPicker({ categories, value, onChange, disabled }: InterestPickerProps) {
  if (categories.length === 0) {
    return <p className="font-nunito text-[14px] text-[#6B6B6B]">There are no event categories yet. You can pick interests later in your settings.</p>;
  }

  const toggle = (name: string) => onChange(value.includes(name) ? value.filter((item) => item !== name) : [...value, name]);

  return (
    <div className="flex flex-wrap gap-3" role="group" aria-label="Interests">
      {categories.map(({ name, events_count: count }) => {
        const selected = value.includes(name);
        return (
          <button
            key={name}
            type="button"
            aria-pressed={selected}
            disabled={disabled}
            onClick={() => toggle(name)}
            className={cn(
              "flex items-center gap-x-1.5 rounded-full border px-4 py-2 font-nunito text-[14px] font-[700] transition-colors disabled:opacity-60",
              selected ? "border-brand bg-brand text-white" : "border-brand-soft text-[#1E1E1E] hover:bg-brand-light",
            )}
          >
            {selected && <Check className="size-4" />}
            {name}
            <span className={cn("text-[12px] font-[600]", selected ? "text-white/80" : "text-[#959595]")}>{count}</span>
          </button>
        );
      })}
    </div>
  );
}
