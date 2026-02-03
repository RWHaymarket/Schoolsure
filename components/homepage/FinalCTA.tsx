import Image from "next/image";

export default function FinalCTA() {
  return (
    <section className="relative bg-[#2D3E50] py-16 lg:py-20 overflow-hidden">
      <div className="absolute inset-0 bg-[#2D3E50]">
        <Image
          src="/images/hero/hero-stlukes-students.png"
          alt="Students"
          fill
          className="object-cover object-[center_top] opacity-25"
        />
        <div className="absolute inset-0 bg-[#2D3E50]/70" />
      </div>

      <div className="relative max-w-3xl mx-auto px-4 text-center">
        <p className="text-[#D6336C] text-sm font-semibold mb-4">
          School Fee Protection Insurance
        </p>
        <h2 className="text-3xl lg:text-4xl font-black text-white mb-4">
          Ready to protect what matters?
        </h2>
        <p className="text-lg text-white/50 mb-8">
          No paperwork. No medical. Just cover.
        </p>
        <a
          href="/quote/school"
          className="inline-flex items-center gap-2 px-8 py-4 bg-[#D6336C] hover:bg-[#C2255C] text-white font-bold text-lg rounded-xl transition-all shadow-lg shadow-[#D6336C]/30"
        >
          Get Your Quote →
        </a>
        <p className="text-xs text-white/30 mt-4">
          Cover is subject to policy terms and conditions.
        </p>
      </div>
    </section>
  );
}
