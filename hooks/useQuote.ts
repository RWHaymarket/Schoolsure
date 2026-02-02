import { create } from "zustand";

type QuoteState = {
  annualFee: number;
  childCount: number;
  setAnnualFee: (value: number) => void;
  setChildCount: (value: number) => void;
};

export const useQuote = create<QuoteState>((set) => ({
  annualFee: 35000,
  childCount: 1,
  setAnnualFee: (value) => set({ annualFee: value }),
  setChildCount: (value) => set({ childCount: value }),
}));
