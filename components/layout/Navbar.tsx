"use client";

import { Fragment, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { PlusIcon } from "@radix-ui/react-icons";
import { Bell, CalendarDays, ChevronDown, Compass, LogOut, Menu, Plus, Receipt, Settings, SlidersHorizontal, User, type LucideIcon } from "lucide-react";
import { NotificationBell } from "@/components/notifications/NotificationBell";
import { SearchDialog } from "@/components/search/SearchDialog";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Container } from "@/components/common/Container";
import { UserAvatar } from "@/components/common/UserAvatar";
import { useSession } from "@/components/providers/SessionProvider";
import { cn } from "@/lib/utils";
import type { SessionUser } from "@/lib/types";

interface MenuLink {
  href: string;
  label: string;
  icon: LucideIcon;
}

// Shown as text links in the bar from md up; inside the mobile menu below that.
const APP_LINKS: MenuLink[] = [
  { href: "/home", label: "Explore", icon: Compass },
  { href: "/dashboard", label: "Manage events", icon: CalendarDays },
  { href: "/create-event", label: "Create event", icon: Plus },
];

const linksFor = (role: SessionUser["role"]) => (role === "organizer" ? APP_LINKS : APP_LINKS.slice(0, 1));
// Organizers get every app link in the bar; attendees find Explore in the account menu instead.
const barLinksFor = (role: SessionUser["role"]) => (role === "organizer" ? APP_LINKS : []);
const menuLinksFor = (role: SessionUser["role"]) => (role === "organizer" ? APP_LINKS.slice(1) : APP_LINKS.slice(0, 1));

const ACCOUNT_LINKS: MenuLink[] = [
  { href: "/profile", label: "My profile", icon: User },
  { href: "/notifications", label: "Notifications", icon: Bell },
  { href: "/orders", label: "Orders", icon: Receipt },
  { href: "/settings/preferences", label: "Preferences", icon: SlidersHorizontal },
  { href: "/settings/account", label: "Settings", icon: Settings },
];

const isActive = (pathname: string, href: string) => pathname === href || pathname.startsWith(`${href}/`);

function Logo() {
  return (
    <Link href="/" className="font-chelseamarket text-[22px] font-[700] text-brand sm:text-[24px]">
      Evento
    </Link>
  );
}

function GuestActions() {
  return (
    <div className="flex items-center gap-x-2 sm:gap-x-4">
      <Button asChild variant="brandOutline" className="h-9 px-4 text-[13px] sm:h-12 sm:px-11 sm:text-[14px]">
        <Link href="/login">Sign In</Link>
      </Button>
      <Button asChild variant="brand" className="h-9 px-4 text-[13px] sm:h-12 sm:px-11 sm:text-[14px]">
        <Link href="/create-event">Create event</Link>
      </Button>
    </div>
  );
}

function UserSummary({ user }: { user: SessionUser }) {
  return (
    <div className="flex min-w-0 items-center gap-x-3">
      <UserAvatar name={user.name} image={user.image} className="size-10 shrink-0" />
      <div className="min-w-0 text-left">
        <p className="truncate font-nunito text-[14px] font-[700] text-[#1E1E1E]">{user.name}</p>
        <p className="truncate font-nunito text-[12px] font-[400] text-[#6B6B6B]">{user.email}</p>
      </div>
    </div>
  );
}

const itemClass = (active: boolean) =>
  cn(
    "flex items-center gap-x-3 rounded-lg px-3 font-nunito text-[14px] font-[500] transition-colors [&_svg]:size-4 [&_svg]:shrink-0",
    active ? "bg-brand-light text-brand [&_svg]:text-brand" : "text-[#1E1E1E] hover:bg-[#F5F5F5] [&_svg]:text-[#6B6B6B]",
  );

// Desktop (md and up): avatar dropdown with the account links.
function UserMenu({ user, onLogout }: { user: SessionUser; onLogout: () => void }) {
  const pathname = usePathname();
  const groups = [menuLinksFor(user.role), ACCOUNT_LINKS].filter((group) => group.length > 0);

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger
        className="group flex items-center gap-x-1.5 rounded-full p-0.5 pr-1.5 outline-none transition-colors hover:bg-[#F5F5F5] focus-visible:ring-2 focus-visible:ring-brand/40 data-[state=open]:bg-[#F5F5F5]"
        aria-label="Account menu"
      >
        <UserAvatar name={user.name} image={user.image} className="size-9" />
        <ChevronDown className="size-4 text-[#6B6B6B] transition-transform duration-200 group-data-[state=open]:rotate-180" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" collisionPadding={16} className="w-64">
        <DropdownMenuLabel className="font-normal">
          <UserSummary user={user} />
        </DropdownMenuLabel>
        {groups.map((group, index) => (
          <Fragment key={index}>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              {group.map(({ href, label, icon: Icon }) => {
                const active = isActive(pathname, href);
                return (
                  <DropdownMenuItem
                    key={href}
                    asChild
                    className={active ? "bg-brand-light text-brand data-[highlighted]:bg-brand-light" : undefined}
                  >
                    <Link href={href} aria-current={active ? "page" : undefined}>
                      <Icon className={active ? "text-brand" : "text-[#6B6B6B]"} />
                      {label}
                    </Link>
                  </DropdownMenuItem>
                );
              })}
            </DropdownMenuGroup>
          </Fragment>
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuItem onSelect={onLogout} className="text-[#D92D20] data-[highlighted]:bg-[#FEF3F2]">
          <LogOut />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// Below md: a slide-in panel with every link, styled like the dropdown.
function MobileMenu({ user, onLogout }: { user: SessionUser; onLogout: () => void }) {
  const pathname = usePathname();

  return (
    <Sheet>
      <SheetTrigger
        className="flex size-9 items-center justify-center rounded-full transition-colors hover:bg-[#F5F5F5] md:hidden"
        aria-label="Open menu"
      >
        <Menu className="size-5" />
      </SheetTrigger>
      <SheetContent side="right" className="flex w-[85%] max-w-[320px] flex-col gap-0 p-0">
        <SheetHeader className="border-b border-[#EBEBEB] px-5 pb-4 pt-5 text-left">
          <SheetTitle className="sr-only">Menu</SheetTitle>
          <SheetDescription className="sr-only">Navigation and account</SheetDescription>
          <div className="pr-8">
            <UserSummary user={user} />
          </div>
        </SheetHeader>

        <nav className="flex flex-1 flex-col gap-y-1 overflow-y-auto px-3 py-3" aria-label="Main">
          {[linksFor(user.role), ACCOUNT_LINKS].map((group, index) => (
            <Fragment key={index}>
              {index > 0 && <div className="-mx-3 my-2 h-px bg-[#EBEBEB]" />}
              {group.map(({ href, label, icon: Icon }) => {
                const active = isActive(pathname, href);
                return (
                  <SheetClose key={href} asChild>
                    <Link href={href} aria-current={active ? "page" : undefined} className={cn(itemClass(active), "py-2.5")}>
                      <Icon />
                      {label}
                    </Link>
                  </SheetClose>
                );
              })}
            </Fragment>
          ))}
        </nav>

        <div className="border-t border-[#EBEBEB] p-3">
          <SheetClose asChild>
            <button
              type="button"
              onClick={onLogout}
              className="flex w-full items-center gap-x-3 rounded-lg px-3 py-2.5 font-nunito text-[14px] font-[500] text-[#D92D20] transition-colors hover:bg-[#FEF3F2] [&_svg]:size-4"
            >
              <LogOut />
              Log out
            </button>
          </SheetClose>
        </div>
      </SheetContent>
    </Sheet>
  );
}

export function Navbar() {
  const { user, logout } = useSession();
  const pathname = usePathname();
  const headerRef = useRef<HTMLElement>(null);

  // Publish the navbar's height as --navbar-height so the page progress bar (globals.css) sits just
  // below it. A ResizeObserver keeps it right as the layout changes (screen size, logged in or out).
  useEffect(() => {
    const header = headerRef.current;
    if (!header) return;
    const root = document.documentElement;
    const update = () => root.style.setProperty("--navbar-height", `${header.offsetHeight}px`);
    update();
    const observer = new ResizeObserver(update);
    observer.observe(header);
    return () => observer.disconnect();
  }, []);

  return (
    <header ref={headerRef} className="fixed top-0 z-30 w-full border-b border-[#EBEBEB] bg-white">
      <Container className="flex items-center justify-between gap-x-4 py-3 sm:py-4">
        <Logo />
        {user ? (
          <>
            <nav className="hidden items-center gap-x-6 font-nunito text-[14px] font-[500] leading-[24px] md:flex lg:gap-x-8" aria-label="Main">
              {barLinksFor(user.role).map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  aria-current={isActive(pathname, href) ? "page" : undefined}
                  className={cn(
                    "flex items-center gap-x-2 whitespace-nowrap transition-colors hover:text-brand",
                    isActive(pathname, href) && "text-brand",
                  )}
                >
                  {label}
                  {href === "/create-event" && <PlusIcon className="size-4" />}
                </Link>
              ))}
            </nav>
            <div className="flex items-center gap-x-1 sm:gap-x-3">
              <SearchDialog />
              <NotificationBell />
              <div className="hidden md:flex">
                <UserMenu user={user} onLogout={logout} />
              </div>
              <MobileMenu user={user} onLogout={logout} />
            </div>
          </>
        ) : (
          <div className="flex items-center gap-x-1 sm:gap-x-3">
            <SearchDialog />
            <GuestActions />
          </div>
        )}
      </Container>
    </header>
  );
}
