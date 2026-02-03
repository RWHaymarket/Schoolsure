import { PRICING } from "./constants";

export interface PremiumBreakdown {
  productA: number;
  productAWithUpgrade: number;
  productB: number;
  productC: number;
  perChildTotal: number;
  children: Array<{
    name: string;
    school: string;
    fee: number;
    discount: number;
    total: number;
  }>;
  annualTotal: number;
  monthlyTotal: number;
  annualWithDiscount: number;
  dailyEquivalent: number;
}

interface BreakdownParams {
  annualFee: number;
  includeStudentCover: boolean;
  includeExpensesCover: boolean;
  fullTermUpgrade: boolean;
  children: Array<{ firstName: string }>;
  schoolName: string;
}

export function calculatePremiumBreakdown({
  annualFee,
  includeStudentCover,
  includeExpensesCover,
  fullTermUpgrade,
  children,
  schoolName,
}: BreakdownParams): PremiumBreakdown {
  const childCount = Math.max(children.length, 1);
  const childBreakdown = Array.from({ length: childCount }).map((_, index) => {
    const childName = children[index]?.firstName || `Child ${index + 1}`;
    return {
      name: childName,
      school: schoolName,
      fee: annualFee,
      discount: index === 0 ? 0 : PRICING.MULTI_CHILD_DISCOUNT,
      total: 0,
    };
  });

  const annualTotal = 0;
  const monthlyTotal = 0;
  const annualWithDiscount = 0;
  const dailyEquivalent = 0;

  return {
    productA: 0,
    productAWithUpgrade: 0,
    productB: includeStudentCover ? 0 : 0,
    productC: includeExpensesCover ? 0 : 0,
    perChildTotal: 0,
    children: childBreakdown,
    annualTotal,
    monthlyTotal,
    annualWithDiscount,
    dailyEquivalent,
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
