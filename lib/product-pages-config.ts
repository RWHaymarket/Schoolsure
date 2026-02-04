import { PRICING_CONFIG } from "@/lib/pricing-config";
import { formatCurrency, formatCurrencyWithCents } from "@/lib/utils";
import type { ProductLandingConfig } from "@/components/products/ProductLandingPage";

const percent = (rate: number, digits = 1) => {
  const value = (rate * 100).toFixed(digits);
  return value.endsWith(".0") ? value.slice(0, -2) : value;
};

const buildDailyPrice = (annualFee: number, rate: number) => {
  const annualPremium = annualFee * rate;
  const daily = annualPremium / 365;
  return formatCurrencyWithCents(daily);
};

const buildParentRow = (annualFee: number) => {
  const basePremium = Math.max(
    annualFee * PRICING_CONFIG.productA.rate,
    PRICING_CONFIG.productA.minimumPremium
  );
  const fullTerm = basePremium * (1 + PRICING_CONFIG.productA.fullTermLoading);
  const monthly = basePremium / 12;
  const isMinimum = basePremium === PRICING_CONFIG.productA.minimumPremium;
  const suffix = isMinimum ? "*" : "";
  return [
    formatCurrency(annualFee),
    `${formatCurrency(Math.round(basePremium))}${suffix}`,
    `${formatCurrency(Math.round(fullTerm))}${suffix} (+${percent(
      PRICING_CONFIG.productA.fullTermLoading,
      0
    )}%)`,
    `~${formatCurrency(Math.round(monthly))}/month`,
  ];
};

const buildStudentRow = (annualFee: number) => {
  const premium = annualFee * PRICING_CONFIG.productB.rate;
  const monthly = premium / 12;
  return [
    formatCurrency(annualFee),
    formatCurrency(Math.round(premium)),
    `~${formatCurrency(Math.round(monthly))}/month`,
  ];
};

const productAConfig: ProductLandingConfig = {
  id: "A",
  name: "Parent Continuity Cover",
  tagline: "The core protection for school fees",
  heroQuestion:
    "What happens to your child's school fees if something happens to you?",
  heroAnswer:
    "SchoolSure pays your child's school fees directly to the school — so their education continues without interruption, even when life doesn't go to plan.",
  badgeLabel: "CORE PRODUCT",
  badgeVariant: "magenta",
  icon: "shield-check",
  priceDisplay: `From ${percent(PRICING_CONFIG.productA.rate)}% of your annual school fee`,
  priceSubtext: `That's from ${buildDailyPrice(40000, PRICING_CONFIG.productA.rate)}/day for a ${formatCurrency(
    40000
  )} school`,
  ctaText: "Get a Quote",
  ctaLink: "/quote/school",
  trustLine: "No medical screening",
  problemSection: {
    heading: "School fees don't stop when income does",
    paragraphs: [
      "If you were diagnosed with a critical illness tomorrow, your child's school fees would still be due. Schools are sympathetic, but they aren't charities — fees are a contractual obligation.",
      "Income protection might cover part of your salary, but it doesn't guarantee your child stays at their school. The gap between reduced income and school fee obligations is where families are most vulnerable.",
      "69% of parents with children in non-government schools already face financial challenges at home. One serious life event can turn pressure into crisis.",
    ],
    stat: "69%",
    statLabel: "of fee-paying parents face financial challenges at home",
    statSource: "Futurity Cost of Education Index 2026",
  },
  howItWorks: {
    subtitle: "Three steps to protecting your child's education",
    steps: [
      {
        title: "Get a quote",
        description:
          "Enter your school and annual fee. Choose your cover level. Takes under 2 minutes.",
      },
      {
        title: "We cover you",
        description:
          "If you experience a covered event — death, terminal illness, critical illness, or disablement — notify SchoolSure.",
      },
      {
        title: "Fees paid to the school",
        description:
          "We pay your child's school fees directly to the school. No gap. No disruption. Your child stays.",
      },
    ],
  },
  coveredEvents: [
    {
      title: "Death of fee payer",
      description:
        "Fees continue for the academic year. Upgradeable to full schooling term.",
    },
    {
      title: "Terminal illness",
      description:
        "Diagnosed terminal illness triggers immediate cover. Upgradeable to full term.",
    },
    {
      title: "Temporary disablement",
      description:
        `Unable to work in any capacity for a continuous period. ${PRICING_CONFIG.productA.waitingPeriodDays}-day waiting period.`,
    },
    {
      title: "Permanent disablement",
      description:
        "Permanently unable to work in any occupation for which reasonably suited.",
    },
    {
      title: "Critical illness",
      description:
        "Defined conditions including cancer, heart attack, stroke. Confirmed by medical practitioner.",
    },
  ],
  notCovered: [
    "Redundancy or loss of employment",
    "Voluntary cessation of work or retirement",
    `Pre-existing conditions within the ${PRICING_CONFIG.productA.moratoriumYears}-year moratorium period`,
    "Fees already reduced by school hardship process",
    "Events before the period of insurance",
  ],
  importantNote:
    `No medical screening required — we use a moratorium approach with a ${PRICING_CONFIG.productA.moratoriumYears}-year pre-existing condition exclusion. Death and terminal illness cover starts immediately. All other covers have a ${PRICING_CONFIG.productA.waitingPeriodDays}-day waiting period.`,
  pricingSection: {
    type: "table",
    columns: [
      "Annual Fee",
      "Annual Premium",
      "With Full Term Upgrade",
      "Monthly (Standard)",
    ],
    rows: [
      buildParentRow(40000),
      buildParentRow(25000),
      buildParentRow(15000),
      buildParentRow(10000),
    ],
    note: `* Minimum premium ${formatCurrency(
      PRICING_CONFIG.productA.minimumPremium
    )}/year. Full term upgrade applies to death and terminal illness only. Annual payment attracts ${
      percent(PRICING_CONFIG.discounts.annualPayment, 0)
    }% discount. Multi-child discount of ${percent(
      PRICING_CONFIG.discounts.multiChild,
      0
    )}% per additional child.`,
    ctaLabel: "Calculate your exact premium",
  },
  scenarios: [
    {
      icon: "heart",
      title: "A diagnosis that changed everything",
      story:
        "Sarah, a single mum paying $28,000 a year for her daughter's school, was diagnosed with breast cancer. Treatment meant months off work with no income. Her daughter was in Year 10 — the worst possible time to change schools.",
      outcome:
        "SchoolSure paid $28,000 in fees directly to the school. Her daughter completed her HSC without disruption.",
      tag: "Covered under Parent Continuity Cover — Critical Illness",
    },
    {
      icon: "briefcase",
      title: "When the unexpected happens",
      story:
        "David, a father of two boys at a $35,000 school, suffered a serious spinal injury in a cycling accident. He was unable to work for seven months. His wife worked part-time and couldn't cover $70,000 in combined fees.",
      outcome:
        "SchoolSure covered both boys' fees for the full academic year while David recovered.",
      tag: "Covered under Parent Continuity Cover — Temporary Disablement",
    },
    {
      icon: "users",
      title: "Protecting a family's promise",
      story:
        "When Michael passed away suddenly, his wife was devastated. Their three children attended a school chosen together as a family. The last thing she wanted was to uproot them during grief.",
      outcome:
        "SchoolSure upgraded to full schooling term cover paid all three children's fees through to graduation.",
      tag: "Covered under Parent Continuity Cover — Death of Fee Payer (Full Term)",
    },
  ],
  faqs: [
    {
      question: "Do I need a medical examination?",
      answer:
        "No. SchoolSure uses a moratorium approach — no medical screening, no health questions, no GP visits. Pre-existing conditions diagnosed within the 5 years before your policy start date are excluded. Conditions diagnosed before that period are covered.",
    },
    {
      question: "When does cover start?",
      answer:
        "Death and terminal illness cover starts immediately from policy inception. All other covered events are subject to a 30-day waiting period.",
    },
    {
      question: "What does 'full schooling term upgrade' mean?",
      answer:
        "The standard benefit covers fees for the current academic year. The full schooling term upgrade (+15%) extends death and terminal illness cover to pay fees until your child completes school. This is only available for death and terminal illness because these are definitive events.",
    },
    {
      question: "How are claims paid?",
      answer:
        "SchoolSure pays fees directly to the school — not to you. This ensures the money goes where it's needed: keeping your child in school. You notify us, engage with your school's own hardship process first, and we pay the net remaining fee.",
    },
    {
      question: "What if my school offers a fee reduction?",
      answer:
        "SchoolSure pays the net remaining fee after any school-provided relief, bursary, or fee reduction. This prevents double-recovery and keeps premiums lower for everyone.",
    },
    {
      question: "Is redundancy covered?",
      answer:
        "Not at launch. Redundancy presents complex underwriting challenges, particularly with AI-related job displacement. We're investigating contained-risk structures for a future product enhancement.",
    },
    {
      question: "Can I cover more than one child?",
      answer:
        "Yes. Each additional child on the same policy receives a 10% multi-child discount on their total premium.",
    },
  ],
  crossSells: [
    {
      badge: "ADD-ON",
      name: "Student Continuity Cover",
      description: "Protect fees if your child is too unwell to attend.",
      link: "/products/student-continuity-cover",
    },
    {
      badge: "ADD-ON",
      name: "School Expenses Cover",
      description: "Covers books, transport, and uniforms up to $2,500.",
      link: "/products/school-expenses-cover",
    },
    {
      badge: "STANDALONE",
      name: "Placement Insurance",
      description: "Protect deposits and enrolment fees from $25.",
      link: "/products/placement-insurance",
    },
  ],
};

const productBConfig: ProductLandingConfig = {
  id: "B",
  name: "Student Continuity Cover",
  tagline: "Protection if your child can't attend",
  heroQuestion:
    "What happens to your school fees if your child becomes seriously ill?",
  heroAnswer:
    "When a child is too unwell to attend school for months, parents still pay full fees for a place that sits empty. Student Continuity Cover reimburses those fees.",
  badgeLabel: "ADD-ON",
  badgeVariant: "navy",
  icon: "heart-pulse",
  priceDisplay: `From ${percent(PRICING_CONFIG.productB.rate, 0)}% of your annual school fee`,
  priceSubtext: "Add to Parent Continuity Cover for complete family protection",
  ctaText: "Add to Your Quote",
  ctaLink: "/quote/school",
  trustLine: "No medical screening",
  problemSection: {
    heading: "You're paying for a desk your child can't sit in",
    paragraphs: [
      "When a child suffers a brain injury, develops a serious mental health condition, or is hospitalised for months — school continues. Fees continue. But your child doesn't.",
      "Schools rarely offer refunds for extended absence. You're paying full fees for a place your child can't use, while simultaneously managing medical costs, therapy, and the emotional toll on your family.",
      "Student Continuity Cover exists for the situations no parent wants to imagine but every parent should prepare for.",
    ],
    stat: `${percent(PRICING_CONFIG.productB.minimumAbsenceThreshold, 0)}%`,
    statLabel: "minimum school year absence threshold before a claim is payable",
    statSource: "SchoolSure Product Terms",
  },
  howItWorks: {
    subtitle: "Protection when your child can't attend",
    steps: [
      {
        title: "Your child becomes seriously unwell",
        description:
          "A severe illness, injury, mental health crisis, or sustained bullying prevents attendance for an extended period.",
      },
      {
        title: "Medical evidence confirms",
        description:
          "A treating specialist, psychiatrist, or psychologist confirms the condition. The school confirms the absence.",
      },
      {
        title: "Fees reimbursed to you",
        description:
        `Once absence exceeds ${percent(
          PRICING_CONFIG.productB.minimumAbsenceThreshold,
          0
        )}% of the school year, SchoolSure reimburses fees net of any school-provided relief.`,
      },
    ],
  },
  coveredEvents: [
    {
      title: "Severe physical illness or injury",
      description:
        "Brain injury, serious trauma, major surgery, extended hospitalisation.",
    },
    {
      title: "Severe mental health condition",
      description:
        "Anorexia, severe anxiety, clinical depression, psychosis requiring extended absence.",
    },
    {
      title: "Sustained bullying impact",
      description:
        "Diagnosed distress from verified, sustained bullying preventing extended attendance.",
    },
    {
      title: "Trauma response",
      description:
        "Severe psychological trauma following a significant event — accident, bereavement, or distressing incident.",
    },
  ],
  notCovered: [
    `Absences under ${percent(
      PRICING_CONFIG.productB.minimumAbsenceThreshold,
      0
    )}% of the school year`,
    "Routine childhood illness or normal unhappiness",
    "Pre-existing conditions known before the policy started",
    "Disciplinary exclusions or voluntary non-attendance",
    "Reluctance to attend school without medical basis",
  ],
  importantNote:
    "This is an add-on to Parent Continuity Cover (Product A). It cannot be purchased separately. Claims require medical evidence from a treating specialist and confirmation from the school.",
  pricingSection: {
    type: "table",
    columns: ["Annual Fee", "Student Cover Premium", "Monthly"],
    rows: [
      buildStudentRow(40000),
      buildStudentRow(25000),
      buildStudentRow(15000),
      buildStudentRow(10000),
    ],
    note: `${percent(
      PRICING_CONFIG.productB.rate,
      0
    )}% of declared annual school fee. ${
      percent(PRICING_CONFIG.discounts.multiChild, 0)
    }% multi-child discount for additional children.`,
    ctaLabel: "Calculate your exact premium",
  },
  scenarios: [
    {
      icon: "heart-pulse",
      title: "When illness strikes without warning",
      story:
        "Twelve-year-old Mia was diagnosed with leukaemia in Term 1. She missed seven months of school during treatment. Her parents were paying $22,000 in annual fees for a desk that sat empty while they managed hospital visits and therapy.",
      outcome:
        "Student Continuity Cover reimbursed $22,000 in fees, allowing the family to focus on Mia's recovery without financial pressure.",
      tag: "Covered under Student Continuity Cover — Severe Physical Illness",
    },
    {
      icon: "brain",
      title: "The mental health crisis nobody saw coming",
      story:
        "At fifteen, Tom developed severe anxiety and depression that made attending school impossible. His parents tried everything — counselling, medication adjustments, gradual re-entry. He missed five months.",
      outcome:
        "With psychiatric confirmation and school records, SchoolSure reimbursed the fees for the absence period.",
      tag: "Covered under Student Continuity Cover — Severe Mental Health Condition",
    },
    {
      icon: "shield",
      title: "When bullying goes too far",
      story:
        "Year 8 student Olivia experienced sustained cyberbullying that escalated over two terms. Despite the school's interventions, the psychological impact was severe. Her psychologist recommended extended time away from the school environment.",
      outcome:
        "Medical evidence and school incident records supported the claim. Fees were reimbursed for the extended absence.",
      tag: "Covered under Student Continuity Cover — Sustained Bullying Impact",
    },
  ],
  faqs: [
    {
      question: "Can I buy this without Parent Continuity Cover?",
      answer:
        "No. Student Continuity Cover is an add-on that requires Parent Continuity Cover (Product A) as the core policy. This keeps the product suite coherent and ensures families have foundational protection.",
    },
    {
      question: `What counts as ${percent(
        PRICING_CONFIG.productB.minimumAbsenceThreshold,
        0
      )}% of the school year?`,
      answer:
        "Approximately 10 weeks of absence in a standard 40-week school year. The absence doesn't need to be consecutive — cumulative absence due to the same covered condition counts.",
    },
    {
      question: "Does it cover routine childhood illness?",
      answer:
        `No. This cover is designed for severe, extended illness or injury — not the common cold, flu, or a few days off. The ${percent(
          PRICING_CONFIG.productB.minimumAbsenceThreshold,
          0
        )}% threshold ensures this is genuine, significant absence.`,
    },
    {
      question: "How is bullying verified?",
      answer:
        "Claims for bullying require both medical/mental health professional evidence confirming psychological distress AND school incident records documenting the bullying. Both must be present.",
    },
    {
      question: "What if my child changes school because of the condition?",
      answer:
        "Cover applies to fees at the school where the child was enrolled when the condition began. If your child transfers during the absence, the benefit covers the original school's fees.",
    },
  ],
  crossSells: [
    {
      badge: "CORE PRODUCT",
      name: "Parent Continuity Cover",
      description: "Protect your child's education if something happens to you.",
      link: "/products/parent-continuity-cover",
    },
    {
      badge: "ADD-ON",
      name: "School Expenses Cover",
      description: "Covers books, transport, and uniforms up to $2,500.",
      link: "/products/school-expenses-cover",
    },
    {
      badge: "STANDALONE",
      name: "Placement Insurance",
      description: "Protect deposits and enrolment fees from $25.",
      link: "/products/placement-insurance",
    },
  ],
};

const productCConfig: ProductLandingConfig = {
  id: "C",
  name: "Annual School Expenses Cover",
  tagline: "Protect the extras beyond tuition",
  heroQuestion: "School fees aren't the only cost at risk",
  heroAnswer:
    "Books bought. Bus passes paid. Uniforms purchased. When a covered event means your child can't use them, this cover protects the extras.",
  badgeLabel: "ADD-ON",
  badgeVariant: "navy",
  icon: "book-open",
  priceDisplay: `${formatCurrency(PRICING_CONFIG.productC.flatRate)} per child, per year`,
  priceSubtext: `That's ${formatCurrencyWithCents(
    PRICING_CONFIG.productC.flatRate / 52
  )} per week`,
  ctaText: "Add to Your Quote",
  ctaLink: "/quote/school",
  trustLine: "Immediate cover",
  problemSection: {
    heading: "The costs that add up beyond tuition",
    paragraphs: [
      "Tuition is the headline number, but families spend thousands more on textbooks, study resources, school transport, and compulsory uniforms. These costs are prepaid, non-refundable, and lost if your child can't attend.",
      "When a covered event triggers Parent or Student Continuity Cover, the school fees are handled. But what about the $800 in textbooks? The $950 bus pass? The $400 in sports uniforms?",
      "School Expenses Cover catches what the core cover doesn't — the ancillary costs that most families forget about until it's too late.",
    ],
    stat: formatCurrency(PRICING_CONFIG.productC.maxBenefit),
    statLabel:
      "combined maximum per child per year for books, transport, and uniforms",
    statSource: "SchoolSure Product Terms",
  },
  howItWorks: {
    subtitle: "Protection for the extras",
    steps: [
      {
        title: "A covered event occurs",
        description:
          "A valid claim is triggered under your Parent Continuity Cover or Student Continuity Cover.",
      },
      {
        title: "Provide receipts",
        description:
          "Submit receipts or school invoices for prepaid, non-refundable school books, transport, and uniform costs.",
      },
      {
        title: "Costs reimbursed",
        description:
          `SchoolSure reimburses qualifying expenses up to the combined maximum of ${formatCurrency(
            PRICING_CONFIG.productC.maxBenefit
          )} per child.`,
      },
    ],
  },
  coveredEvents: [
    {
      title: "School books & study aids",
      description: `Required textbooks, workbooks, and digital resources. Up to ${formatCurrency(
        PRICING_CONFIG.productC.components.booksAndStudyAids
      )}.`,
    },
    {
      title: "School transport",
      description: `Private school bus or contracted transport services. Up to ${formatCurrency(
        PRICING_CONFIG.productC.components.schoolTransport
      )}.`,
    },
    {
      title: "Uniform cover",
      description: `Sports, cadet, and compulsory uniform items. Up to ${formatCurrency(
        PRICING_CONFIG.productC.components.uniformCover
      )}.`,
    },
  ],
  notCovered: [
    "Expenses not required by the school",
    "Items already refunded by the school",
    "General stationery or personal items",
    "Costs incurred after the covered event",
    "Items without receipts or school invoices",
  ],
  importantNote:
    "This cover activates ONLY on a valid claim under Parent Continuity Cover (Product A) or Student Continuity Cover (Product B). It cannot be claimed independently.",
  pricingSection: {
    type: "card",
    price: formatCurrency(PRICING_CONFIG.productC.flatRate),
    subtext: "per child, per year",
    items: [
      {
        icon: "book-open",
        label: "Books & study aids",
        value: formatCurrency(PRICING_CONFIG.productC.components.booksAndStudyAids),
      },
      {
        icon: "bus",
        label: "School transport",
        value: formatCurrency(PRICING_CONFIG.productC.components.schoolTransport),
      },
      {
        icon: "shirt",
        label: "Uniform cover",
        value: formatCurrency(PRICING_CONFIG.productC.components.uniformCover),
      },
    ],
    maxLabel: `Combined maximum: ${formatCurrency(
      PRICING_CONFIG.productC.maxBenefit
    )}`,
    note: "Add this to a core policy to cover the extra costs families often forget.",
    ctaLabel: "Calculate your exact premium",
  },
  scenarios: [
    {
      icon: "book-open",
      title: "Textbooks bought, term lost",
      story:
        "When Jack's father was diagnosed with terminal illness, the family's immediate concern was his care — not the $780 in Year 11 textbooks they'd purchased three weeks earlier. Jack transferred to a school closer to home.",
      outcome:
        "Expenses Cover reimbursed the full $780 in textbooks alongside the core fee cover.",
      tag: "Triggered by Parent Continuity Cover — Terminal Illness",
    },
    {
      icon: "bus",
      title: "A bus pass to nowhere",
      story:
        "After a severe cycling accident, Year 9 student Chloe couldn't attend school for five months. Her parents had prepaid $920 for the annual school bus service.",
      outcome:
        "The bus costs were reimbursed in addition to the school fee claim under Student Continuity Cover.",
      tag: "Triggered by Student Continuity Cover — Severe Physical Injury",
    },
    {
      icon: "shirt",
      title: "Brand new uniforms, unused",
      story:
        "Ryan's family bought $450 in new uniforms for his first year at boarding school. When his mother suffered a critical illness, the family decided Ryan would attend a local school instead.",
      outcome:
        "Uniform costs were reimbursed alongside the core fee claim.",
      tag: "Triggered by Parent Continuity Cover — Critical Illness",
    },
  ],
  faqs: [
    {
      question: "Can I claim this without a core cover claim?",
      answer:
        "No. Expenses Cover activates only when a valid claim is made under Parent Continuity Cover or Student Continuity Cover. It's designed to catch the additional costs alongside the main cover.",
    },
    {
      question: "What receipts do I need?",
      answer:
        "Original purchase receipts or school invoices showing the item, cost, and date. Digital receipts are accepted. Expenses must have been prepaid and non-refundable.",
    },
    {
      question: "Are laptops or devices covered?",
      answer:
        "Not currently. Device coverage is under consideration for a future product. This cover is limited to books, transport, and compulsory uniforms.",
    },
    {
      question: `What if I've already claimed ${formatCurrency(
        PRICING_CONFIG.productC.components.booksAndStudyAids
      )} for books — can I claim transport too?`,
      answer:
        `Yes. Each component has its own limit (${formatCurrency(
          PRICING_CONFIG.productC.components.booksAndStudyAids
        )} books, ${formatCurrency(
          PRICING_CONFIG.productC.components.schoolTransport
        )} transport, ${formatCurrency(
          PRICING_CONFIG.productC.components.uniformCover
        )} uniform). You can claim across all three up to the combined maximum of ${formatCurrency(
          PRICING_CONFIG.productC.maxBenefit
        )}.`,
    },
    {
      question: `Is it ${formatCurrency(
        PRICING_CONFIG.productC.flatRate
      )} per child or ${formatCurrency(
        PRICING_CONFIG.productC.flatRate
      )} for all children?`,
      answer:
        `Per child. If you have two children on the policy, it's ${formatCurrency(
          PRICING_CONFIG.productC.flatRate * 2
        )}. The multi-child discount on the core cover doesn't apply to the flat-rate expenses cover.`,
    },
  ],
  crossSells: [
    {
      badge: "CORE PRODUCT",
      name: "Parent Continuity Cover",
      description: "Protect your child's education if something happens to you.",
      link: "/products/parent-continuity-cover",
    },
    {
      badge: "ADD-ON",
      name: "Student Continuity Cover",
      description: "Protect fees if your child is too unwell to attend.",
      link: "/products/student-continuity-cover",
    },
    {
      badge: "STANDALONE",
      name: "Placement Insurance",
      description: "Protect deposits and enrolment fees from $25.",
      link: "/products/placement-insurance",
    },
  ],
};

const productDConfig: ProductLandingConfig = {
  id: "D",
  name: "School Fee Placement Insurance",
  tagline: "Protect your enrolment deposit",
  heroQuestion: "What if you can't take up your child's school place?",
  heroAnswer:
    "Application fees, enrolment deposits, entrance fees — they're non-refundable. If an unforeseen event means your child can't start, Placement Insurance gets your money back.",
  badgeLabel: "STANDALONE",
  badgeVariant: "navy",
  icon: "graduation-cap",
  priceDisplay: `From ${formatCurrency(PRICING_CONFIG.productD.levels.level1.premium)}`,
  priceSubtext: "One-off payment. Instant cover. No ongoing commitment.",
  ctaText: "Get Covered",
  ctaLink: "/quote/placement",
  trustLine: "Immediate cover",
  problemSection: {
    heading: "Non-refundable means non-refundable",
    paragraphs: [
      `Securing a school place means paying upfront. Application fees, entrance assessments, enrolment deposits — often ${formatCurrency(
        PRICING_CONFIG.productD.levels.level1.limit
      )} to ${formatCurrency(
        PRICING_CONFIG.productD.levels.level3.limit
      )} or more. If you apply to multiple schools, the costs add up fast.`,
      "Life doesn't always cooperate with school timelines. A family illness, a forced relocation, a bereavement — any of these can mean your child can't take up the place you've paid for.",
      "Schools don't refund these fees because you had a bad year. Placement Insurance does.",
    ],
    stat: formatCurrency(PRICING_CONFIG.productD.levels.level3.limit),
    statLabel: "maximum deposit protection available per placement",
    statSource: "SchoolSure Level 3 Cover",
  },
  howItWorks: {
    subtitle: "Protect your deposit in three steps",
    steps: [
      {
        title: "Choose your cover level",
        description:
          `Level 1 (${formatCurrency(
            PRICING_CONFIG.productD.levels.level1.limit
          )}), Level 2 (${formatCurrency(
            PRICING_CONFIG.productD.levels.level2.limit
          )}), or Level 3 (${formatCurrency(
            PRICING_CONFIG.productD.levels.level3.limit
          )}). Match it to your deposit amount.`,
      },
      {
        title: "Pay once, you're covered",
        description:
          "One-off payment from $25. Instant cover. No waiting period. No medical screening.",
      },
      {
        title: "Claim if you need to",
        description:
          "If an unforeseen event means your child can't take up their place, we reimburse the non-refundable fees.",
      },
    ],
  },
  coveredEvents: [
    {
      title: "Critical illness or death of parent/guardian",
      description: "A serious health event affecting the primary fee payer.",
    },
    {
      title: "Critical illness or death of child",
      description: "A health event affecting the child who was to attend.",
    },
    {
      title: "Forced relocation",
      description:
        "Employment transfer requiring the family to move to a different area.",
    },
    {
      title: "Bereavement of parent or sibling",
      description: "Loss of an immediate family member.",
    },
  ],
  notCovered: [
    "Change of mind about the school",
    "Financial difficulty or inability to pay fees",
    "Voluntary relocation or lifestyle choice",
    "Application to a different school being accepted",
    "Disputes with the school",
  ],
  importantNote:
    "This is a standalone product. It does not require Parent Continuity Cover. Cover starts immediately from purchase — no waiting period.",
  pricingSection: {
    type: "table",
    columns: ["Level", "Deposit Protected", "Premium", "Best For"],
    rows: [
      [
        PRICING_CONFIG.productD.levels.level1.label,
        `Up to ${formatCurrency(PRICING_CONFIG.productD.levels.level1.limit)}`,
        formatCurrency(PRICING_CONFIG.productD.levels.level1.premium),
        PRICING_CONFIG.productD.levels.level1.description,
      ],
      [
        PRICING_CONFIG.productD.levels.level2.label,
        `Up to ${formatCurrency(PRICING_CONFIG.productD.levels.level2.limit)}`,
        formatCurrency(PRICING_CONFIG.productD.levels.level2.premium),
        PRICING_CONFIG.productD.levels.level2.description,
      ],
      [
        PRICING_CONFIG.productD.levels.level3.label,
        `Up to ${formatCurrency(PRICING_CONFIG.productD.levels.level3.limit)}`,
        formatCurrency(PRICING_CONFIG.productD.levels.level3.premium),
        PRICING_CONFIG.productD.levels.level3.description,
      ],
    ],
    note: "One-off payment. No annual renewal required.",
    ctaLabel: "Calculate your exact premium",
  },
  scenarios: [
    {
      icon: "briefcase",
      title: "Unexpected relocation",
      story:
        "James secured a place at his top-choice school with a $2,500 deposit. Three months later, his mum was transferred to Perth. Without cover, the deposit was gone.",
      outcome:
        "Placement Insurance reimbursed the non-refundable deposit, allowing the family to re-apply in their new city.",
      tag: "Covered under Placement Insurance — Forced Relocation",
    },
    {
      icon: "heart",
      title: "Family illness",
      story:
        "Sophia's parents paid a $1,200 enrolment fee. Her father was then diagnosed with a critical illness, and the family needed to reassess their finances and schooling plans.",
      outcome:
        "Placement Insurance reimbursed the enrolment fee after medical evidence confirmed the event.",
      tag: "Covered under Placement Insurance — Critical Illness",
    },
    {
      icon: "home",
      title: "Bereavement",
      story:
        "After the sudden loss of a sibling, Liam's family decided he needed to be closer to home rather than attend the boarding school they'd enrolled him in.",
      outcome:
        "Placement Insurance reimbursed the non-refundable fee so the family could enrol locally.",
      tag: "Covered under Placement Insurance — Bereavement",
    },
  ],
  faqs: [
    {
      question: "Do I need the main SchoolSure policy to buy this?",
      answer:
        "No. Placement Insurance is completely standalone. You can buy it without any other SchoolSure product.",
    },
    {
      question: "When does cover start?",
      answer:
        "Immediately. There's no waiting period. You're covered from the moment you purchase.",
    },
    {
      question: "Can I cover deposits at multiple schools?",
      answer:
        "Yes. Purchase one policy per school placement. Each policy covers the deposit for a specific school application.",
    },
    {
      question: "What if my deposit exceeds the level I chose?",
      answer: `You'd be covered up to the level limit. For example, Level 2 reimburses up to ${formatCurrency(
        PRICING_CONFIG.productD.levels.level2.limit
      )}. Consider Level 3 for deposits over ${formatCurrency(
        PRICING_CONFIG.productD.levels.level2.limit
      )}.`,
    },
    {
      question: "Is 'change of mind' covered?",
      answer:
        "No. This cover is specifically for unforeseen events that prevent your child taking up the place. Deciding you prefer another school, or changing your mind about private education, is not covered.",
    },
    {
      question: "Can I get a refund on the insurance if I don't need to claim?",
      answer:
        "Yes. You have a 30-day cooling off period from purchase. After that, the one-off premium is non-refundable — but the cover remains active.",
    },
  ],
  crossSells: [
    {
      badge: "CORE PRODUCT",
      name: "Parent Continuity Cover",
      description: "Protect your child's education if something happens to you.",
      link: "/products/parent-continuity-cover",
      priceAnchor: `From ${percent(PRICING_CONFIG.productA.rate)}% of your annual fee`,
      ctaText: "Get a Quote",
    },
  ],
};

export const PRODUCT_PAGES: Record<
  ProductLandingConfig["id"],
  ProductLandingConfig
> = {
  A: productAConfig,
  B: productBConfig,
  C: productCConfig,
  D: productDConfig,
};
