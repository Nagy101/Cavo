import { z } from "zod";
import { isFutureOrTodayDate } from "@/lib/validations/booking";

export const eventInquirySchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(2, "Please enter your full name")
    .max(100),
  phone: z
    .string()
    .trim()
    .regex(/^[+\d\s()-]{8,20}$/, "Please enter a valid mobile number"),
  email: z
    .string()
    .trim()
    .email("Please enter a valid email address"),
  eventType: z.string().trim().min(2, "Select an event type"),
  preferredVenue: z.string().trim().min(2, "Select a preferred venue"),
  preferredDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Please select a preferred date")
    .refine(isFutureOrTodayDate, "Event date cannot be in the past"),
  preferredTime: z
    .string()
    .regex(/^\d{2}:\d{2}$/, "Please select a preferred time"),
  guestsCount: z
    .number({ error: "Enter estimated guest count" })
    .int()
    .min(2, "Minimum 2 guests")
    .max(300, "Maximum 300 guests per inquiry"),
  budgetRange: z.string().trim().max(120).optional().or(z.literal("")),
  setupPreferences: z.array(z.string()),
  additionalRequirements: z.string().trim().max(1000).optional().or(z.literal("")),
});

export type EventInquiryFormValues = z.infer<typeof eventInquirySchema>;
