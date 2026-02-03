export interface ChildPremiumBreakdown {
  childIndex: number;
  childName: string;
  schoolName: string;
  annualFee: number;
  productA: number;
  fullTermUpgradeAmount: number;
  productB: number;
  productC: number;
  subtotalBeforeDiscount: number;
  multiChildDiscount: number;
  childTotal: number;
}

export interface PremiumBreakdown {
  children: ChildPremiumBreakdown[];
  annualTotal: number;
  annualWithDiscount: number;
  monthlyTotal: number;
  dailyEquivalent: number;
  productsIncluded: {
    productA: true;
    fullTermUpgrade: boolean;
    productB: boolean;
    productC: boolean;
  };
}
