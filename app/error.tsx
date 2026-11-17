"use client";

import { Button } from "@/components/ui/button";

export default function Error({ reset }: { error: Error; reset: () => void }) {
  return (
    <main className="mb-40 flex flex-grow flex-col items-center justify-center gap-y-6 pt-40 text-center">
      <h1 className="font-montserrat text-[28px] font-[600]">Something went wrong</h1>
      <p className="font-nunito text-[#676767]">We couldn&apos;t load this page. Please try again.</p>
      <Button variant="brand" onClick={reset}>
        Try again
      </Button>
    </main>
  );
}
