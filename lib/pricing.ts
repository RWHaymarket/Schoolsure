import { PRICING } from "./constants";

interface PremiumCalculation {
  annualFee: number;
  tier: "comprehensive" | "platinum";
  years: number;
  includeStudentCover: boolean;
  includeDepositsCover: boolean;
  childCount: number;
  paymentFrequency: "weekly" | "monthly" | "annual";
}

export function calculatePremium(params: PremiumCalculation) {
  const {
    annualFee,
    tier,
    years,
    includeStudentCover,
    includeDepositsCover,
    childCount,
    paymentFrequency,
  } = params;

  const rate =
    tier === "platinum" ? PRICING.PLATINUM_RATE : PRICING.COMPREHENSIVE_RATE;

  let basePremium = annualFee * rate;

  if (childCount > 1) {
    const firstChildPremium = basePremium;
    const additionalChildrenPremium =
      basePremium * (childCount - 1) * (1 - PRICING.MULTI_CHILD_DISCOUNT);
    basePremium = firstChildPremium + additionalChildrenPremium;
  }

  let addOns = 0;
  if (includeStudentCover) {
    addOns += PRICING.STUDENT_COVER_WEEKLY * 52;
  }
  if (includeDepositsCover) {
    addOns += PRICING.DEPOSITS_COVER_WEEKLY * 52;
  }

  let totalAnnual = basePremium + addOns;

  if (paymentFrequency === "annual") {
    totalAnnual = totalAnnual * (1 - PRICING.ANNUAL_DISCOUNT);
  }

  const weekly = totalAnnual / 52;
  const monthly = totalAnnual / 12;
  const annual = totalAnnual;

  const totalProtection = annualFee * years * childCount;

  return {
    weekly: Math.round(weekly * 100) / 100,
    monthly: Math.round(monthly * 100) / 100,
    annual: Math.round(annual * 100) / 100,
    totalProtection,
    savingsIfAnnual:
      paymentFrequency !== "annual"
        ? Math.round(totalAnnual * PRICING.ANNUAL_DISCOUNT * 100) / 100
        : 0,
  };
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-AU", {
    style: "currency",
    currency: "AUD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatCurrencyWithCents(amount: number): string {
  return new Intl.NumberFormat("en-AU", {
    style: "currency",
    currency: "AUD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}
