"use client";

import { CalendarPlus, Ticket, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import type { UserRole } from "@/lib/types";

const ROLES: { value: UserRole; title: string; description: string; icon: LucideIcon }[] = [
  { value: "attendee", title: "I want to attend events", description: "Discover events you'll love and book tickets.", icon: Ticket },
  { value: "organizer", title: "I organize events", description: "Create events, sell tickets and manage guests.", icon: CalendarPlus },
];

interface RolePickerProps {
  value: UserRole;
  onChange: (role: UserRole) => void;
  disabled?: boolean;
}

export function RolePicker({ value, onChange, disabled }: RolePickerProps) {
  return (
    <div role="radiogroup" aria-label="How will you use Evento?" className="grid grid-cols-1 gap-3 min-[420px]:grid-cols-2">
      {ROLES.map(({ value: role, title, description, icon: Icon }) => {
        const selected = value === role;
        return (
          <button
            key={role}
            type="button"
            role="radio"
            aria-checked={selected}
            disabled={disabled}
            onClick={() => onChange(role)}
            className={cn(
              "flex flex-col items-start gap-y-2 rounded-[12px] border p-4 text-left font-nunito transition-colors disabled:opacity-60",
              selected ? "border-brand bg-brand-light" : "border-[#EBEBEB] hover:border-brand-soft",
            )}
          >
            <span className={cn("flex size-9 items-center justify-center rounded-full", selected ? "bg-brand text-white" : "bg-[#F5F5F5] text-[#6B6B6B]")}>
              <Icon className="size-[18px]" />
            </span>
            <span className="text-[14px] font-[700] text-[#1E1E1E]">{title}</span>
            <span className="text-[12px] leading-[18px] text-[#6B6B6B]">{description}</span>
          </button>
        );
      })}
    </div>
  );
}
