import { z } from "zod";

const PHONE_RE = /^[\+\d\s\-\(\)\.]{7,30}$/;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const bookingSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(1, "Full name is required")
    .max(100, "Full name is too long"),
  email: z
    .string()
    .trim()
    .regex(EMAIL_RE, "Invalid email address")
    .max(254, "Email is too long"),
  phone: z
    .string()
    .trim()
    .regex(PHONE_RE, "Invalid phone number")
    .max(30, "Phone number is too long"),
  socialHandle: z.string().trim().max(100).nullable().optional(),
  companyName: z.string().trim().max(200).nullable().optional(),
  service: z.string().trim().min(1, "Service is required").max(200),
  budget: z.string().trim().max(50).nullable().optional(),
  packageName: z.string().trim().max(200).nullable().optional(),
  packagePrice: z.string().trim().max(50).nullable().optional(),
  packageDeposit: z.string().trim().max(50).nullable().optional(),
  message: z
    .string()
    .trim()
    .min(1, "Message is required")
    .max(5000, "Message is too long"),
  timezone: z.string().trim().max(100).nullable().optional(),
  referralSource: z.string().trim().max(200).nullable().optional(),
  website: z.string().max(0, "Spam detected").optional(),
});

export type BookingInput = z.infer<typeof bookingSchema>;
