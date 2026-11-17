import Link from "next/link";
import { Facebook, Globe, Instagram, PencilLine, Twitter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/common/Container";
import { UserAvatar } from "@/components/common/UserAvatar";
import type { User } from "@/lib/types";

const EDIT_HREF = "/settings/account";

// Profile links are typed in by the user, so make sure they open as absolute URLs.
function absolute(url: string) {
  return /^https?:\/\//i.test(url) ? url : `https://${url}`;
}

export function ProfileHeader({ user }: { user: User }) {
  const socials = [
    { href: user.instagram, label: "Instagram", icon: Instagram },
    { href: user.facebook, label: "Facebook", icon: Facebook },
    { href: user.twitter, label: "Twitter", icon: Twitter },
    { href: user.website, label: "Website", icon: Globe },
  ].filter((social): social is typeof social & { href: string } => Boolean(social.href?.trim()));

  return (
    <header>
      <div className="relative h-[120px] bg-brand-light md:h-[180px]">
        <Link
          href={EDIT_HREF}
          aria-label="Edit profile"
          className="absolute right-4 top-4 flex size-9 items-center justify-center rounded-full bg-brand text-white transition-transform hover:scale-105 md:right-8 md:top-6"
        >
          <PencilLine className="size-4" />
        </Link>
      </div>

      <Container>
        <div className="mx-auto max-w-[860px]">
          <UserAvatar
            name={user.full_name}
            image={user.profile_img}
            className="-mt-12 size-24 border-4 border-white text-[28px] shadow-sm md:-mt-14 md:size-28"
          />
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
            <h1 className="font-montserrat text-[20px] font-[600] md:text-[24px]">{user.full_name || "Your profile"}</h1>
            <Button asChild variant="brandOutline" className="h-9 gap-x-2 rounded-[6px] px-4 text-[13px]">
              <Link href={EDIT_HREF}>
                <PencilLine className="size-4" /> Edit Profile
              </Link>
            </Button>
          </div>

          <p className="mt-3 max-w-[680px] whitespace-pre-line font-nunito text-[14px] leading-[22px] text-[#676767]">
            {user.bio?.trim() || (
              <>
                No bio yet.{" "}
                <Link href={EDIT_HREF} className="text-brand hover:underline">
                  Tell people about yourself
                </Link>
              </>
            )}
          </p>

          {socials.length > 0 && (
            <div className="mt-4 flex items-center gap-x-4">
              {socials.map(({ href, label, icon: Icon }) => (
                <a key={label} href={absolute(href)} target="_blank" rel="noopener noreferrer" aria-label={label} className="text-[#1E1E1E] transition-colors hover:text-brand">
                  <Icon className="size-[18px]" />
                </a>
              ))}
            </div>
          )}
        </div>
      </Container>
    </header>
  );
}
