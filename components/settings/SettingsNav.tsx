"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRouter } from "nextjs-toploader/app";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DeleteAccountDialog } from "@/components/settings/DeleteAccountDialog";
import { cn } from "@/lib/utils";

const LINKS = [
  { href: "/settings/account", label: "Account" },
  { href: "/settings/data-and-security", label: "Data & Security" },
];
const DELETE = "delete";

function Title({ className }: { className: string }) {
  return (
    <div className="flex items-center gap-x-3">
      <h1 className={cn("font-montserrat font-[600]", className)}>Settings</h1>
      <div className="h-0 w-[61px] border border-[#3C3C3C]" />
    </div>
  );
}

export function SettingsNav() {
  const pathname = usePathname();
  const router = useRouter();
  const [confirmDelete, setConfirmDelete] = useState(false);

  return (
    <>
      <div className="hidden flex-col gap-y-10 max-[870px]:px-4 max-[1200px]:px-10 max-[1290px]:px-14 min-[1300px]:px-24 md:flex">
        <Title className="text-[48px]" />
        <nav className="flex flex-col gap-y-7 ps-2 font-nunito text-[20px]">
          {LINKS.map((link) => (
            <Link key={link.href} href={link.href} className={cn("rounded-[8px] p-3", pathname === link.href && "bg-brand-light")}>
              {link.label}
            </Link>
          ))}
          <button type="button" className="p-3 text-left text-[#F04438]" onClick={() => setConfirmDelete(true)}>
            Delete Account
          </button>
        </nav>
      </div>

      <div className="flex flex-col gap-y-2 px-3 md:hidden">
        <Title className="text-[32px]" />
        <Select value={pathname} onValueChange={(value) => (value === DELETE ? setConfirmDelete(true) : router.push(value))}>
          <SelectTrigger className="h-[56px] border-[#EBEBEB]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {LINKS.map((link) => (
              <SelectItem key={link.href} value={link.href}>
                {link.label}
              </SelectItem>
            ))}
            <SelectItem value={DELETE} className="text-[#F04438]">
              Delete Account
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      <DeleteAccountDialog open={confirmDelete} onOpenChange={setConfirmDelete} />
    </>
  );
}
