import { Suspense } from "react";
import Link from "next/link";
import { Container } from "@/components/common/Container";
import { LoadFailed } from "@/components/common/LoadFailed";
import { EmptyState } from "@/components/common/EmptyState";
import { Pagination } from "@/components/common/Pagination";
import { SectionHeading } from "@/components/common/SectionHeading";
import { EventGrid, EventGridSkeleton } from "@/components/events/EventGrid";
import { SearchForm } from "@/components/search/SearchForm";
import { EVENT_CATEGORIES } from "@/lib/categories";
import { load, searchEvents } from "@/lib/server/data";
import { searchHref } from "@/lib/search";
import calendarIcon from "@/public/calendericon.svg";

export const metadata = { title: "Search | Evento" };

interface SearchPageProps {
  searchParams: { q?: string; page?: string };
}

function pageNumber(value: string | undefined) {
  const page = Number(value);
  return Number.isInteger(page) && page > 0 ? page : 1;
}

function CategoryChips({ label }: { label: string }) {
  return (
    <div className="flex flex-col gap-y-3">
      <p className="font-nunito text-[14px] font-[600] text-[#959595]">{label}</p>
      <div className="flex flex-wrap gap-2">
        {EVENT_CATEGORIES.map((category) => (
          <Link
            key={category}
            href={searchHref(category)}
            className="rounded-full border border-[#EBEBEB] bg-white px-4 py-2 font-nunito text-[14px] font-[500] transition-colors hover:border-brand-soft hover:bg-brand-light hover:text-brand"
          >
            {category}
          </Link>
        ))}
      </div>
    </div>
  );
}

async function Results({ text, page }: { text: string; page: number }) {
  const loaded = await load(searchEvents(text, page));
  if (loaded.error) return <LoadFailed unavailable={loaded.error.unavailable} compact />;
  const result = loaded.data;

  if (result.count === 0) {
    return (
      <div className="flex flex-col items-center gap-y-10">
        <EmptyState image={calendarIcon} title={`No events match "${text}"`}>
          Try a shorter word, a city, or one of the categories below.
        </EmptyState>
        <CategoryChips label="Browse by category" />
      </div>
    );
  }

  const first = (page - 1) * result.limit + 1;
  const last = Math.min(first + result.data.length - 1, result.count);

  return (
    <div className="flex flex-col gap-y-10">
      <p className="font-nunito text-[14px] font-[600] text-[#676767]">
        {result.data.length > 0
          ? `Showing ${first}–${last} of ${result.count} ${result.count === 1 ? "event" : "events"}`
          : `${result.count} ${result.count === 1 ? "event" : "events"} found`}
      </p>
      <EventGrid events={result.data} />
      <div className="flex justify-center">
        <Pagination page={page} totalPages={result.total_pages} href={(n) => searchHref(text, n)} />
      </div>
    </div>
  );
}

export default function SearchPage({ searchParams }: SearchPageProps) {
  const text = (searchParams.q ?? "").trim().slice(0, 100);
  const page = pageNumber(searchParams.page);

  return (
    <Container className="mb-40 flex flex-grow flex-col gap-y-12 pt-28">
      <div className="flex flex-col gap-y-6">
        <SectionHeading eyebrow="Search" title={text ? `Results for "${text}"` : "Find your next event"} />
        <div className="max-w-[640px]">
          <SearchForm key={text} initial={text} />
        </div>
      </div>

      {text ? (
        <Suspense key={`${text}:${page}`} fallback={<EventGridSkeleton count={6} />}>
          <Results text={text} page={page} />
        </Suspense>
      ) : (
        <CategoryChips label="Popular searches" />
      )}
    </Container>
  );
}
