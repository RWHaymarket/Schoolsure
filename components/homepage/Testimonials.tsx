import { Star, User } from "lucide-react";

const testimonials = [
  {
    quote:
      "My husband was diagnosed with bowel cancer in March. I couldn't think about anything, let alone school fees. SchoolSure paid Knox Grammar directly for the rest of the year. The boys never knew anything was different.",
    author: "Sarah M.",
    role: "North Shore, Sydney",
    rating: 5,
  },
  {
    quote:
      "We remortgaged to afford Pymble. If I'd been hit by a bus, the girls would've been out. SchoolSure costs us less than Netflix. I genuinely don't understand why every parent doesn't have it.",
    author: "James T.",
    role: "Northern Beaches, Sydney",
    rating: 5,
  },
  {
    quote:
      "My daughter couldn't go to school for three weeks because of anxiety after being cyberbullied. I didn't even know that was covered. SchoolSure refunded the fees we'd have lost. It meant everything.",
    author: "Michelle K.",
    role: "Brighton, Melbourne",
    rating: 5,
  },
];

export default function Testimonials() {
  return (
    <section className="bg-white py-12">
      <div className="mx-auto max-w-7xl px-4">
        <h2 className="text-h2 text-navy">What parents are saying</h2>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {testimonials.map((item) => (
            <div
              key={item.author}
              className="rounded-2xl border border-grey-100 bg-white p-8 shadow-sm border-l-4 border-l-magenta"
            >
              <span className="text-5xl font-serif text-magenta/20 leading-none">"</span>
              <div className="flex gap-1">
                {Array.from({ length: item.rating }).map((_, index) => (
                  <Star key={index} className="h-5 w-5 text-magenta fill-magenta" />
                ))}
              </div>
              <p className="mt-5 text-body-lg text-navy leading-relaxed italic">“{item.quote}”</p>
              <div className="mt-6 flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-grey-100">
                  <User className="h-6 w-6 text-grey-500" />
                </div>
                <div>
                  <p className="text-base font-semibold text-navy">{item.author}</p>
                  <p className="text-sm text-grey-500">{item.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
