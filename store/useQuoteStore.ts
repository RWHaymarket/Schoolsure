import { create } from "zustand";
import { persist } from "zustand/middleware";

import { calculatePremiumBreakdown, type PremiumBreakdown } from "@/lib/pricing";

interface Child {
  firstName: string;
  dateOfBirth: string;
  yearLevel: string;
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
  children: Child[];

  quoteReference: string;
  premiumBreakdown: PremiumBreakdown;

  setSchoolDetails: (data: Partial<QuoteState>) => void;
  setCoverageDetails: (data: Partial<QuoteState>) => void;
  setParentDetails: (data: Partial<QuoteState>) => void;
  addChild: (child: Child) => void;
  removeChild: (index: number) => void;
  resetQuote: () => void;
  generateQuoteRef: () => void;
}

const buildBreakdown = (state: {
  annualFees: number;
  includeStudentCover: boolean;
  includeExpensesCover: boolean;
  fullTermUpgrade: boolean;
  children: Child[];
  schoolName: string;
}) =>
  calculatePremiumBreakdown({
    annualFee: state.annualFees || 0,
    includeStudentCover: state.includeStudentCover,
    includeExpensesCover: state.includeExpensesCover,
    fullTermUpgrade: state.fullTermUpgrade,
    children: state.children,
    schoolName: state.schoolName,
  });

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
  children: [],
  quoteReference: "",
  premiumBreakdown: calculatePremiumBreakdown({
    annualFee: 0,
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
