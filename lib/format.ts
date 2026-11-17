import { format, isValid, parse, parseISO } from "date-fns";

const EMPTY = "---";

function toDate(value: string | null | undefined): Date | null {
  if (!value) return null;
  const date = parseISO(value);
  return isValid(date) ? date : null;
}

function toTime(value: string | null | undefined): Date | null {
  if (!value) return null;
  const time = parse(value.slice(0, 8), "HH:mm:ss", new Date());
  return isValid(time) ? time : null;
}

export function shortDate(value: string | null | undefined) {
  const date = toDate(value);
  return date ? format(date, "EEE do MMM") : EMPTY;
}

export function fullDate(value: string | null | undefined) {
  const date = toDate(value);
  return date ? format(date, "EEEE, MMMM d, yyyy") : EMPTY;
}

export function longDate(value: string | null | undefined) {
  const date = toDate(value);
  return date ? format(date, "MMMM, do yyyy") : EMPTY;
}

export function clockTime(value: string | null | undefined) {
  const time = toTime(value);
  return time ? format(time, "h:mm a") : EMPTY;
}

export function price(value: number | null | undefined) {
  return value ? `$${value}` : "Free";
}

export function orDash(value: string | number | null | undefined) {
  return value === null || value === undefined || value === "" ? EMPTY : String(value);
}

export function initials(name: string | null | undefined) {
  if (!name) return "U";
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]!.toUpperCase())
    .join("");
}
