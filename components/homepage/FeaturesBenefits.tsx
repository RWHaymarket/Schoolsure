import { Heart, Shield, Zap } from "lucide-react";

const features = [
  {
    title: "Backed by Lloyd's of London",
    description:
      "337 years of trust. Your policy is underwritten by the world's leading insurance market.",
    icon: Shield,
    iconBg: "bg-[#D6336C]",
  },
  {
    title: "Body and mind. Both covered.",
    description:
      "Broken bones to bullying. Surgery to anxiety. We cover the real reasons children miss school.",
    icon: Heart,
    iconBg: "bg-[#2D3E50]",
  },
  {
    title: "Quote in 2 minutes. No fuss.",
    description:
      "Find your school, pick your cover, done. No medical exams. No paperwork. Fully online.",
    icon: Zap,
    iconBg: "bg-[#D6336C]",
  },
];

export default function FeaturesBenefits() {
  return (
    <section className="py-12 bg-[#F8F9FA]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-black text-[#2D3E50] text-center mb-8">
          Why SchoolSure?
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          {features.map(({ title, description, icon: Icon, iconBg }) => (
            <div
              key={title}
              className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              <div
                className={`w-12 h-12 rounded-xl ${iconBg} flex items-center justify-center mb-4`}
              >
                <Icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-bold text-[#2D3E50] mb-2">
                {title}
              </h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                {description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
