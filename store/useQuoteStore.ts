import { create } from "zustand";
import { persist } from "zustand/middleware";

import { PRICING_CONFIG } from "@/lib/pricing-config";
import type { PremiumBreakdown } from "@/types/premium";

interface Child {
  firstName: string;
  lastName?: string;
  dateOfBirth: string;
  gender?: string;
  yearLevel: string;
  schoolName?: string;
  annualFee?: number;
}

interface QuoteState {
  schoolId: string;
  schoolName: string;
  schoolSuburb: string;
  schoolPostcode: string;
  schoolState: string;
  schoolSector: "Independent" | "Catholic" | "";
  annualFees: number;
  yearLevel: string;

  fullTermUpgrade: boolean;
  includeStudentCover: boolean;
  includeExpensesCover: boolean;
  coverageYears: number;

  parentFirstName: string;
  parentLastName: string;
  parentEmail: string;
  parentPhone: string;
  parentDob: string;
  parentTitle: string;
  parentPostcode: string;
  children: Child[];

  quoteReference: string;
  premiumBreakdown: PremiumBreakdown;

  setSchoolDetails: (data: Partial<QuoteState>) => void;
  setCoverageDetails: (data: Partial<QuoteState>) => void;
  setFullTermUpgrade: (value: boolean) => void;
  setIncludeStudentCover: (value: boolean) => void;
  setIncludeExpensesCover: (value: boolean) => void;
  setParentDetails: (data: Partial<QuoteState>) => void;
  addChild: (child: Child) => void;
  removeChild: (index: number) => void;
  resetQuote: () => void;
  generateQuoteRef: () => void;
}

const round2 = (value: number) => Math.round(value * 100) / 100;

export const calculatePremium = (state: {
  annualFees: number;
  includeStudentCover: boolean;
  includeExpensesCover: boolean;
  fullTermUpgrade: boolean;
  children: Child[];
  schoolName: string;
}): PremiumBreakdown => {
  const annualFee = state.annualFees || 0;
  const childCount = Math.max(state.children.length, 1);

  const children = Array.from({ length: childCount }).map((_, index) => {
    let productA = annualFee * PRICING_CONFIG.productA.rate;
    if (productA < PRICING_CONFIG.productA.minimumPremium) {
      productA = PRICING_CONFIG.productA.minimumPremium;
    }

    let fullTermUpgradeAmount = 0;
    if (state.fullTermUpgrade) {
      fullTermUpgradeAmount = productA * PRICING_CONFIG.productA.fullTermLoading;
      productA = productA + fullTermUpgradeAmount;
    }

    let productB = 0;
    if (state.includeStudentCover) {
      productB = annualFee * PRICING_CONFIG.productB.rate;
    }

    let productC = 0;
    if (state.includeExpensesCover) {
      productC = PRICING_CONFIG.productC.flatRate;
    }

    const subtotalBeforeDiscount = productA + productB + productC;
    let multiChildDiscount = 0;
    if (index > 0) {
      multiChildDiscount =
        subtotalBeforeDiscount * PRICING_CONFIG.discounts.multiChild;
    }

    const childTotal = subtotalBeforeDiscount - multiChildDiscount;

    return {
      childIndex: index,
      childName: state.children[index]?.firstName || `Child ${index + 1}`,
      schoolName: state.schoolName,
      annualFee,
      productA: round2(productA),
      fullTermUpgradeAmount: round2(fullTermUpgradeAmount),
      productB: round2(productB),
      productC: round2(productC),
      subtotalBeforeDiscount: round2(subtotalBeforeDiscount),
      multiChildDiscount: round2(multiChildDiscount),
      childTotal: round2(childTotal),
    };
  });

  const annualTotal = round2(
    children.reduce((sum, child) => sum + child.childTotal, 0)
  );
  const annualWithDiscount = round2(
    annualTotal * (1 - PRICING_CONFIG.discounts.annualPayment)
  );
  const monthlyTotal = round2(annualTotal / 12);
  const dailyEquivalent = round2(annualTotal / 365);

  return {
    children,
    annualTotal,
    annualWithDiscount,
    monthlyTotal,
    dailyEquivalent,
    productsIncluded: {
      productA: true,
      fullTermUpgrade: state.fullTermUpgrade,
      productB: state.includeStudentCover,
      productC: state.includeExpensesCover,
    },
  };
};

const buildBreakdown = (state: {
  annualFees: number;
  includeStudentCover: boolean;
  includeExpensesCover: boolean;
  fullTermUpgrade: boolean;
  children: Child[];
  schoolName: string;
}) => calculatePremium(state);

const initialState = {
  schoolId: "",
  schoolName: "",
  schoolSuburb: "",
  schoolPostcode: "",
  schoolState: "",
  schoolSector: "" as const,
  annualFees: 0,
  yearLevel: "",
  fullTermUpgrade: false,
  includeStudentCover: false,
  includeExpensesCover: false,
  coverageYears: 6,
  parentFirstName: "",
  parentLastName: "",
  parentEmail: "",
  parentPhone: "",
  parentDob: "",
  parentTitle: "",
  parentPostcode: "",
  children: [],
  quoteReference: "",
  premiumBreakdown: calculatePremium({
    annualFees: 0,
    includeStudentCover: false,
    includeExpensesCover: false,
    fullTermUpgrade: false,
    children: [],
    schoolName: "",
  }),
};

export const useQuoteStore = create<QuoteState>()(
  persist(
    (set, get) => ({
      ...initialState,
      setSchoolDetails: (data) =>
        set((state) => {
          const next = { ...state, ...data };
          return {
            ...next,
            premiumBreakdown: buildBreakdown(next),
          };
        }),
      setCoverageDetails: (data) =>
        set((state) => {
          const next = { ...state, ...data };
          return {
            ...next,
            premiumBreakdown: buildBreakdown(next),
          };
        }),
      setFullTermUpgrade: (value) =>
        set((state) => {
          const next = { ...state, fullTermUpgrade: value };
          return {
            ...next,
            premiumBreakdown: buildBreakdown(next),
          };
        }),
      setIncludeStudentCover: (value) =>
        set((state) => {
          const next = { ...state, includeStudentCover: value };
          return {
            ...next,
            premiumBreakdown: buildBreakdown(next),
          };
        }),
      setIncludeExpensesCover: (value) =>
        set((state) => {
          const next = { ...state, includeExpensesCover: value };
          return {
            ...next,
            premiumBreakdown: buildBreakdown(next),
          };
        }),
      setParentDetails: (data) =>
        set((state) => {
          const next = { ...state, ...data };
          return {
            ...next,
            premiumBreakdown: buildBreakdown(next),
          };
        }),
      addChild: (child) =>
        set((state) => {
          const nextChildren = [...state.children, child];
          const next = { ...state, children: nextChildren };
          return {
            ...next,
            premiumBreakdown: buildBreakdown(next),
          };
        }),
      removeChild: (index) =>
        set((state) => {
          const nextChildren = state.children.filter((_, i) => i !== index);
          const next = { ...state, children: nextChildren };
          return {
            ...next,
            premiumBreakdown: buildBreakdown(next),
          };
        }),
      resetQuote: () => set(initialState),
      generateQuoteRef: () =>
        set({
          quoteReference: `QT-2026-${Math.random()
            .toString(36)
            .slice(2, 8)
            .toUpperCase()}`,
        }),
    }),
    {
      name: "schoolsure-quote",
    }
  )
);

export type { Child };
