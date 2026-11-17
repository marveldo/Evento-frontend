"use client";

import { useState } from "react";
import { format } from "date-fns";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LoadingButton } from "@/components/common/LoadingButton";
import { DateTimeRow } from "@/components/form/DateTimeFields";
import { ImageDropzone } from "@/components/form/ImageDropzone";
import { TextField } from "@/components/form/TextField";
import { EventCreated } from "@/components/events/create/EventCreated";
import { api } from "@/lib/api/client";
import { uploadPhoto } from "@/lib/api/photos";
import { EVENT_CATEGORIES } from "@/lib/categories";
import { applyFieldErrors } from "@/lib/forms";
import { DETAILS_STEP_FIELDS, eventSchema, type EventValues } from "@/lib/schemas/event";
import { notifyApiError, notifySuccess } from "@/lib/toast";

const STEP_PROGRESS = [30, 75, 100];
const SERVER_FIELDS = ["event_name", "description", "price", "location", "event_category", "capacity", "event_image"] as const;
const LABEL = "font-montserrat text-[16px] font-[600] md:text-[20px]";

export function EventForm() {
  const [step, setStep] = useState(0);
  const [eventLink, setEventLink] = useState<string | null>(null);
  const form = useForm<EventValues>({
    resolver: zodResolver(eventSchema),
    defaultValues: { event_name: "", description: "", location: "", event_category: "", price: 0, capacity: 0 },
  });
  const submitting = form.formState.isSubmitting;

  const next = async () => {
    if (await form.trigger([...DETAILS_STEP_FIELDS])) setStep(1);
  };

  const onSubmit = async (values: EventValues) => {
    try {
      const imageId = await uploadPhoto(values.event_image, "event");
      const event = await api.createEvent({
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
      notifySuccess("Event Created Successfully", "Next step: copy the link to invite people");
      setEventLink(event.event_link);
      setStep(2);
    } catch (error) {
      if (!applyFieldErrors(error, form.setError, SERVER_FIELDS)) notifyApiError(error, "Couldn't create the event");
    }
  };

  return (
    <>
      <div className="w-full">
        <p className="mb-5">Progress</p>
        <Progress className="h-[8px] w-full rounded-[8px] bg-[#EBEBEB]" value={STEP_PROGRESS[step]} />
      </div>

      {eventLink ? (
        <EventCreated link={eventLink} />
      ) : (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex w-full flex-col gap-y-7 overflow-x-hidden rounded-[24px] border border-[#EBEBEB] p-3 shadow-lg shadow-[#0000000A] md:p-10"
          >
            <motion.div key={step} className="flex flex-col gap-y-7" initial={{ x: step === 0 ? "-20%" : "20%", opacity: 0 }} animate={{ x: 0, opacity: 1 }}>
              {step === 0 ? (
                <>
                  <TextField control={form.control} name="event_name" placeholder="Event Name" className="h-[70px] rounded-[12px] border-[#DEDEDE] text-[20px] md:h-[148px] md:text-[32px]" />
                  <TextField control={form.control} name="description" placeholder="Description" className="h-[92px] rounded-[12px] border-[#DEDEDE] text-[16px] md:text-[20px]" />
                  <div className="flex flex-col gap-y-3 rounded-[12px] border border-[#DEDEDE] p-3">
                    <DateTimeRow label="Start" control={form.control} dateName="start_date" timeName="start_time" />
                    <DateTimeRow label="End" control={form.control} dateName="end_date" timeName="end_time" />
                  </div>
                  <TextField control={form.control} name="price" type="number" label="Price" labelClassName={LABEL} />
                  <TextField control={form.control} name="location" label="Location" placeholder="Country, City, Address" labelClassName={LABEL} />
                </>
              ) : (
                <>
                  <h2 className="font-montserrat text-[20px] font-[600] md:text-[32px]">Hey Pal, you&apos;re almost done!</h2>
                  <FormField
                    control={form.control}
                    name="event_image"
                    render={({ field }) => (
                      <FormItem>
                        <ImageDropzone value={field.value} onChange={field.onChange} disabled={submitting} />
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="event_category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className={LABEL}>Select event category</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value} disabled={submitting}>
                          <FormControl>
                            <SelectTrigger className="h-[56px] border-[#EBEBEB]">
                              <SelectValue placeholder="Select event category" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {EVENT_CATEGORIES.map((category) => (
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
                  <TextField control={form.control} name="capacity" type="number" label="Capacity" disabled={submitting} labelClassName={LABEL} />
                </>
              )}
            </motion.div>

            <div className="w-full space-y-3">
              {step === 0 ? (
                <Button type="button" variant="brand" size="xl" className="w-full" onClick={next}>
                  Next
                </Button>
              ) : (
                <>
                  <Button type="button" variant="brandOutline" size="xl" className="w-full" onClick={() => setStep(0)} disabled={submitting}>
                    Go Back
                  </Button>
                  <LoadingButton type="submit" variant="brand" size="xl" className="w-full" loading={submitting}>
                    Submit
                  </LoadingButton>
                </>
              )}
            </div>
          </form>
        </Form>
      )}
    </>
  );
}
