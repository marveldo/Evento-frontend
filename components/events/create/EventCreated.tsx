"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { notifyError, notifySuccess } from "@/lib/toast";
import successImage from "@/public/Successful.svg";

export function EventCreated({ link }: { link: string }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
      notifySuccess("Link Copied", "Share it with friends so they can register");
    } catch {
      notifyError("Failed to copy", "Copy the link from the address bar instead.");
    }
  };

  return (
    <div className="flex w-full flex-col items-center gap-y-7 rounded-[24px] border border-[#EBEBEB] p-3 text-center shadow-lg shadow-[#0000000A] md:p-10">
      <h1 className="font-montserrat text-[20px] font-[600] md:text-[32px]">Event Created Successfully</h1>
      <Image src={successImage} width={263} height={263} alt="" />
      <div className="w-full space-y-3">
        <Button asChild variant="brandOutline" size="xl" className="w-full">
          <Link href="/home">See All Events</Link>
        </Button>
        <Button variant="brand" size="xl" className="w-full" disabled={copied} onClick={copy}>
          {copied ? "Copied" : "Copy event Link"}
        </Button>
      </div>
    </div>
  );
}
