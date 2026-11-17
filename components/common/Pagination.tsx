import Link from "next/link";
import { ChevronLeftIcon, ChevronRightIcon } from "@radix-ui/react-icons";
import { cn } from "@/lib/utils";

interface PaginationProps {
  page: number;
  totalPages: number;
  href: (page: number) => string;
  window?: number;
  // false keeps the scroll position, for lists further down a page.
  scroll?: boolean;
}

function pageWindow(page: number, totalPages: number, size: number) {
  const start = Math.max(1, Math.min(page - Math.floor(size / 2), totalPages - size + 1));
  const end = Math.min(totalPages, start + size - 1);
  return Array.from({ length: end - start + 1 }, (_, index) => start + index);
}

export function Pagination({ page, totalPages, href, window = 5, scroll = true }: PaginationProps) {
  if (totalPages <= 1) return null;
  const pages = pageWindow(page, totalPages, window);
  const arrow = "flex items-center rounded-[4px] bg-brand-light p-2";

  return (
    <nav className="flex flex-row gap-x-2 text-[16px]" aria-label="Pagination">
      <Link href={href(Math.max(1, page - 1))} scroll={scroll} className={cn(arrow, page === 1 && "pointer-events-none opacity-50")} aria-label="Previous page">
        <ChevronLeftIcon className="size-5" />
      </Link>
      {pages.map((number) => (
        <Link
          key={number}
          href={href(number)}
          scroll={scroll}
          className={cn("rounded-[4px] border border-[#B1B1B1] p-2", number === page && "border-[#ED9E72] bg-brand-light")}
        >
          {number}
        </Link>
      ))}
      <Link href={href(Math.min(totalPages, page + 1))} scroll={scroll} className={cn(arrow, page === totalPages && "pointer-events-none opacity-50")} aria-label="Next page">
        <ChevronRightIcon className="size-5" />
      </Link>
    </nav>
  );
}
