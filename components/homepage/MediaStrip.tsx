import Image from "next/image";

const mediaLogos = [
  {
    name: "Financial Review",
    src:
      "/images/testimonials/FireShot Capture 001 - Financial Review - Business, Finance and Investment News - afr.com_ - [www.afr.com].png",
    width: 180,
  },
  {
    name: "ABC",
    src:
      "/images/testimonials/FireShot Capture 002 - ABC (Australian Broadcasting Corporation) - [www.abc.net.au].png",
    width: 80,
  },
  {
    name: "9News",
    src:
      "/images/testimonials/FireShot Capture 003 - 9News - Latest news and headlines from Australia and the world_ - [www.9news.com.au].png",
    width: 100,
  },
  {
    name: "The Age",
    src:
      "/images/testimonials/FireShot Capture 005 - Latest & Breaking News Melbourne, Victoria - The Age - [www.theage.com.au].png",
    width: 140,
  },
];

export default function MediaStrip() {
  return (
    <section className="border-y border-grey-200 bg-white py-10">
      <div className="mx-auto max-w-7xl px-4">
        <p className="mb-6 text-center text-sm uppercase tracking-wider text-grey-500">
          As seen in
        </p>
        <div className="flex flex-wrap items-center justify-center gap-6 opacity-50 grayscale transition-all duration-300 hover:opacity-100 hover:grayscale-0">
          {mediaLogos.map((logo) => (
            <div
              key={logo.name}
              className="flex items-center justify-center rounded-xl border border-grey-200 bg-white px-5 py-3 shadow-sm"
            >
              <div className="relative h-8" style={{ width: logo.width }}>
                <Image src={logo.src} alt={logo.name} fill className="object-contain" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
