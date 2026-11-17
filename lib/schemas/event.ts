import { z } from "zod";
import { PHOTO_MAX_BYTES, PHOTO_TYPES } from "@/lib/api/photos";

export function combineDateTime(date: Date, time: Date) {
  const combined = new Date(date);
  combined.setHours(time.getHours(), time.getMinutes(), 0, 0);
  return combined;
}

export const imageFile = z
  .instanceof(File, { message: "Add an image" })
  .refine((file) => file.size <= PHOTO_MAX_BYTES, "The image must be 2 MB or smaller")
  .refine((file) => PHOTO_TYPES.includes(file.type), "Use a JPG, PNG or WebP image");

const eventFields = z.object({
    event_name: z.string().trim().min(1, "Give the event a name"),
    description: z.string().trim().min(1, "Describe the event"),
    start_date: z.date({ required_error: "Pick a start date" }),
    start_time: z.date({ required_error: "Pick a start time" }),
    end_date: z.date({ required_error: "Pick an end date" }),
    end_time: z.date({ required_error: "Pick an end time" }),
    price: z.coerce.number().min(0, "Price can't be negative"),
    location: z.string().trim().min(5, "Enter the full location"),
    event_category: z.string().min(1, "Pick a category"),
    capacity: z.coerce.number().int().min(1, "At least 1 person"),
});

function endsAfterStart(v: { start_date: Date; start_time: Date; end_date: Date; end_time: Date }) {
  return combineDateTime(v.end_date, v.end_time) > combineDateTime(v.start_date, v.start_time);
}
const END_AFTER_START = { path: ["end_time"], message: "The event must end after it starts" };

export const eventSchema = eventFields
  .extend({ event_image: imageFile })
  .refine((v) => combineDateTime(v.start_date, v.start_time) > new Date(), {
    path: ["start_time"],
    message: "The event must start in the future",
  })
  .refine(endsAfterStart, END_AFTER_START);

export type EventValues = z.infer<typeof eventSchema>;

// Editing: a new image is optional (none keeps the current one), and the start may already be in
// the past, so the host can still fix details of an event that has begun.
export const editEventSchema = eventFields.extend({ event_image: imageFile.optional() }).refine(endsAfterStart, END_AFTER_START);

export type EditEventValues = z.infer<typeof editEventSchema>;

export const DETAILS_STEP_FIELDS = ["event_name", "description", "start_date", "start_time", "end_date", "end_time", "price", "location"] as const;
