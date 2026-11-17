"use client";

import { useEffect, useId, useRef, useState } from "react";
import Image from "next/image";
import * as Dialog from "@radix-ui/react-dialog";
import { ArrowRightIcon, CalendarIcon } from "@radix-ui/react-icons";
import { useRouter } from "nextjs-toploader/app";
import { SearchIcon, Spinner } from "@/components/common/icons";
import { api } from "@/lib/api/client";
import { EVENT_CATEGORIES } from "@/lib/categories";
import { searchHref } from "@/lib/search";
import { orDash, shortDate } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { EventItem } from "@/lib/types";

const MIN_LENGTH = 2;
const DEBOUNCE_MS = 250;
const MAX_RESULTS = 6;

type Status = "idle" | "loading" | "done" | "error";

function isTypingIn(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) return false;
  return target.isContentEditable || ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName);
}

// Wraps the parts of `text` that match `query` in <mark>, ignoring case.
function Highlight({ text, query }: { text: string; query: string }) {
  if (!query) return <>{text}</>;
  const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const parts = text.split(new RegExp(`(${escaped})`, "ig"));
  return (
    <>
      {parts.map((part, index) =>
        part.toLowerCase() === query.toLowerCase() ? (
          <mark key={index} className="rounded-sm bg-brand-light text-brand">
            {part}
          </mark>
        ) : (
          part
        ),
      )}
    </>
  );
}

export function SearchDialog() {
  const router = useRouter();
  const listId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [open, setOpen] = useState(false);
  const [text, setText] = useState("");
  const [results, setResults] = useState<EventItem[]>([]);
  const [status, setStatus] = useState<Status>("idle");
  // Highlighted option: 0..results.length-1 are events, results.length is "See all results",
  // and -1 is nothing (Enter then opens the full results page).
  const [active, setActive] = useState(-1);

  const query = text.trim();
  const searchable = query.length >= MIN_LENGTH;
  const optionCount = searchable && status === "done" ? results.length + 1 : 0;

  // Ctrl/⌘+K toggles the dialog; "/" opens it unless the user is typing somewhere.
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key.toLowerCase() === "k" && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        setOpen((current) => !current);
      } else if (event.key === "/" && !isTypingIn(event.target)) {
        event.preventDefault();
        setOpen(true);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  // Debounced live search. Each keystroke cancels the request before it, so results never arrive out of order.
  useEffect(() => {
    if (!open || !searchable) {
      setResults([]);
      setStatus("idle");
      setActive(-1);
      return;
    }
    setStatus("loading");
    const controller = new AbortController();
    const timer = setTimeout(async () => {
      try {
        const events = await api.searchEvents(query, MAX_RESULTS, controller.signal);
        setResults(events ?? []);
        setActive(-1);
        setStatus("done");
      } catch {
        if (!controller.signal.aborted) setStatus("error");
      }
    }, DEBOUNCE_MS);
    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [open, query, searchable]);

  const go = (href: string) => {
    setOpen(false);
    router.push(href);
  };

  const choose = (index: number) => {
    const event = results[index];
    if (event) go(`/events/${event.id}`);
    else if (query) go(searchHref(query));
  };

  const onKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "ArrowDown" && optionCount > 0) {
      event.preventDefault();
      setActive((current) => (current + 1) % optionCount);
    } else if (event.key === "ArrowUp" && optionCount > 0) {
      event.preventDefault();
      setActive((current) => (current <= 0 ? optionCount - 1 : current - 1));
    } else if (event.key === "Enter") {
      event.preventDefault();
      if (query) choose(active);
    }
  };

  const optionId = (index: number) => `${listId}-option-${index}`;

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger className="flex items-center rounded-full p-1 transition-colors hover:text-brand" aria-label="Search events (Ctrl+K)">
        <SearchIcon />
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/40 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <Dialog.Content
          onOpenAutoFocus={(event) => {
            event.preventDefault();
            inputRef.current?.focus();
            inputRef.current?.select();
          }}
          className="fixed left-1/2 top-[12%] z-50 flex max-h-[76vh] w-[calc(100%-2rem)] max-w-[600px] -translate-x-1/2 flex-col overflow-hidden rounded-[8px] bg-white shadow-xl data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95"
        >
          <Dialog.Title className="sr-only">Search events</Dialog.Title>
          <Dialog.Description className="sr-only">Search by event name, location, host or category.</Dialog.Description>

          <div className="flex items-center gap-x-3 border-b border-[#EBEBEB] px-4">
            {status === "loading" ? <Spinner className="shrink-0 text-brand" /> : <SearchIcon className="shrink-0 text-[#959595]" />}
            <input
              ref={inputRef}
              value={text}
              onChange={(event) => setText(event.target.value)}
              onKeyDown={onKeyDown}
              placeholder="Search events, locations, hosts or categories"
              maxLength={100}
              role="combobox"
              aria-expanded={optionCount > 0}
              aria-controls={listId}
              aria-autocomplete="list"
              aria-activedescendant={active >= 0 ? optionId(active) : undefined}
              className="h-14 min-w-0 flex-1 bg-transparent font-nunito text-[16px] outline-none placeholder:text-[#959595]"
            />
            <kbd className="hidden rounded border border-[#EBEBEB] px-1.5 py-0.5 font-nunito text-[11px] text-[#959595] sm:block">Esc</kbd>
          </div>

          <div className="overflow-y-auto">
            {!searchable && (
              <div className="flex flex-col gap-y-3 p-4">
                <p className="font-nunito text-[13px] font-[600] text-[#959595]">Try a category</p>
                <div className="flex flex-wrap gap-2">
                  {EVENT_CATEGORIES.map((category) => (
                    <button
                      key={category}
                      type="button"
                      onClick={() => {
                        setText(category);
                        inputRef.current?.focus();
                      }}
                      className="rounded-full border border-[#EBEBEB] px-3 py-1.5 font-nunito text-[13px] font-[500] transition-colors hover:border-brand-soft hover:bg-brand-light hover:text-brand"
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {searchable && status === "error" && (
              <p className="p-6 text-center font-nunito text-[14px] text-[#676767]">Search isn&apos;t available right now. Please try again.</p>
            )}

            {searchable && status === "done" && (
              <ul id={listId} role="listbox" aria-label="Search results" className="py-2">
                {results.length === 0 && (
                  <li className="px-4 py-6 text-center font-nunito text-[14px] text-[#676767]">
                    No events match &ldquo;{query}&rdquo;
                  </li>
                )}
                {results.map((event, index) => (
                  <li
                    key={event.id}
                    id={optionId(index)}
                    role="option"
                    aria-selected={active === index}
                    onMouseEnter={() => setActive(index)}
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => choose(index)}
                    className={cn("flex cursor-pointer items-center gap-x-3 px-4 py-2.5", active === index && "bg-brand-light")}
                  >
                    <div className="relative flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-[6px] bg-brand-light text-brand">
                      {event.event_image ? (
                        <Image src={event.event_image} alt="" fill sizes="48px" className="object-cover" />
                      ) : (
                        <CalendarIcon className="size-5" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-montserrat text-[15px] font-[600]">
                        <Highlight text={event.event_name ?? "Untitled event"} query={query} />
                      </p>
                      <p className="truncate font-nunito text-[12px] font-[500] text-[#676767]">
                        <span className="text-brand-text">{shortDate(event.start_date)}</span> · {orDash(event.location)}
                      </p>
                    </div>
                  </li>
                ))}
                <li
                  id={optionId(results.length)}
                  role="option"
                  aria-selected={active === results.length}
                  onMouseEnter={() => setActive(results.length)}
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => go(searchHref(query))}
                  className={cn(
                    "mt-1 flex cursor-pointer items-center justify-between border-t border-[#EBEBEB] px-4 py-3 font-nunito text-[14px] font-[600] text-brand",
                    active === results.length && "bg-brand-light",
                  )}
                >
                  <span className="truncate">See all results for &ldquo;{query}&rdquo;</span>
                  <ArrowRightIcon className="size-4 shrink-0" />
                </li>
              </ul>
            )}
          </div>

          <div className="hidden items-center gap-x-4 border-t border-[#EBEBEB] bg-[#FAFAFA] px-4 py-2 font-nunito text-[11px] text-[#959595] sm:flex">
            <span>↑↓ to navigate</span>
            <span>↵ to open</span>
            <span>Esc to close</span>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
