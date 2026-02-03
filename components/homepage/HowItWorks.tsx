const steps = [
  {
    step: "1",
    title: "Find your school",
    desc: "Search 780+ schools. Pick yours and enter your annual fees.",
  },
  {
    step: "2",
    title: "Choose your cover",
    desc: "Parents, students, or both. Add deposit cover if you need it.",
  },
  {
    step: "3",
    title: "You're covered",
    desc: "If something happens, we pay the school directly. Your child stays.",
  },
];

export default function HowItWorks() {
  return (
    <section className="py-12 lg:py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl lg:text-3xl font-black text-[#2D3E50] text-center mb-3">
          How it works
        </h2>
        <p className="text-gray-500 text-center mb-10">Three steps. That&apos;s it.</p>

        <div className="grid md:grid-cols-3 gap-0 relative">
          <div className="hidden md:block absolute top-8 left-[16.67%] right-[16.67%] h-0.5 bg-gray-200" />
          {steps.map(({ step, title, desc }) => (
            <div key={step} className="text-center relative px-6">
              <div className="w-16 h-16 rounded-full bg-[#D6336C] text-white text-2xl font-black flex items-center justify-center mx-auto mb-4 relative z-10">
                {step}
              </div>
              <h3 className="text-lg font-bold text-[#2D3E50] mb-2">{title}</h3>
              <p className="text-sm text-gray-500">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
