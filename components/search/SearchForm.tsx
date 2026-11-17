"use client";

import { useState } from "react";
import { useRouter } from "nextjs-toploader/app";
import { Button } from "@/components/ui/button";
import { SearchIcon } from "@/components/common/icons";
import { searchHref } from "@/lib/search";

export function SearchForm({ initial = "" }: { initial?: string }) {
  const router = useRouter();
  const [text, setText] = useState(initial);

  return (
    <form
      role="search"
      className="flex w-full items-center gap-x-2 rounded-[8px] border border-[#EBEBEB] bg-white p-1.5 pl-4 shadow-sm shadow-[#1018281A] focus-within:border-brand-soft"
      onSubmit={(event) => {
        event.preventDefault();
        if (text.trim()) router.push(searchHref(text));
      }}
    >
      <SearchIcon className="shrink-0 text-[#959595]" />
      <input
        type="search"
        name="q"
        value={text}
        onChange={(event) => setText(event.target.value)}
        placeholder="Search events, locations, hosts or categories"
        aria-label="Search events"
        maxLength={100}
        className="h-10 min-w-0 flex-1 bg-transparent font-nunito text-[15px] outline-none placeholder:text-[#959595]"
      />
      <Button type="submit" variant="brand" className="px-6">
        Search
      </Button>
    </form>
  );
}
