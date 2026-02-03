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
  const baseProductA = Math.max(
    annualFee * PRICING.PRODUCT_A_RATE,
    PRICING.MIN_PRODUCT_A
  );
  const productAWithUpgrade = fullTermUpgrade
    ? baseProductA * (1 + PRICING.FULL_TERM_LOADING)
    : baseProductA;
  const productB = includeStudentCover ? annualFee * PRICING.PRODUCT_B_RATE : 0;
  const productC = includeExpensesCover ? PRICING.PRODUCT_C_FLAT : 0;
  const perChildTotal = productAWithUpgrade + productB + productC;

  const childCount = Math.max(children.length, 1);
  const childBreakdown = Array.from({ length: childCount }).map((_, index) => {
    const childName = children[index]?.firstName || `Child ${index + 1}`;
    const discount = index === 0 ? 0 : PRICING.MULTI_CHILD_DISCOUNT;
    const total = perChildTotal * (1 - discount);
    return {
      name: childName,
      school: schoolName,
      fee: annualFee,
      discount,
      total,
    };
  });

  const annualTotal = childBreakdown.reduce((sum, child) => sum + child.total, 0);
  const monthlyTotal = annualTotal / 12;
  const annualWithDiscount = annualTotal * (1 - PRICING.ANNUAL_DISCOUNT);
  const dailyEquivalent = annualTotal / 365;

  return {
    productA: baseProductA,
    productAWithUpgrade,
    productB,
    productC,
    perChildTotal,
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
