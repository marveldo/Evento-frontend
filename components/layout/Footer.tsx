import Image from "next/image";
import appleBadge from "@/public/apple badge.png";
import googleBadge from "@/public/googlebadge.png";
import instagram from "@/public/Instagram.png";
import linkedin from "@/public/Linkden.png";
import facebook from "@/public/Social.png";
import twitter from "@/public/Twitter.png";

const LINKS = ["Explore", "What’s New", "Help", "Contact us"];
const SOCIALS = [
  { icon: linkedin, label: "LinkedIn" },
  { icon: twitter, label: "Twitter" },
  { icon: facebook, label: "Facebook" },
  { icon: instagram, label: "Instagram" },
];

export function Footer() {
  return (
    <footer className="mt-auto flex w-full flex-col border-t border-[#DEDEDE] bg-white max-[870px]:px-4 max-[870px]:py-3 sm:px-24 sm:py-20">
      <div className="flex flex-row items-center justify-between border-b border-[#DEDEDE] pb-7 max-[870px]:flex-col max-[870px]:items-start max-[870px]:gap-y-3">
        <div className="flex flex-row items-center gap-x-9 text-center max-[870px]:flex-col max-[870px]:items-start max-[870px]:text-start">
          <p className="font-chelseamarket text-[24px] font-[700] text-brand">Evento</p>
          <div className="flex gap-x-7 font-nunito font-[700] max-[870px]:text-[10px]">
            {LINKS.map((link) => (
              <p key={link}>{link}</p>
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-y-3 text-center max-[870px]:text-start">
          <p className="font-nunito text-[14px] font-[700] leading-[20px] max-[870px]:text-[10px]">Download the app</p>
          <div className="flex flex-row gap-x-2">
            <Image src={appleBadge} alt="Download on the App Store" />
            <Image src={googleBadge} alt="Get it on Google Play" />
          </div>
        </div>
      </div>
      <div className="flex flex-row justify-between pt-7 max-[870px]:flex-col max-[870px]:gap-y-5">
        <p className="font-nunito text-[14px] font-[600] text-brand">© {new Date().getFullYear()} Evento. All rights reserved.</p>
        <div className="flex flex-row gap-x-3 font-nunito font-[500]">
          <p>Terms of Service</p>
          <p>Privacy Policy</p>
        </div>
        <div className="flex flex-row gap-x-6">
          {SOCIALS.map((social) => (
            <Image key={social.label} src={social.icon} alt={social.label} />
          ))}
        </div>
      </div>
    </footer>
  );
}
