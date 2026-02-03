export const PRICING_CONFIG = {
  productA: {
    name: "Parent Continuity Cover",
    type: "core" as const,
    rate: 0.025,
    minimumPremium: 250,
    fullTermLoading: 0.15,
    waitingPeriodDays: 30,
    moratoriumYears: 5,
  },
  productB: {
    name: "Student Continuity Cover",
    type: "addon" as const,
    requiresProductA: true,
    rate: 0.01,
    minimumAbsenceThreshold: 0.25,
  },
  productC: {
    name: "Annual School Expenses Cover",
    type: "addon" as const,
    requiresProductA: true,
    flatRate: 50,
    maxBenefit: 2500,
    components: {
      booksAndStudyAids: 1000,
      schoolTransport: 1000,
      uniformCover: 500,
    },
  },
  productD: {
    name: "School Fee Placement Insurance",
    type: "standalone" as const,
    levels: {
      level1: {
        label: "Level 1",
        limit: 500,
        rate: 0.05,
        premium: 25,
        description: "Single school application",
      },
      level2: {
        label: "Level 2",
        limit: 2000,
        rate: 0.03,
        premium: 60,
        description: "Multiple school applications",
      },
      level3: {
        label: "Level 3",
        limit: 5000,
        rate: 0.025,
        premium: 125,
        description: "Boarding school or high-value placements",
      },
    },
  },
  discounts: {
    multiChild: 0.1,
    annualPayment: 0.1,
  },
  renewal: {
    annualLoading: 0.05,
  },
};

export type PricingConfig = typeof PRICING_CONFIG;
