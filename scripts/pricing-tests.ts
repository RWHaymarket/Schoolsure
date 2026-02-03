import { calculatePremium } from "@/store/useQuoteStore";

const format = (value: number) => Number(value.toFixed(2));

const runTest = (label: string, input: Parameters<typeof calculatePremium>[0]) => {
  const result = calculatePremium(input);
  console.log(`\n${label}`);
  console.log("Annual total:", format(result.annualTotal));
  console.log("Annual w/ discount:", format(result.annualWithDiscount));
  console.log("Monthly:", format(result.monthlyTotal));
  console.log("Daily:", format(result.dailyEquivalent));
  console.log("Children:", result.children);
};

runTest("TEST 1: $40,000 fee, A+B+C, full term, 1 child", {
  annualFees: 40000,
  includeStudentCover: true,
  includeExpensesCover: true,
  fullTermUpgrade: true,
  children: [{ firstName: "Child 1", dateOfBirth: "", yearLevel: "" }],
  schoolName: "Test School",
});

runTest("TEST 2: $8,000 fee, A only, standard, 1 child", {
  annualFees: 8000,
  includeStudentCover: false,
  includeExpensesCover: false,
  fullTermUpgrade: false,
  children: [{ firstName: "Child 1", dateOfBirth: "", yearLevel: "" }],
  schoolName: "Test School",
});

runTest("TEST 3: $25,000 fee, A+B, no upgrade, 2 children", {
  annualFees: 25000,
  includeStudentCover: true,
  includeExpensesCover: false,
  fullTermUpgrade: false,
  children: [
    { firstName: "Child 1", dateOfBirth: "", yearLevel: "" },
    { firstName: "Child 2", dateOfBirth: "", yearLevel: "" },
  ],
  schoolName: "Test School",
});

runTest("TEST 4: $15,000 fee, A only, full term, 3 children", {
  annualFees: 15000,
  includeStudentCover: false,
  includeExpensesCover: false,
  fullTermUpgrade: true,
  children: [
    { firstName: "Child 1", dateOfBirth: "", yearLevel: "" },
    { firstName: "Child 2", dateOfBirth: "", yearLevel: "" },
    { firstName: "Child 3", dateOfBirth: "", yearLevel: "" },
  ],
  schoolName: "Test School",
});
