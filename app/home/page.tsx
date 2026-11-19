import { Suspense } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Container } from "@/components/common/Container";
import { SectionHeading } from "@/components/common/SectionHeading";
import { CategoryFilter } from "@/components/events/CategoryFilter";
import { EventGridSkeleton } from "@/components/events/EventGrid";
import { EventsSection } from "@/components/events/EventsSection";
import { DEFAULT_CATEGORY } from "@/lib/categories";
import { getSession } from "@/lib/server/session";
import arrowImage from "@/public/Group 39866.png";

function Hero() {
  return (
    <div className="relative flex w-full flex-col justify-center gap-y-6 bg-brand-light px-8 py-16 text-center md:px-14 lg:px-28">
      <h1 className="font-montserrat text-[28px] font-[600] md:text-[55px]">
        Finding Events Have <span className="text-brand">Never</span> been <span className="text-brand">Easier</span>
      </h1>
      <p className="px-4 font-nunito text-[13px] leading-[28px] md:px-28 md:text-[16px]">
        Discover events that match your interests effortlessly. From live concerts to community gatherings, explore a variety
        of experiences tailored just for you. Stay updated, connect with others, and make every moment count.
      </p>
      <div className="mt-7 flex w-full justify-center">
        <div className="flex rounded-[8px] bg-white">
          <Input type="email" placeholder="Email" className="max-w-[372px] border-none" />
          <Button variant="brand">Subscribe</Button>
        </div>
      </div>
      <div className="left-0 hidden md:absolute md:block">
        <Image src={arrowImage} alt="" />
      </div>
    </div>
  );
}

interface EventsBlockProps {
  title: string;
  tag: string;
  page?: number;
  pageHref?: (page: number) => string;
}

function EventsBlock({ title, tag, page = 1, pageHref }: EventsBlockProps) {
  return (
    <Container className="flex flex-col gap-y-16 pt-4 min-[870px]:pt-10 min-[1300px]:pt-24">
      <SectionHeading eyebrow="Discover" title={title} />
      <Suspense key={`${tag}:${page}`} fallback={<EventGridSkeleton />}>
        <EventsSection tag={tag} page={page} pageHref={pageHref} />
      </Suspense>
    </Container>
  );
}

function pageNumber(value: string | undefined) {
  const page = Number(value);
  return Number.isInteger(page) && page > 0 ? page : 1;
}

export default function HomePage({ searchParams }: { searchParams: { tag?: string; page?: string } }) {
  const tag = searchParams.tag || DEFAULT_CATEGORY;
  const loggedIn = Boolean(getSession());
  const page = pageNumber(searchParams.page);
  const pageHref = (n: number) => {
    const params = new URLSearchParams({ tag });
    if (n > 1) params.set("page", String(n));
    return `/home?${params}`;
  };

  return (
    <main className="w-full py-[4.5rem]">
      <Hero />
      <Container className="flex flex-col gap-y-16 pt-4 min-[870px]:pt-10 min-[1300px]:pt-24">
        <h2 className="hidden font-montserrat text-[32px] font-[700] leading-[40px] md:block">Event Categories</h2>
        <CategoryFilter active={tag} />
      </Container>
      <EventsBlock title={`${tag} Events`} tag={tag} page={page} pageHref={pageHref} />
      {loggedIn && <EventsBlock title="Recommended for You" tag="Recommended" />}
    </main>
  );
}
