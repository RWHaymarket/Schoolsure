import { PRICING_CONFIG } from "@/lib/pricing-config";
import { calculateCommission, calculateInsuranceTaxes } from "@/lib/insurance-tax";

export type QuoteStatus = "converted" | "pending" | "abandoned" | "expired";
export type QuoteSource =
  | "direct"
  | "google_ads"
  | "google_organic"
  | "facebook"
  | "instagram"
  | "referral"
  | "school_partner"
  | "edstart";

export type Quote = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  status: QuoteStatus;
  parent: {
    firstName: string;
    lastName: string;
    email: string;
    mobile: string;
    postcode: string;
    state: string;
  };
  children: Array<{
    firstName: string;
    lastName: string;
    school: string;
    suburb: string;
    state: string;
    annualFee: number;
    yearLevel: string;
  }>;
  products: {
    parentCover: boolean;
    fullTermUpgrade: boolean;
    studentCover: boolean;
    expensesCover: boolean;
  };
  premiumCalculation: {
    grossAnnual: number;
    gst: number;
    stampDuty: number;
    stampDutyRate: number;
    totalPayable: number;
  };
  paymentFrequency: "monthly" | "annual";
  convertedAt?: Date;
  policyId?: string;
  abandonedAt?: Date;
  source: QuoteSource;
};

export type Policy = {
  id: string;
  quoteId: string;
  status: "active" | "pending_payment" | "lapsed" | "cancelled";
  startDate: Date;
  renewalDate: Date;
  parent: Quote["parent"];
  children: Quote["children"];
  products: Quote["products"];
  premiums: {
    grossAnnual: number;
    gst: number;
    stampDuty: number;
    stampDutyRate: number;
    totalPayable: number;
    commission: number;
    nicheShare: number;
    archShare: number;
  };
  paymentFrequency: "monthly" | "annual";
  paymentMethod: {
    type: "visa" | "mastercard" | "amex";
    last4: string;
    expiry: string;
  };
  payments: Array<{
    date: Date;
    amount: number;
    status: "paid" | "failed" | "refunded";
    method: string;
  }>;
  claims: Array<{
    id: string;
    type: "temporary_disablement" | "critical_illness";
    status: "submitted" | "under_review" | "approved" | "paid" | "declined";
    submittedAt: Date;
    amount: number;
    childName: string;
  }>;
};

export type Placement = {
  id: string;
  level: 1 | 2 | 3;
  premium: 25 | 60 | 125;
  parent: { firstName: string; lastName: string; email: string; state: string };
  school: string;
  depositAmount: number;
  purchaseDate: Date;
  status: "active" | "expired" | "claimed";
  source: QuoteSource;
};

export type Amendment = {
  id: string;
  policyId: string;
  type:
    | "add_child"
    | "remove_child"
    | "add_product"
    | "upgrade_full_term"
    | "change_school"
    | "update_fee"
    | "change_payment_frequency";
  description: string;
  effectiveDate: Date;
  premiumImpact: number;
  processedBy: "system" | "admin";
  createdAt: Date;
};

export type Renewal = {
  id: string;
  policyId: string;
  previousPremium: number;
  newPremium: number;
  feeIncrease: number;
  status: "renewed" | "pending" | "declined";
  renewalDate: Date;
  processedAt?: Date;
};

export type ActivityItem = {
  id: string;
  date: Date;
  tone: "success" | "info" | "accent" | "warning" | "error";
  description: string;
  href?: string;
};

const ALL_TIME_START = new Date(2026, 2, 1);
const ALL_TIME_END = new Date(2027, 7, 31);

const femaleNames = [
  "Catherine",
  "Sarah",
  "Emma",
  "Jessica",
  "Rachel",
  "Priya",
  "Li",
  "Mei",
  "Hannah",
  "Rebecca",
  "Nicole",
  "Amanda",
  "Sophia",
  "Olivia",
  "Charlotte",
  "Georgia",
  "Anna",
  "Lucy",
  "Natasha",
  "Yuki",
];
const maleNames = [
  "James",
  "Michael",
  "David",
  "Andrew",
  "Daniel",
  "William",
  "Thomas",
  "Robert",
  "Christopher",
  "Benjamin",
  "Matthew",
  "Raj",
  "Wei",
  "Sam",
  "Peter",
  "Luke",
  "Oliver",
  "Jack",
  "Henry",
  "Oscar",
];
const surnames = [
  "Mitchell",
  "Chen",
  "Williams",
  "Patel",
  "Thompson",
  "O'Brien",
  "Kim",
  "Nguyen",
  "Brown",
  "Taylor",
  "Anderson",
  "Kumar",
  "Zhang",
  "Wilson",
  "Harris",
  "Martin",
  "Lee",
  "White",
  "Clark",
  "Walker",
  "Singh",
  "Morrison",
  "Campbell",
  "Stewart",
  "Adams",
  "Baker",
  "Bell",
  "Fraser",
  "Gordon",
  "Hamilton",
  "Hughes",
  "Jones",
  "Kelly",
  "Marshall",
  "Murray",
  "Nelson",
  "Parker",
  "Reid",
  "Robertson",
  "Scott",
  "Turner",
  "Walsh",
  "Young",
  "Burke",
  "Cooper",
  "Dixon",
  "Edwards",
];

const schoolsByState: Record<string, string[]> = {
  NSW: [
    "Sydney Grammar School",
    "SCEGGS Darlinghurst",
    "Cranbrook School",
    "Newington College",
    "Ascham School",
    "Knox Grammar",
    "Pymble Ladies College",
    "The Kings School",
    "Barker College",
    "Ravenswood",
    "Trinity Grammar",
    "Redlands",
    "St Andrews Cathedral",
    "Meriden",
    "Abbotsleigh",
  ],
  VIC: [
    "Melbourne Grammar",
    "Scotch College",
    "Methodist Ladies College",
    "Geelong Grammar",
    "Haileybury",
    "Caulfield Grammar",
    "Xavier College",
    "Firbank Grammar",
    "Carey Baptist",
    "Trinity Grammar Melbourne",
  ],
  QLD: [
    "Brisbane Grammar",
    "Somerville House",
    "St Peters Lutheran",
    "Brisbane Boys College",
    "Ipswich Grammar",
    "Anglican Church Grammar",
    "St Margaret's",
  ],
  WA: [
    "Hale School",
    "Presbyterian Ladies College Perth",
    "Christ Church Grammar",
    "Scotch College Perth",
    "St Hilda's",
  ],
  SA: ["St Peters College Adelaide", "Wilderness School", "Scotch College Adelaide"],
  TAS: ["The Hutchins School", "Fahan School"],
  NT: ["St Philip's College"],
  ACT: ["Canberra Grammar"],
};

const suburbsByState: Record<string, string[]> = {
  NSW: ["Darlinghurst", "Point Piper", "Croydon", "Parramatta", "Pymble"],
  VIC: ["South Yarra", "Hawthorn", "Toorak", "Brighton", "Kew"],
  QLD: ["Toowong", "Ascot", "St Lucia", "Clayfield", "Indooroopilly"],
  WA: ["Claremont", "Peppermint Grove", "Cottesloe", "Nedlands"],
  SA: ["College Park", "Mitcham", "Glenelg"],
  TAS: ["Sandy Bay", "Battery Point"],
  NT: ["Darwin City"],
  ACT: ["Yarralumla"],
};

const postcodesByState: Record<string, string[]> = {
  NSW: ["2000", "2024", "2030", "2065", "2093"],
  VIC: ["3000", "3121", "3163", "3182", "3205"],
  QLD: ["4000", "4067", "4101", "4171", "4217"],
  WA: ["6000", "6010", "6100", "6151", "6160"],
  SA: ["5000", "5061", "5081"],
  TAS: ["7000", "7050"],
  NT: ["0800", "0810"],
  ACT: ["2600", "2601"],
};

const yearLevels = ["Prep", ...Array.from({ length: 12 }, (_, i) => `Year ${i + 1}`)];

const statesByShare = [
  ...Array(38).fill("NSW"),
  ...Array(24).fill("VIC"),
  ...Array(16).fill("QLD"),
  ...Array(10).fill("WA"),
  ...Array(5).fill("SA"),
  ...Array(3).fill("TAS"),
  ...Array(2).fill("NT"),
  ...Array(2).fill("ACT"),
];

const sourcesByShare: QuoteSource[] = [
  ...Array(30).fill("google_ads"),
  ...Array(20).fill("google_organic"),
  ...Array(15).fill("direct"),
  ...Array(12).fill("facebook"),
  ...Array(8).fill("instagram"),
  ...Array(8).fill("referral"),
  ...Array(5).fill("school_partner"),
  ...Array(2).fill("edstart"),
];

const paymentMethodsByShare = [
  ...Array(50).fill("visa"),
  ...Array(35).fill("mastercard"),
  ...Array(15).fill("amex"),
];

function createSeededRandom(seed: number) {
  let value = seed % 2147483647;
  if (value <= 0) value += 2147483646;
  return () => {
    value = (value * 16807) % 2147483647;
    return (value - 1) / 2147483646;
  };
}

function pick<T>(rand: () => number, list: T[]) {
  return list[Math.floor(rand() * list.length)];
}

function shuffle<T>(list: T[], seed: number) {
  const rand = createSeededRandom(seed);
  const copy = [...list];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(rand() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function buildPool<T extends string>(total: number, ratios: Record<T, number>) {
  const entries = Object.entries(ratios) as Array<[T, number]>;
  const counts = entries.map(([key, ratio]) => [key, Math.round(total * ratio)] as const);
  let sum = counts.reduce((acc, [, count]) => acc + count, 0);
  while (sum < total) {
    counts.sort((a, b) => b[1] - a[1]);
    counts[0][1] += 1;
    sum += 1;
  }
  while (sum > total) {
    counts.sort((a, b) => b[1] - a[1]);
    if (counts[0][1] > 1) {
      counts[0][1] -= 1;
      sum -= 1;
    } else {
      break;
    }
  }
  return counts.flatMap(([key, count]) => Array(count).fill(key));
}

function getMonthsBetween(start: Date, end: Date) {
  const months: Array<{ year: number; month: number; label: string }> = [];
  const current = new Date(start.getFullYear(), start.getMonth(), 1);
  while (current <= end) {
    months.push({
      year: current.getFullYear(),
      month: current.getMonth(),
      label: current.toLocaleDateString("en-AU", { month: "short", year: "2-digit" }),
    });
    current.setMonth(current.getMonth() + 1);
  }
  return months;
}

function buildMonthlyTargets(total: number, months: Array<{ year: number; month: number }>) {
  const weights = months.map(({ year, month }) => {
    const isYearOne = year === 2026;
    if (isYearOne && month >= 2 && month <= 4) return 0.7;
    if (isYearOne && month >= 5 && month <= 10) return 1.0;
    if ((isYearOne && month === 11) || (!isYearOne && month <= 1)) return 1.35;
    return 1.05;
  });
  const totalWeight = weights.reduce((sum, w) => sum + w, 0);
  const counts = weights.map((weight) => Math.max(1, Math.round((weight / totalWeight) * total)));
  let difference = total - counts.reduce((sum, count) => sum + count, 0);
  let index = 0;
  while (difference !== 0) {
    const direction = difference > 0 ? 1 : -1;
    if (direction < 0 && counts[index] <= 1) {
      index = (index + 1) % counts.length;
      continue;
    }
    counts[index] += direction;
    difference -= direction;
    index = (index + 1) % counts.length;
  }
  return counts;
}

function formatId(prefix: string, number: number) {
  return `${prefix}-${String(number).padStart(6, "0")}`;
}

function formatPhone(rand: () => number) {
  const prefix = "04";
  const middle = String(Math.floor(rand() * 900) + 100);
  const end = String(Math.floor(rand() * 900) + 100);
  const start = String(Math.floor(rand() * 90) + 10);
  return `${prefix}${start} ${middle} ${end}`;
}

function formatExpiry(rand: () => number) {
  const month = String(Math.floor(rand() * 12) + 1).padStart(2, "0");
  const year = String(Math.floor(rand() * 3) + 27);
  return `${month}/${year}`;
}

function calculateGrossPremium({
  totalFee,
  childCount,
  products,
  paymentFrequency,
}: {
  totalFee: number;
  childCount: number;
  products: Quote["products"];
  paymentFrequency: "monthly" | "annual";
}) {
  let premium = Math.max(
    totalFee * PRICING_CONFIG.productA.rate,
    PRICING_CONFIG.productA.minimumPremium
  );
  if (products.fullTermUpgrade) {
    premium *= 1 + PRICING_CONFIG.productA.fullTermLoading;
  }
  if (products.studentCover) {
    premium += totalFee * PRICING_CONFIG.productB.rate;
  }
  if (products.expensesCover) {
    premium += PRICING_CONFIG.productC.flatRate * childCount;
  }
  if (childCount > 1) {
    premium *= 1 - PRICING_CONFIG.discounts.multiChild;
  }
  if (paymentFrequency === "annual") {
    premium *= 1 - PRICING_CONFIG.discounts.annualPayment;
  }
  return Math.round(premium);
}

const months = getMonthsBetween(ALL_TIME_START, ALL_TIME_END);
const monthlyTargets = buildMonthlyTargets(150, months);

const statusPool = shuffle(
  buildPool(150, {
    converted: 0.55,
    pending: 0.15,
    abandoned: 0.18,
    expired: 0.12,
  }),
  11
);

const statePool = shuffle(statesByShare, 29);
const sourcePool = shuffle(sourcesByShare, 51);

export const quotes: Quote[] = months.flatMap((month, monthIndex) => {
  const count = monthlyTargets[monthIndex];
  return Array.from({ length: count }).map((_, localIndex) => {
    const index = monthIndex * 20 + localIndex;
    const rand = createSeededRandom(index + 100);
    const genderChoice = rand() > 0.5;
    const firstName = genderChoice ? pick(rand, femaleNames) : pick(rand, maleNames);
    const lastName = pick(rand, surnames);
    const state = statePool[index % statePool.length];
    const schoolOptions = schoolsByState[state] ?? schoolsByState.NSW;
    const suburbOptions = suburbsByState[state] ?? suburbsByState.NSW;
    const childCount = rand() > 0.7 ? 2 : 1;
    const children = Array.from({ length: childCount }).map((__, childIndex) => ({
      firstName: pick(rand, [...femaleNames, ...maleNames]),
      lastName,
      school: schoolOptions[(index + childIndex) % schoolOptions.length],
      suburb: suburbOptions[(index + childIndex) % suburbOptions.length],
      state,
      annualFee: Math.round(8000 + Math.pow(rand(), 0.75) * 37000),
      yearLevel: yearLevels[(index + childIndex) % yearLevels.length],
    }));
    const createdAt = new Date(
      month.year,
      month.month,
      Math.floor(rand() * 26) + 1,
      Math.floor(rand() * 8) + 8,
      Math.floor(rand() * 60)
    );
    const updatedAt = new Date(createdAt.getTime() + Math.floor(rand() * 6) * 86400000);
    const paymentFrequency = rand() > 0.65 ? "annual" : "monthly";
    const products = {
      parentCover: true,
      fullTermUpgrade: rand() < 0.55,
      studentCover: rand() < 0.4,
      expensesCover: rand() < 0.6,
    };
    const totalFee = children.reduce((sum, child) => sum + child.annualFee, 0);
    const grossAnnual = calculateGrossPremium({
      totalFee,
      childCount,
      products,
      paymentFrequency,
    });
    const taxes = calculateInsuranceTaxes(grossAnnual, state);
    const status = statusPool[index % statusPool.length];
    const convertedAt =
      status === "converted"
        ? new Date(createdAt.getTime() + (Math.floor(rand() * 4) + 1) * 86400000)
        : undefined;
    const abandonedAt =
      status === "abandoned"
        ? new Date(createdAt.getTime() + (Math.floor(rand() * 3) + 1) * 86400000)
        : undefined;

    return {
      id: formatId("QT", index + 1),
      createdAt,
      updatedAt,
      status,
      parent: {
        firstName,
        lastName,
        email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@email.com`,
        mobile: formatPhone(rand),
        postcode: pick(rand, postcodesByState[state] ?? postcodesByState.NSW),
        state,
      },
      children,
      products,
      premiumCalculation: {
        grossAnnual,
        gst: Math.round(taxes.gst),
        stampDuty: Math.round(taxes.stampDuty),
        stampDutyRate: taxes.stampDutyRate,
        totalPayable: Math.round(taxes.totalPayable),
      },
      paymentFrequency,
      convertedAt,
      abandonedAt,
      source: sourcePool[index % sourcePool.length],
    };
  });
});

const convertedQuotes = quotes.filter((quote) => quote.status === "converted");

const policyStatusPool = shuffle(
  buildPool(convertedQuotes.length, {
    active: 0.88,
    pending_payment: 0.05,
    lapsed: 0.04,
    cancelled: 0.03,
  }),
  77
);

export const policies: Policy[] = convertedQuotes.map((quote, index) => {
  const rand = createSeededRandom(index + 600);
  const startDate = quote.convertedAt ?? quote.createdAt;
  const renewalDate = new Date(startDate);
  renewalDate.setFullYear(startDate.getFullYear() + 1);
  if (startDate.getFullYear() === 2026 && startDate.getMonth() <= 7 && index % 4 === 0) {
    renewalDate.setFullYear(renewalDate.getFullYear() + 1);
  }
  const status = policyStatusPool[index % policyStatusPool.length];
  const paymentFrequency = quote.paymentFrequency;
  const taxes = calculateInsuranceTaxes(quote.premiumCalculation.grossAnnual, quote.parent.state);
  const commission = calculateCommission(quote.premiumCalculation.grossAnnual);
  const method = paymentMethodsByShare[index % paymentMethodsByShare.length];
  const paymentAmount =
    paymentFrequency === "annual"
      ? Math.round(taxes.totalPayable)
      : Math.round(taxes.totalPayable / 12);
  const payments: Policy["payments"] = [];
  if (paymentFrequency === "annual") {
    payments.push({
      date: new Date(startDate.getTime() + 2 * 86400000),
      amount: paymentAmount,
      status: "paid",
      method,
    });
    if (rand() > 0.7) {
      payments.push({
        date: new Date(startDate.getTime() + 200 * 86400000),
        amount: paymentAmount,
        status: "paid",
        method,
      });
    }
  } else {
    const monthsSince =
      (ALL_TIME_END.getFullYear() - startDate.getFullYear()) * 12 +
      (ALL_TIME_END.getMonth() - startDate.getMonth()) +
      1;
    const paymentCount = Math.max(1, monthsSince);
    for (let i = 0; i < paymentCount; i += 1) {
      payments.push({
        date: new Date(startDate.getTime() + (i + 1) * 30 * 86400000),
        amount: paymentAmount,
        status: "paid",
        method,
      });
    }
    if (rand() < 0.03) {
      payments[0] = { ...payments[0], status: "failed" };
      payments.splice(1, 0, {
        date: new Date(payments[0].date.getTime() + 3 * 86400000),
        amount: paymentAmount,
        status: "paid",
        method,
      });
    }
    if (rand() > 0.985) {
      payments[payments.length - 1] = {
        ...payments[payments.length - 1],
        status: "refunded",
      };
    }
  }

  const policyId = formatId("SS", 100001 + index);
  quote.policyId = policyId;

  return {
    id: policyId,
    quoteId: quote.id,
    status,
    startDate,
    renewalDate,
    parent: quote.parent,
    children: quote.children,
    products: quote.products,
    premiums: {
      grossAnnual: quote.premiumCalculation.grossAnnual,
      gst: Math.round(taxes.gst),
      stampDuty: Math.round(taxes.stampDuty),
      stampDutyRate: taxes.stampDutyRate,
      totalPayable: Math.round(taxes.totalPayable),
      commission: Math.round(commission.commission),
      nicheShare: Math.round(commission.commission),
      archShare: Math.round(commission.netToUnderwriter),
    },
    paymentFrequency,
    paymentMethod: {
      type: method,
      last4: String(1000 + Math.floor(rand() * 8999)),
      expiry: formatExpiry(rand),
    },
    payments,
    claims: [],
  };
});

const claimsPool = [
  {
    id: formatId("CL", 1),
    type: "critical_illness" as const,
    status: "paid" as const,
    amount: 5200,
    offsetDays: 120,
  },
  {
    id: formatId("CL", 2),
    type: "temporary_disablement" as const,
    status: "under_review" as const,
    amount: 1800,
    offsetDays: 60,
  },
  {
    id: formatId("CL", 3),
    type: "temporary_disablement" as const,
    status: "submitted" as const,
    amount: 1200,
    offsetDays: 20,
  },
];

claimsPool.forEach((claim, index) => {
  const policy = policies[index];
  if (!policy) return;
  const childName = policy.children[0]?.firstName ?? "Student";
  policy.claims.push({
    id: claim.id,
    type: claim.type,
    status: claim.status,
    submittedAt: new Date(policy.startDate.getTime() + claim.offsetDays * 86400000),
    amount: claim.amount,
    childName,
  });
});

export const placements: Placement[] = Array.from({ length: 22 }).map((_, index) => {
  const rand = createSeededRandom(index + 900);
  const levelRoll = rand();
  const level: Placement["level"] = levelRoll > 0.75 ? 3 : levelRoll > 0.3 ? 2 : 1;
  const premium: Placement["premium"] = level === 3 ? 125 : level === 2 ? 60 : 25;
  const parentFirst = pick(rand, [...femaleNames, ...maleNames]);
  const parentLast = pick(rand, surnames);
  const state = statePool[index % statePool.length];
  const schoolOptions = schoolsByState[state] ?? schoolsByState.NSW;
  return {
    id: formatId("PL", index + 1),
    level,
    premium,
    parent: {
      firstName: parentFirst,
      lastName: parentLast,
      email: `${parentFirst.toLowerCase()}.${parentLast.toLowerCase()}@email.com`,
      state,
    },
    school: schoolOptions[index % schoolOptions.length],
    depositAmount: Math.round(200 + rand() * 4800),
    purchaseDate: new Date(2026, 2 + (index % 18), 5 + (index % 20), 10, 30),
    status: rand() > 0.95 ? "claimed" : rand() > 0.6 ? "active" : "expired",
    source: sourcePool[index % sourcePool.length],
  };
});

const amendmentTypes: Amendment["type"][] = [
  "add_child",
  "remove_child",
  "add_product",
  "upgrade_full_term",
  "change_school",
  "update_fee",
  "change_payment_frequency",
];

export const amendments: Amendment[] = Array.from({ length: 12 }).map((_, index) => {
  const policy = policies[index % policies.length];
  const rand = createSeededRandom(index + 1200);
  const type = amendmentTypes[index % amendmentTypes.length];
  const descriptionMap: Record<Amendment["type"], string> = {
    add_child: `Added ${pick(rand, femaleNames)} ${policy.parent.lastName} to policy`,
    remove_child: `Removed child from policy ${policy.id}`,
    add_product: "Added Student Continuity Cover",
    upgrade_full_term: "Upgraded to Full Term Cover",
    change_school: "Updated school details",
    update_fee: "Updated annual fee amount",
    change_payment_frequency: "Switched payment frequency",
  };
  const createdAt = new Date(policy.startDate.getTime() + (30 + index * 4) * 86400000);
  return {
    id: formatId("AM", index + 1),
    policyId: policy.id,
    type,
    description: descriptionMap[type],
    effectiveDate: new Date(createdAt.getTime() + 3 * 86400000),
    premiumImpact: Math.round((rand() - 0.45) * 320),
    processedBy: rand() > 0.6 ? "admin" : "system",
    createdAt,
  };
});

export const renewals: Renewal[] = policies
  .filter((policy) => policy.startDate.getFullYear() === 2026 && policy.startDate.getMonth() <= 7)
  .slice(0, 8)
  .map((policy, index) => {
    const rand = createSeededRandom(index + 1400);
    const feeIncrease = Math.round(policy.premiums.grossAnnual * 0.05);
    const newPremium = policy.premiums.grossAnnual + feeIncrease;
    const statusRoll = rand();
    const status: Renewal["status"] =
      statusRoll > 0.875 ? "declined" : statusRoll > 0.75 ? "pending" : "renewed";
    const renewalDate = new Date(policy.startDate);
    renewalDate.setFullYear(renewalDate.getFullYear() + 1);
    return {
      id: formatId("RN", index + 1),
      policyId: policy.id,
      previousPremium: policy.premiums.grossAnnual,
      newPremium,
      feeIncrease,
      status,
      renewalDate,
      processedAt: status === "renewed" ? new Date(renewalDate.getTime() - 7 * 86400000) : undefined,
    };
  });

export const activityFeed: ActivityItem[] = [
  ...quotes.map((quote) => ({
    id: `quote-${quote.id}`,
    date: quote.createdAt,
    tone:
      quote.status === "abandoned"
        ? "warning"
        : quote.status === "expired"
        ? "warning"
        : "info",
    description: `Quote ${quote.id} created — ${quote.parent.firstName} ${quote.parent.lastName}`,
    href: `/admin/quotes`,
  })),
  ...policies.map((policy) => ({
    id: `policy-${policy.id}`,
    date: policy.startDate,
    tone: "success",
    description: `New policy ${policy.id} — ${policy.parent.firstName} ${policy.parent.lastName}`,
    href: `/admin/policies`,
  })),
  ...placements.map((placement) => ({
    id: `placement-${placement.id}`,
    date: placement.purchaseDate,
    tone: "accent",
    description: `Placement cover ${placement.id} — ${placement.parent.firstName} ${placement.parent.lastName}`,
    href: `/admin/financials`,
  })),
  ...amendments.map((amendment) => ({
    id: `amendment-${amendment.id}`,
    date: amendment.createdAt,
    tone: "accent",
    description: `Amendment ${amendment.id} — ${amendment.description}`,
    href: `/admin/policies`,
  })),
  ...renewals.map((renewal) => ({
    id: `renewal-${renewal.id}`,
    date: renewal.renewalDate,
    tone: renewal.status === "renewed" ? "success" : "warning",
    description: `Renewal ${renewal.id} — ${renewal.status}`,
    href: `/admin/policies`,
  })),
  ...policies.flatMap((policy) =>
    policy.claims.map((claim) => ({
      id: `claim-${claim.id}`,
      date: claim.submittedAt,
      tone: claim.status === "paid" ? "success" : "info",
      description: `Claim ${claim.id} — ${claim.childName} (${claim.status})`,
      href: `/admin/policies`,
    }))
  ),
].sort((a, b) => b.date.getTime() - a.date.getTime());

const totalGwp = policies.reduce((sum, policy) => sum + policy.premiums.grossAnnual, 0);
const totalCommission = policies.reduce(
  (sum, policy) => sum + policy.premiums.commission,
  0
);
const totalStampDuty = policies.reduce(
  (sum, policy) => sum + policy.premiums.stampDuty,
  0
);
const totalGst = policies.reduce((sum, policy) => sum + policy.premiums.gst, 0);

export const dashboardStats = {
  totalGwp,
  totalPolicies: policies.length,
  totalQuotes: quotes.length,
  conversionRate: quotes.length
    ? Math.round(
        (quotes.filter((quote) => quote.status === "converted").length / quotes.length) * 1000
      ) / 10
    : 0,
  avgPremium: policies.length ? Math.round(totalGwp / policies.length) : 0,
  avgSchoolFee: quotes.length
    ? Math.round(
        quotes.reduce(
          (sum, quote) =>
            sum + quote.children.reduce((childSum, child) => childSum + child.annualFee, 0),
          0
        ) / quotes.length
      )
    : 0,
  totalCommission,
  totalStampDuty,
  totalGst,
  monthlyGwp: months.map((month) => {
    const monthPolicies = policies.filter(
      (policy) =>
        policy.startDate.getFullYear() === month.year &&
        policy.startDate.getMonth() === month.month
    );
    const monthQuotes = quotes.filter(
      (quote) =>
        quote.createdAt.getFullYear() === month.year &&
        quote.createdAt.getMonth() === month.month
    );
    return {
      month: month.label,
      gwp: monthPolicies.reduce((sum, policy) => sum + policy.premiums.grossAnnual, 0),
      policies: monthPolicies.length,
      quotes: monthQuotes.length,
    };
  }),
  byState: statesByShare
    .filter((value, index, self) => self.indexOf(value) === index)
    .map((state) => {
      const statePolicies = policies.filter((policy) => policy.parent.state === state);
      return {
        state,
        policies: statePolicies.length,
        gwp: statePolicies.reduce((sum, policy) => sum + policy.premiums.grossAnnual, 0),
        stampDuty: statePolicies.reduce((sum, policy) => sum + policy.premiums.stampDuty, 0),
        stampDutyRate: statePolicies.length
          ? statePolicies[0].premiums.stampDutyRate
          : 0,
      };
    })
    .sort((a, b) => b.policies - a.policies),
  bySource: sourcesByShare
    .filter((value, index, self) => self.indexOf(value) === index)
    .map((source) => {
      const sourceQuotes = quotes.filter((quote) => quote.source === source);
      const sourceConversions = sourceQuotes.filter((quote) => quote.status === "converted");
      const gwp = policies
        .filter((policy) => sourceConversions.some((quote) => quote.id === policy.quoteId))
        .reduce((sum, policy) => sum + policy.premiums.grossAnnual, 0);
      return {
        source,
        quotes: sourceQuotes.length,
        conversions: sourceConversions.length,
        gwp,
        rate: sourceQuotes.length
          ? Math.round((sourceConversions.length / sourceQuotes.length) * 1000) / 10
          : 0,
      };
    })
    .sort((a, b) => b.gwp - a.gwp),
  byProduct: {
    parentCover: quotes.length,
    fullTerm: quotes.filter((quote) => quote.products.fullTermUpgrade).length,
    studentCover: quotes.filter((quote) => quote.products.studentCover).length,
    expensesCover: quotes.filter((quote) => quote.products.expensesCover).length,
    placement: placements.length,
  },
};
