import { Clock, School, TrendingUp } from "lucide-react";

const items = [
  {
    title: "Fees paid directly to your school",
    description:
      "We pay your school directly — this helps your child stay enrolled, no disruption.",
    icon: School,
  },
  {
    title: "Keeps up with rising fees",
    description: "Your cover adjusts automatically as fees increase each year.",
    icon: TrendingUp,
  },
  {
    title: "Get covered fast",
    description: "Simple online cover with no delays.",
    icon: Clock,
  },
];

export default function ValueProps() {
  return (
    <section className="bg-off-white py-20">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 md:grid-cols-3">
        {items.map(({ title, description, icon: Icon }) => (
          <div key={title} className="flex flex-col items-center text-center">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-magenta/10">
              <Icon className="h-6 w-6 text-magenta" />
            </div>
            <p className="text-lg font-semibold text-navy">{title}</p>
            <p className="mt-2 text-base text-grey-700">{description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
