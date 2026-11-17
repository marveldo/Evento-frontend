"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { ReloadIcon } from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface LoadFailedProps {
  // true: the server couldn't be reached. false: it answered with an error.
  unavailable: boolean;
  // A smaller version for a section inside a page.
  compact?: boolean;
  className?: string;
}

// Shown in place of content that couldn't be loaded from the backend.
export function LoadFailed({ unavailable, compact = false, className }: LoadFailedProps) {
  const router = useRouter();
  const [retrying, startRetry] = useTransition();

  return (
    <div
      role="alert"
      className={cn(
        "flex flex-col items-center gap-y-3 rounded-[8px] border border-dashed border-brand-soft bg-brand-light/40 text-center",
        compact ? "px-6 py-8" : "mx-auto w-full max-w-[560px] px-6 py-14",
        className,
      )}
    >
      <p className={cn("font-montserrat font-[600] text-[#1E1E1E]", compact ? "text-[18px]" : "text-[22px] md:text-[24px]")}>
        {unavailable ? "We can't reach Evento right now" : "Something went wrong loading this"}
      </p>
      <p className="max-w-[420px] font-nunito text-[14px] leading-[22px] text-[#676767]">
        {unavailable
          ? "Our server isn't responding. Check your connection, or try again in a moment."
          : "The server ran into a problem. Please try again in a moment."}
      </p>
      <Button variant="brand" className="mt-2" disabled={retrying} onClick={() => startRetry(() => router.refresh())}>
        <ReloadIcon className={cn("mr-2 size-4", retrying && "animate-spin")} />
        {retrying ? "Retrying…" : "Try again"}
      </Button>
    </div>
  );
}
