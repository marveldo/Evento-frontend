"use client";

import { useMemo } from "react";
import { parseISO } from "date-fns";
import { Calendar } from "@/components/ui/calendar";

export function EventsCalendar({ dates }: { dates: string[] }) {
  const selected = useMemo(() => dates.map((date) => parseISO(date)), [dates]);

  return (
    <Calendar
      className="w-full space-y-5 p-0 font-nunito"
      classNames={{
        months: "flex w-full flex-1 flex-col sm:flex-row sm:space-x-4 sm:space-y-0",
        month: "flex w-full flex-col gap-y-2 space-y-4",
        table: "h-full w-full border-collapse space-y-10",
        head_row: "mb-4",
        row: "mt-2 w-full",
        day_today: "rounded-full bg-brand text-white",
        cell: "relative pt-4 text-center",
        day_selected:
          "after:absolute after:bottom-[-3px] after:ml-1 after:block after:h-[3px] after:rounded-full after:bg-brand after:p-[2px] after:text-[1px] after:text-brand after:content-['*']",
      }}
      selected={selected}
    />
  );
}
