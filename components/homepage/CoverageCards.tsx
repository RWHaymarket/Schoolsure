import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Calendar, Check, Heart, Shield } from "lucide-react";

const coverageCards = [
  {
    id: "parent",
    icon: Shield,
    iconBg: "bg-navy",
    title: "If something happens to you, we step in.",
    description:
      "If you're diagnosed with a critical illness, have a serious accident, or die — we pay your child's school fees directly to the school. This helps your child stay in school.",
    bullets: [
      "Death — fees paid directly to the school to finish the year",
      "Disablement — temporary or permanent, cover continues while you recover",
      "Critical illness — cancer, heart attack, stroke. Helps your child stay in school.",
    ],
    image: "/images/schools/school-trinity-boys.png",
    link: "/quote/school",
    cta: "Protect Your Family",
  },
  {
    id: "student",
    icon: Heart,
    iconBg: "bg-magenta",
    title: "When your child can't be there, the fees are still covered.",
    description:
      "Kids get sick. They get injured. They experience anxiety, bullying, and things that keep them home. When that happens, you shouldn't lose the fees you've already paid.",
    bullets: [
      "Illness & injury — from broken bones to surgery recovery",
      "Mental health — anxiety, bullying, trauma. Professional confirmation required.",
      "Events & competitions — non-refundable fees returned if they can't attend",
    ],
    image: "/images/schools/school-abbotsleigh-science.png",
    link: "/quote/school",
    cta: "Add Student Cover",
  },
  {
    id: "expenses",
    icon: Calendar,
    iconBg: "bg-grey-700",
    title: "School expenses covered when it matters.",
    description:
      "Books, transport, uniforms — covered when a valid claim is approved. Built to support families through a covered event.",
    bullets: [
      "School books & study aids — up to $1,000",
      "School transport — up to $1,000",
      "Uniforms — up to $500",
    ],
    image: "/images/schools/school-rugby-team.png",
    link: "/coverage/expenses",
    cta: "Learn More",
  },
];

export default function CoverageCards() {
  return (
    <section id="coverage" className="bg-white pt-8 pb-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl lg:text-5xl font-black text-navy mb-4">
            What SchoolSure covers
          </h2>
          <p className="text-xl text-grey-700 max-w-2xl mx-auto">
            Protection that follows your family from enrolment to graduation.
          </p>
        </div>

        <div className="space-y-14 lg:space-y-20">
          {coverageCards.map((card, index) => {
            const Icon = card.icon;
            const isReversed = index % 2 === 1;
            return (
              <div
                key={card.id}
                className={`grid items-start gap-10 lg:grid-cols-[1.1fr_0.9fr] ${
                  isReversed ? "lg:[&>*:first-child]:order-2" : ""
                }`}
              >
                <div className="pt-1">
                  <div className="flex items-center gap-4 mb-4">
                    <div className={`w-12 h-12 rounded-2xl ${card.iconBg} flex items-center justify-center`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-3xl font-black text-navy">{card.title}</h3>
                  </div>
                  <p className="text-lg text-grey-700 leading-relaxed mb-6">{card.description}</p>
                  <ul className="space-y-3 mb-8">
                    {card.bullets.map((item) => (
                      <li key={item} className="flex items-start gap-3">
                        <div className="w-6 h-6 rounded-full bg-magenta/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <Check className="w-3.5 h-3.5 text-magenta" />
                        </div>
                        <span className="text-base text-grey-700">{item}</span>
                      </li>
                    ))}
                  </ul>
                  <Link
                    href={card.link}
                    className="inline-flex items-center gap-2 px-6 py-3 font-semibold rounded-xl transition-all bg-magenta hover:bg-magenta-dark text-white"
                  >
                    {card.cta}
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>

                <div className="relative">
                  <div
                    className="relative overflow-hidden rounded-2xl bg-white shadow-[0_24px_60px_rgba(15,23,42,0.18)] ring-1 ring-black/5 transition-transform duration-300 hover:scale-[1.01]"
                    style={{ aspectRatio: "4/3" }}
                  >
                    <Image
                      src={card.image}
                      alt={card.title}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-navy/20 to-transparent" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
