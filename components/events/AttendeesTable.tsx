import Image from "next/image";
import { Pagination } from "@/components/common/Pagination";
import { UserAvatar } from "@/components/common/UserAvatar";
import { orDash } from "@/lib/format";
import type { Page, User } from "@/lib/types";
import profileShape from "@/public/combo shape.svg";

interface AttendeesTableProps {
  attendees: Page<User>;
  page: number;
  pageHref: (page: number) => string;
}

function NoGuests() {
  return (
    <div className="flex h-[400px] w-full items-center justify-center">
      <div className="flex flex-col items-center gap-y-4 text-center">
        <Image src={profileShape} alt="" />
        <p className="font-work text-[22px] font-[600] text-[#DEDEDE]">No Guests Yet</p>
      </div>
    </div>
  );
}

export function AttendeesTable({ attendees, page, pageHref }: AttendeesTableProps) {
  if (attendees.count === 0) return <NoGuests />;

  return (
    <div className="space-y-5 px-2 md:px-6">
      <h2 className="font-montserrat text-[28px] font-[700]">All attendees data</h2>
      <p className="font-nunito text-[16px] font-[600]">{attendees.count} Attendees</p>

      <div className="flex h-[700px] w-full flex-col overflow-hidden rounded-[16px] md:h-[577px] md:border md:border-[#B1B1B1]">
        <div className="hidden w-full grid-cols-3 bg-[#F5F5F5] py-4 text-center font-montserrat text-[20px] font-[600] md:grid">
          <div>Name</div>
          <div>Contact</div>
          <div>Address</div>
        </div>

        {attendees.data.map((attendee) => (
          <div key={attendee.id} className="border-b border-[#B1B1B1]">
            <div className="hidden w-full grid-cols-3 py-5 text-center font-nunito text-[14px] font-[600] md:grid">
              <div className="flex items-center justify-center gap-x-3">
                <UserAvatar name={attendee.full_name} image={attendee.profile_img} />
                <p className="text-[20px]">{attendee.full_name}</p>
              </div>
              <div className="flex items-center justify-center">{attendee.email}</div>
              <div className="flex items-center justify-center">{orDash(attendee.location)}</div>
            </div>
            <div className="flex items-center gap-x-3 px-3 py-4 md:hidden">
              <UserAvatar name={attendee.full_name} image={attendee.profile_img} />
              <div className="flex flex-col gap-y-2">
                <p className="text-[20px]">{attendee.full_name}</p>
                <p>{attendee.email}</p>
                <p>{orDash(attendee.location)}</p>
              </div>
            </div>
          </div>
        ))}

        <div className="mt-auto flex w-full items-center justify-between px-5 py-3 md:px-20 md:py-12">
          <p className="text-[12px] md:text-[15px]">
            Showing page {page} of {attendees.total_pages}
          </p>
          <Pagination page={page} totalPages={attendees.total_pages} href={pageHref} />
        </div>
      </div>
    </div>
  );
}
