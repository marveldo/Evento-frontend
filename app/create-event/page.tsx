import { EventForm } from "@/components/events/create/EventForm";

export default function CreateEventPage() {
  return (
    <main className="mb-40 flex w-full justify-center pt-32">
      <div className="w-full max-w-[592px] space-y-16 px-3 md:px-0">
        <EventForm />
      </div>
    </main>
  );
}
