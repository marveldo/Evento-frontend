"use client";

import { Fragment, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { PlusIcon, TextAlignJustifyIcon } from "@radix-ui/react-icons";
import { Bell, CalendarDays, ChevronDown, LogOut, Plus, Settings, User } from "lucide-react";
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
import type { SessionUser } from "@/lib/types";

const APP_LINKS = [
  { href: "/home", label: "Explore" },
  { href: "/dashboard", label: "Manage Events" },
];

function Logo() {
  return (
    <Link href="/" className="font-chelseamarket text-[24px] font-[700] text-brand">
      Evento
    </Link>
  );
}

function GuestActions() {
  return (
    <div className="flex items-center gap-x-4">
      <Button asChild variant="brandOutline" className="sm:px-11 sm:py-6">
        <Link href="/login">Sign In</Link>
      </Button>
      <Button asChild variant="brand" className="sm:px-11 sm:py-6">
        <Link href="/create-event">Create event</Link>
      </Button>
    </div>
  );
}

const MENU_GROUPS = [
  [
    { href: "/profile", label: "My profile", icon: User },
    { href: "/dashboard", label: "Manage events", icon: CalendarDays },
    { href: "/create-event", label: "Create event", icon: Plus },
  ],
  [
    { href: "/notifications", label: "Notifications", icon: Bell },
    { href: "/settings/account", label: "Settings", icon: Settings },
  ],
];

function UserMenu({ user, onLogout }: { user: SessionUser; onLogout: () => void }) {
  const pathname = usePathname();

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger
        className="group flex items-center gap-x-1.5 rounded-full p-0.5 pr-1.5 outline-none transition-colors hover:bg-[#F5F5F5] focus-visible:ring-2 focus-visible:ring-brand/40 data-[state=open]:bg-[#F5F5F5]"
        aria-label="Account menu"
      >
        <UserAvatar name={user.name} image={user.image} className="size-9" />
        <ChevronDown className="size-4 text-[#6B6B6B] transition-transform duration-200 group-data-[state=open]:rotate-180" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64">
        <DropdownMenuLabel className="flex items-center gap-x-3 font-normal">
          <UserAvatar name={user.name} image={user.image} className="size-10" />
          <div className="min-w-0">
            <p className="truncate font-nunito text-[14px] font-[700]">{user.name}</p>
            <p className="truncate font-nunito text-[12px] text-[#6B6B6B]">{user.email}</p>
          </div>
        </DropdownMenuLabel>
        {MENU_GROUPS.map((group, index) => (
          <Fragment key={index}>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              {group.map(({ href, label, icon: Icon }) => {
                const active = pathname === href || pathname.startsWith(`${href}/`);
                return (
                  <DropdownMenuItem key={href} asChild className={active ? "bg-brand-light text-brand data-[highlighted]:bg-brand-light" : undefined}>
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

function MobileMenu({ user, onLogout }: { user: SessionUser; onLogout: () => void }) {
  const links = [
    { href: "/", label: "Home" },
    ...APP_LINKS,
    { href: "/create-event", label: "Create Event" },
    { href: "/profile", label: "Profile" },
    { href: "/notifications", label: "Notifications" },
    { href: "/settings/account", label: "Settings" },
  ];

  return (
    <Sheet>
      <SheetTrigger className="min-[550px]:hidden" aria-label="Open menu">
        <TextAlignJustifyIcon className="size-5" />
      </SheetTrigger>
      <SheetContent side="right">
        <SheetHeader className="mb-28 flex justify-between">
          <SheetTitle className="sr-only">Menu</SheetTitle>
          <SheetDescription className="sr-only">Navigation</SheetDescription>
          <UserAvatar name={user.name} image={user.image} />
          <Logo />
        </SheetHeader>
        <nav className="flex flex-col items-center gap-y-10">
          {links.map((link) => (
            <SheetClose key={link.href} asChild>
              <Link href={link.href}>{link.label}</Link>
            </SheetClose>
          ))}
          <SheetClose asChild>
            <button type="button" onClick={onLogout}>
              Log out
            </button>
          </SheetClose>
        </nav>
      </SheetContent>
    </Sheet>
  );
}

export function Navbar() {
  const { user, logout } = useSession();
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
      <Container className="flex items-center justify-between py-4">
        <Logo />
        {user ? (
          <>
            <nav className="flex items-center gap-x-8 font-nunito text-[14px] font-[500] leading-[24px] max-[550px]:hidden">
              {APP_LINKS.map((link) => (
                <Link key={link.href} href={link.href}>
                  {link.label}
                </Link>
              ))}
              <Link href="/create-event" className="flex items-center gap-x-2">
                Create Event <PlusIcon className="size-4" />
              </Link>
            </nav>
            <div className="flex items-center gap-x-4">
              <SearchDialog />
              <NotificationBell />
              <div className="flex max-[550px]:hidden">
                <UserMenu user={user} onLogout={logout} />
              </div>
              <MobileMenu user={user} onLogout={logout} />
            </div>
          </>
        ) : (
          <GuestActions />
        )}
      </Container>
    </header>
  );
}
