export const STAMP_DUTY_RATES: Record<
  string,
  { rate: number; name: string; notes?: string }
> = {
  NSW: { rate: 0.09, name: "New South Wales", notes: "Class 1 general insurance" },
  VIC: {
    rate: 0.1,
    name: "Victoria",
    notes: "Non-business rate. Reducing 1% pa until 2033",
  },
  QLD: { rate: 0.09, name: "Queensland", notes: "Class 1 general insurance" },
  WA: { rate: 0.1, name: "Western Australia" },
  SA: { rate: 0.11, name: "South Australia" },
  TAS: { rate: 0.1, name: "Tasmania" },
  NT: { rate: 0.1, name: "Northern Territory" },
  ACT: {
    rate: 0,
    name: "Australian Capital Territory",
    notes: "No stamp duty on general insurance",
  },
};

export const GST_RATE = 0.1;
export const COMMISSION_RATE = 0.35;
export const PROFIT_SHARE = 0.5;

export function calculateInsuranceTaxes(grossPremium: number, state: string) {
  const gst = grossPremium * GST_RATE;
  const premiumIncGst = grossPremium + gst;
  const stampDutyRate = STAMP_DUTY_RATES[state]?.rate ?? 0;
  const stampDuty = premiumIncGst * stampDutyRate;
  const totalPayable = premiumIncGst + stampDuty;

  return {
    grossPremium,
    gst,
    premiumIncGst,
    stampDutyRate,
    stampDuty,
    totalPayable,
    state,
  };
}

export function calculateCommission(grossPremium: number) {
  const commission = grossPremium * COMMISSION_RATE;
  const netToUnderwriter = grossPremium - commission;
  return { commission, netToUnderwriter };
}
