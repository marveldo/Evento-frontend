"use client";

import { useEffect, useState } from "react";
import { Check, Copy, Facebook, Linkedin, Mail, MessageCircle, Share2, Twitter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { fullDate, orDash } from "@/lib/format";
import { notifyError, notifySuccess } from "@/lib/toast";
import type { EventItem } from "@/lib/types";

// The invite tab: a copyable event link and one-tap sharing to common apps.
export function EventShare({ event }: { event: EventItem }) {
  const [copied, setCopied] = useState(false);
  const [canNativeShare, setCanNativeShare] = useState(false);

  // The backend's link to the event; fall back to this page's address if it's missing.
  const [link, setLink] = useState(event.event_link);
  useEffect(() => {
    if (!event.event_link) setLink(`${window.location.origin}/events/${event.id}`);
    setCanNativeShare(typeof navigator.share === "function");
  }, [event.event_link, event.id]);

  const name = event.event_name ?? "this event";
  const message = `Join me at ${name} on ${fullDate(event.start_date)}. Register here:`;
  const encodedLink = encodeURIComponent(link);
  const encodedMessage = encodeURIComponent(message);

  const targets = [
    { label: "WhatsApp", icon: MessageCircle, href: `https://wa.me/?text=${encodeURIComponent(`${message} ${link}`)}` },
    { label: "X (Twitter)", icon: Twitter, href: `https://twitter.com/intent/tweet?text=${encodedMessage}&url=${encodedLink}` },
    { label: "Facebook", icon: Facebook, href: `https://www.facebook.com/sharer/sharer.php?u=${encodedLink}` },
    { label: "LinkedIn", icon: Linkedin, href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedLink}` },
    {
      label: "Email",
      icon: Mail,
      href: `mailto:?subject=${encodeURIComponent(`You're invited: ${name}`)}&body=${encodeURIComponent(`${message}\n${link}`)}`,
    },
  ];

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
      notifySuccess("Link copied", "Share it with friends so they can register.");
      setTimeout(() => setCopied(false), 2500);
    } catch {
      notifyError("Couldn't copy the link", "Select the link and copy it instead.");
    }
  };

  const nativeShare = async () => {
    try {
      await navigator.share({ title: name, text: message, url: link });
    } catch {
      // Closing the share sheet rejects too; nothing to report.
    }
  };

  return (
    <div className="mx-auto flex w-full max-w-[640px] flex-col gap-y-8">
      <div className="space-y-2">
        <h2 className="font-montserrat text-[22px] font-[700] md:text-[28px]">Share invites</h2>
        <p className="font-nunito text-[14px] text-[#676767] md:text-[15px]">
          Invite people to <span className="font-[600] text-[#1E1E1E]">{orDash(event.event_name)}</span>. Anyone with the link can view the event and
          register.
        </p>
      </div>

      <div className="space-y-3">
        <p className="font-nunito text-[14px] font-[600]">Event link</p>
        <div className="flex flex-col gap-3 sm:flex-row">
          <input
            readOnly
            value={link}
            onFocus={(e) => e.target.select()}
            aria-label="Event link"
            className="h-12 min-w-0 flex-1 rounded-[8px] border border-[#EBEBEB] bg-[#FAFAFA] px-4 font-nunito text-[14px] text-[#4D4D4D] outline-none focus:border-brand-soft"
          />
          <Button variant="brand" className="h-12 gap-x-2 px-6" onClick={copy}>
            {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
            {copied ? "Copied" : "Copy link"}
          </Button>
        </div>
      </div>

      <div className="space-y-3">
        <p className="font-nunito text-[14px] font-[600]">Share to</p>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {targets.map(({ label, icon: Icon, href }) => (
            <a
              key={label}
              href={href}
              target={href.startsWith("mailto:") ? undefined : "_blank"}
              rel="noopener noreferrer"
              className="flex h-12 items-center justify-center gap-x-2 rounded-[6px] border border-brand font-nunito text-[13px] font-[500] text-brand transition-colors hover:bg-brand hover:text-white"
            >
              <Icon className="size-4" />
              {label}
            </a>
          ))}
          {canNativeShare && (
            <button
              type="button"
              onClick={nativeShare}
              className="flex h-12 items-center justify-center gap-x-2 rounded-[6px] border border-brand font-nunito text-[13px] font-[500] text-brand transition-colors hover:bg-brand hover:text-white"
            >
              <Share2 className="size-4" />
              More…
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
