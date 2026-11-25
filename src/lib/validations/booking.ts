import { z } from "zod";

export const VENUE_SLUGS = [
  "main-restaurant",
  "boat",
  "private-yacht",
  "elite",
] as const;

export function getTodayCairoDateString(): string {
  return new Date().toLocaleDateString("en-CA", { timeZone: "Africa/Cairo" });
}

export function isFutureOrTodayDate(dateStr: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
    return false;
  }
  return dateStr >= getTodayCairoDateString();
}

export const bookingSchema = z.object({
  venue: z.enum(VENUE_SLUGS),
  date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Please choose a valid date")
    .refine(isFutureOrTodayDate, "Date cannot be in the past"),
  time: z
    .string()
    .regex(/^\d{2}:\d{2}$/, "Please choose a preferred time"),
  guests: z
    .number({ error: "Enter a valid guest count" })
    .int()
    .min(1, "Minimum 1 guest")
    .max(150, "For 150+ guests, please use the Private Events planner"),
  fullName: z
    .string()
    .trim()
    .min(2, "Please enter your full name")
    .max(100, "Name is too long"),
  phone: z
    .string()
    .trim()
    .regex(
      /^[+\d\s()-]{8,20}$/,
      "Please enter a valid mobile number (e.g. +20 1XX XXX XXXX)"
    ),
  email: z
    .string()
    .trim()
    .email("Please enter a valid email address")
    .optional()
    .or(z.literal("")),
  occasion: z.string().trim().max(80).optional(),
  seatingPreference: z.string().trim().max(80).optional(),
  specialRequests: z.string().trim().max(600).optional(),
});

export type BookingFormValues = z.infer<typeof bookingSchema>;
