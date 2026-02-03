import { Clock, School, Shield } from "lucide-react";

const trustItems = [
  {
    type: "lloyds",
    title: "Backed by Lloyd's of London",
    description:
      "The world's leading insurance market, protecting families since 1688.",
  },
  {
    type: "icon",
    icon: School,
    title: "Paid directly to your school",
    description:
      "We pay fees straight to the school — your child's place is never at risk.",
  },
  {
    type: "icon",
    icon: Clock,
    title: "Fast online cover",
    description:
      "Get an instant quote online. Designed to keep things simple.",
  },
];

export default function TrustBar() {
  return (
    <section className="bg-off-white py-20">
      <div className="mx-auto max-w-7xl px-4">
        <p className="text-center text-sm font-semibold uppercase tracking-widest text-grey-500">
          Trusted protection
        </p>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {trustItems.map((item) => {
            if (item.type === "lloyds") {
              return (
                <div
                  key={item.title}
                  className="rounded-2xl border border-grey-100 bg-white p-6 shadow-sm text-center"
                >
                  {/* TODO: Replace with actual Lloyd's logo image */}
                  <div className="inline-flex items-center justify-center bg-navy rounded-lg px-5 py-3 mb-4">
                    <span className="text-white text-sm font-bold tracking-[0.2em] uppercase">
                      Lloyd&apos;s
                    </span>
                  </div>
                  <p className="text-lg font-semibold text-navy">{item.title}</p>
                  <p className="mt-2 text-base text-grey-700">{item.description}</p>
                </div>
              );
            }
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className="rounded-2xl border border-grey-100 bg-white p-6 shadow-sm"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-navy shadow-sm">
                  <Icon className="h-7 w-7 text-white" />
                </div>
                <p className="mt-4 text-lg font-semibold text-navy">{item.title}</p>
                <p className="mt-2 text-base text-grey-700">{item.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
