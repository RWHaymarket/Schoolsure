import { ChevronDown } from "lucide-react";

const faqs = [
  {
    question: "What does SchoolSure actually cover?",
    answer:
      "SchoolSure protects your child's education if something unexpected happens to you — the person paying the school fees. Our core Parent Continuity Cover pays your child's school fees directly to the school if you die, suffer a serious injury or illness that stops you working, or are diagnosed with a critical illness like cancer, heart attack, or stroke. We also offer Student Continuity Cover (protecting fees when your child can't attend due to illness, injury, bullying, or mental health issues) and Annual School Expenses Cover (helping with books, transport, and uniforms after a covered event).",
  },
  {
    question: "How much does SchoolSure cost?",
    answer:
      "Most families pay between $10 and $25 per week — depending on your school fees. To put that in context, you probably spend more on streaming subscriptions. You can see your exact price by searching for your school on our website. No credit card needed, no obligation.",
  },
  {
    question: "How is this different from income protection or life insurance?",
    answer:
      "Life insurance and income protection pay money to you or your family. But that money has to cover everything — your mortgage, your bills, your groceries, and yes, maybe school fees if there's anything left. SchoolSure is different. We pay the school directly. The fees are ring-fenced. This helps your child stay in school. It's the difference between hoping there's enough money and knowing the fees are handled.",
  },
  {
    question: "Who underwrites SchoolSure?",
    answer:
      "SchoolSure is underwritten by Certain Underwriters at Lloyd's of London, the world's leading insurance market. Lloyd's has been protecting people and businesses since 1688. When you make a claim, your payout is backed by Lloyd's — one of the most trusted names in global insurance.",
  },
  {
    question: "What if I change schools?",
    answer:
      "Your cover moves with your child. If you transfer schools, your SchoolSure policy transfers too — no new application, no new underwriting, no gap in cover. Just let us know the new school and we update your policy. It's attached to your family, not a building.",
  },
  {
    question: "What about fee increases?",
    answer:
      "School fees go up every year — usually 5-6%, which is double the rate of inflation. SchoolSure is designed for this. Your cover is inflation-linked, which means it adjusts automatically as your fees increase. The protection you buy today won't fall short when you need it in five years' time.",
  },
  {
    question: "Is there a waiting period?",
    answer:
      "For most covers, there is no waiting period — you're covered from the date your policy starts. Some specific benefits (such as Temporary Disablement) may have a short waiting period as shown in your Policy Schedule. We'll make this completely clear before you purchase.",
  },
  {
    question: "What schools are covered?",
    answer:
      "SchoolSure covers over 780 Independent and Catholic schools across Australia. You can search for your school during the quote process. If your school isn't listed, contact us — we're adding new schools regularly and can often accommodate requests.",
  },
  {
    question: "How do I make a claim?",
    answer:
      "Claims are handled through our online portal — you can submit everything digitally. We've partnered with specialist claims assessors to make the process as straightforward as possible. Once you submit your claim with supporting documents (like a medical certificate), most claims are assessed within 10 business days. If approved, fees are paid directly to your school.",
  },
  {
    question: "Can I cancel my policy?",
    answer:
      "Yes, you can cancel at any time. If you cancel within the first 21 days (the cooling-off period), you'll receive a full refund provided no claim has been made. After the cooling-off period, you can still cancel — we'll refund any unused portion of your premium on a pro-rata basis.",
  },
  {
    question: "Do I need a medical exam?",
    answer:
      "No. SchoolSure does not require a medical exam or health questionnaire to purchase. Our underwriting is based on your school fees and cover level, not your health history. This means you can get covered instantly — no GP visits, no blood tests, no waiting for approvals.",
  },
];

export default function FAQ() {
  return (
    <section className="bg-off-white pt-12 pb-0">
      <div className="mx-auto max-w-7xl px-4">
        <h2 className="text-h2 text-navy">Frequently Asked Questions</h2>
        <div className="mt-12 divide-y divide-grey-300 rounded-2xl bg-white shadow-sm">
          {faqs.map((faq) => (
            <details
              key={faq.question}
              className="group px-6 py-5 transition-colors duration-200 group-open:bg-magenta/5"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between text-lg font-semibold text-navy">
                {faq.question}
                <ChevronDown className="h-6 w-6 text-navy transition-transform duration-200 group-open:rotate-180" />
              </summary>
              <p className="mt-3 text-base text-grey-700 leading-relaxed">{faq.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
