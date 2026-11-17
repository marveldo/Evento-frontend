"use client";

import Link from "next/link";
import { format, isValid, parse, parseISO } from "date-fns";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "nextjs-toploader/app";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LoadingButton } from "@/components/common/LoadingButton";
import { DateTimeRow } from "@/components/form/DateTimeFields";
import { ImageDropzone } from "@/components/form/ImageDropzone";
import { TextField } from "@/components/form/TextField";
import { api } from "@/lib/api/client";
import { uploadPhoto } from "@/lib/api/photos";
import { EVENT_CATEGORIES } from "@/lib/categories";
import { applyFieldErrors } from "@/lib/forms";
import { editEventSchema, type EditEventValues } from "@/lib/schemas/event";
import { notifyApiError, notifySuccess } from "@/lib/toast";
import type { EventItem } from "@/lib/types";

const SERVER_FIELDS = ["event_name", "description", "price", "location", "event_category", "capacity", "event_image"] as const;
const LABEL = "font-montserrat text-[16px] font-[600] md:text-[20px]";

// "2026-11-15" -> that day at local midnight.
function toDay(value: string | null) {
  const date = value ? parseISO(value) : null;
  return date && isValid(date) ? date : undefined;
}

// "13:00:00" -> today at that time (only the hours and minutes are used).
function toClock(value: string | null) {
  const time = value ? parse(value.slice(0, 8), "HH:mm:ss", new Date()) : null;
  return time && isValid(time) ? time : undefined;
}

export function EditEventForm({ event }: { event: EventItem }) {
  const router = useRouter();
  const currentCategory = event.category[0]?.tag_name ?? "";
  // Keep the event's category selectable even if it isn't one of the standard ones.
  const categories = currentCategory && !EVENT_CATEGORIES.some((c) => c === currentCategory) ? [currentCategory, ...EVENT_CATEGORIES] : [...EVENT_CATEGORIES];
  const eventHref = `/events/${event.id}`;

  const form = useForm<EditEventValues>({
    resolver: zodResolver(editEventSchema),
    defaultValues: {
      event_name: event.event_name ?? "",
      description: event.description ?? "",
      location: event.location ?? "",
      event_category: currentCategory,
      price: event.price ?? 0,
      capacity: event.capacity ?? 1,
      start_date: toDay(event.start_date),
      start_time: toClock(event.start_time),
      end_date: toDay(event.date),
      end_time: toClock(event.time),
    },
  });
  const submitting = form.formState.isSubmitting;

  const onSubmit = async (values: EditEventValues) => {
    try {
      const imageId = values.event_image ? await uploadPhoto(values.event_image, "event") : undefined;
      await api.updateEvent(event.id, {
        event_name: values.event_name,
        description: values.description,
        start_date: format(values.start_date, "yyyy-MM-dd"),
        start_time: format(values.start_time, "HH:mm:ss"),
        date: format(values.end_date, "yyyy-MM-dd"),
        time: format(values.end_time, "HH:mm:ss"),
        price: values.price,
        capacity: values.capacity,
        location: values.location,
        event_category: values.event_category,
        event_image: imageId,
      });
      notifySuccess("Event updated", "Your changes are live.");
      router.push(eventHref);
      router.refresh();
    } catch (error) {
      if (!applyFieldErrors(error, form.setError, SERVER_FIELDS)) notifyApiError(error, "Couldn't save the event");
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex w-full flex-col gap-y-7 rounded-[24px] border border-[#EBEBEB] p-3 shadow-lg shadow-[#0000000A] md:p-10"
      >
        <FormField
          control={form.control}
          name="event_image"
          render={({ field }) => (
            <FormItem>
              <FormLabel className={LABEL}>Event image</FormLabel>
              <ImageDropzone value={field.value} onChange={field.onChange} disabled={submitting} currentImage={event.event_image} />
              <FormMessage />
            </FormItem>
          )}
        />
        <TextField control={form.control} name="event_name" label="Event name" labelClassName={LABEL} className="h-[56px] rounded-[12px] border-[#DEDEDE] text-[18px]" />
        <TextField control={form.control} name="description" label="Description" labelClassName={LABEL} className="h-[92px] rounded-[12px] border-[#DEDEDE] text-[16px]" />
        <div className="flex flex-col gap-y-3 rounded-[12px] border border-[#DEDEDE] p-3">
          <DateTimeRow label="Start" control={form.control} dateName="start_date" timeName="start_time" />
          <DateTimeRow label="End" control={form.control} dateName="end_date" timeName="end_time" />
        </div>
        <TextField control={form.control} name="location" label="Location" placeholder="Country, City, Address" labelClassName={LABEL} />
        <FormField
          control={form.control}
          name="event_category"
          render={({ field }) => (
            <FormItem>
              <FormLabel className={LABEL}>Event category</FormLabel>
              <Select onValueChange={field.onChange} value={field.value} disabled={submitting}>
                <FormControl>
                  <SelectTrigger className="h-[56px] border-[#EBEBEB]">
                    <SelectValue placeholder="Select event category" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-1 gap-7 sm:grid-cols-2">
          <TextField control={form.control} name="price" type="number" label="Price" labelClassName={LABEL} />
          <TextField control={form.control} name="capacity" type="number" label="Capacity" labelClassName={LABEL} />
        </div>

        <div className="grid w-full grid-cols-1 gap-3 sm:grid-cols-2">
          <Button asChild type="button" variant="brandOutline" size="xl" className="w-full">
            <Link href={eventHref}>Cancel</Link>
          </Button>
          <LoadingButton type="submit" variant="brand" size="xl" className="w-full" loading={submitting}>
            Save changes
          </LoadingButton>
        </div>
      </form>
    </Form>
  );
}
