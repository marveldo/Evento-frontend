import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeftIcon } from "@radix-ui/react-icons";
import { LoadFailed } from "@/components/common/LoadFailed";
import { EditEventForm } from "@/components/events/edit/EditEventForm";
import { getEvent, load } from "@/lib/server/data";
import { getSession } from "@/lib/server/session";

export const metadata = { title: "Edit event | Evento" };

export default async function EditEventPage({ params }: { params: { id: string } }) {
  const eventHref = `/events/${params.id}`;
  const loaded = await load(getEvent(params.id));

  return (
    <main className="mb-40 flex w-full justify-center pt-32">
      <div className="w-full max-w-[592px] space-y-8 px-3 md:px-0">
        <div className="space-y-3">
          <Link href={eventHref} className="inline-flex items-center gap-x-2 font-nunito text-[14px] font-[600] text-[#676767] hover:text-brand">
            <ArrowLeftIcon /> Back to event
          </Link>
          <h1 className="font-montserrat text-[24px] font-[700] md:text-[32px]">Edit event</h1>
        </div>
        {loaded.error ? <LoadFailed unavailable={loaded.error.unavailable} /> : <HostOnly event={loaded.data} eventHref={eventHref} />}
      </div>
    </main>
  );
}

function HostOnly({ event, eventHref }: { event: Parameters<typeof EditEventForm>[0]["event"]; eventHref: string }) {
  // Only the host may edit; everyone else goes back to the event (the backend refuses them too).
  if (getSession()?.user.id !== event.hosted_by.id) redirect(eventHref);
  return <EditEventForm event={event} />;
}
