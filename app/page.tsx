import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowIcon } from "@/components/common/icons";
import { Container } from "@/components/common/Container";
import avatars from "@/public/Frame 1171275765.png";
import hero from "@/public/Frame 1171276051.png";

export default function LandingPage() {
  return (
    <main className="flex-grow">
      <Container className="flex w-full flex-row gap-x-14 pt-40 max-[870px]:flex-col max-[870px]:items-center max-[870px]:gap-y-10 sm:py-8 sm:pt-40">
        <div className="flex w-1/2 flex-col gap-y-6 py-1 max-[870px]:w-full max-[870px]:items-center max-[870px]:text-center">
          <div className="flex max-w-[329px] items-center justify-between gap-x-2 rounded-[12px] border border-brand bg-white px-4 py-2 font-nunito text-[12px] font-[500] leading-[16px] text-brand min-[1300px]:text-[16px]">
            Plan your special event with us now
            <ArrowIcon />
          </div>
          <h1 className="font-montserrat text-[24px] font-[700] leading-[60px] min-[870px]:text-[40px] min-[1300px]:text-[48px]">
            Never miss a moment with <span className="text-brand">Evento</span>
          </h1>
          <p className="pe-8 font-nunito text-[14px] font-[600] min-[1300px]:text-[20px]">
            Effortlessly organize your schedule and stay on top of your plans.
          </p>
          <div className="flex items-center gap-x-2 max-[870px]:justify-center max-[870px]:text-[11px]">
            <Image src={avatars} alt="" />
            <p>Join over 12,000+ people in creating events</p>
          </div>
          <div className="flex flex-wrap gap-3 max-[870px]:justify-center">
            <Button asChild variant="brand" className="sm:px-11 sm:py-6">
              <Link href="/home">Explore events</Link>
            </Button>
            <Button asChild variant="brandOutline" className="sm:px-11 sm:py-6">
              <Link href="/create-event">Create your event</Link>
            </Button>
          </div>
        </div>
        <div className="sm:w-1/2">
          <Image src={hero} alt="People at an event" priority />
        </div>
      </Container>
    </main>
  );
}
