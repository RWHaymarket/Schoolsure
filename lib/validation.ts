import { z } from "zod";

import { PRICING } from "@/lib/constants";

export const annualFeeSchema = z
  .number()
  .min(PRICING.MIN_ANNUAL_FEE)
  .max(PRICING.MAX_ANNUAL_FEE);

export const emailSchema = z.string().email();
