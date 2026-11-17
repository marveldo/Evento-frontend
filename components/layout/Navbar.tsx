"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { BellIcon, GearIcon, HomeIcon, PersonIcon, PlusIcon, TextAlignJustifyIcon } from "@radix-ui/react-icons";
import { NotificationBell } from "@/components/notifications/NotificationBell";
import { SearchDialog } from "@/components/search/SearchDialog";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
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

function UserMenu({ user, onLogout }: { user: SessionUser; onLogout: () => void }) {
  return (
    <Popover>
      <PopoverTrigger className="rounded-full">
        <UserAvatar name={user.name} image={user.image} />
      </PopoverTrigger>
      <PopoverContent>
        <p className="border-b border-b-black p-3 text-center font-nunito text-[24px] font-[700] text-brand">Welcome {user.name}</p>
        <div className="flex w-full flex-col items-center gap-y-3 pt-3">
          <Link href="/" className="flex items-center gap-x-3">
            <HomeIcon className="size-5" /> Home
          </Link>
          <Link href="/profile" className="flex items-center gap-x-3">
            <PersonIcon className="size-5" /> Profile
          </Link>
          <Link href="/notifications" className="flex items-center gap-x-3">
            <BellIcon className="size-5" /> Notifications
          </Link>
          <Link href="/settings/account" className="flex items-center gap-x-3">
            <GearIcon className="size-5" /> Settings
          </Link>
          <Button variant="brandOutline" onClick={onLogout}>
            Log out
          </Button>
        </div>
      </PopoverContent>
    </Popover>
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
