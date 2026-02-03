import { z } from "zod";

import { PRICING } from "@/lib/constants";

export const annualFeeSchema = z
  .number()
  .min(PRICING.MIN_ANNUAL_FEE)
  .max(PRICING.MAX_ANNUAL_FEE);

export const emailSchema = z.string().email();

export const parentDetailsSchema = z.object({
  parentFirstName: z.string().min(2, "First name is required"),
  parentLastName: z.string().min(2, "Last name is required"),
  parentEmail: z.string().email("Please enter a valid email"),
  parentPhone: z.string().min(10, "Please enter a valid phone number"),
  parentDob: z.string().min(1, "Date of birth is required"),
});

export const childSchema = z.object({
  firstName: z.string().min(2, "Child's name is required"),
  dateOfBirth: z.string().min(1, "Date of birth is required"),
  yearLevel: z.string().min(1, "Year level is required"),
});
