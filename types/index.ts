export interface School {
  id: string;
  name: string;
  suburb: string;
  sector: string;
}

export type ProductType =
  | "parentContinuity"
  | "studentContinuity"
  | "schoolExpenses"
  | "placementInsurance";

export type CoverageOptions = {
  fullTermUpgrade: boolean;
  includeStudentCover: boolean;
  includeExpensesCover: boolean;
};

export type { ChildPremiumBreakdown, PremiumBreakdown } from "./premium";
