import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import InfoBox from "@/components/shared/InfoBox";
import Tooltip from "@/components/shared/Tooltip";

const palette = [
  { label: "Navy", className: "bg-navy", text: "#2D3E50" },
  { label: "Off-White", className: "bg-off-white", text: "#F8F9FA" },
  { label: "Magenta", className: "bg-magenta", text: "#D6336C" },
  { label: "Magenta Dark", className: "bg-magenta-dark", text: "#C2255C" },
  { label: "Grey 100", className: "bg-grey-100", text: "#F7FAFC" },
  { label: "Grey 300", className: "bg-grey-300", text: "#E2E8F0" },
];

export default function Home() {
  return (
    <div className="bg-off-white">
      <section className="mx-auto max-w-6xl px-4 py-20 md:py-24">
        <Badge variant="magenta">Design System Preview</Badge>
        <h1 className="mt-6 text-h1 font-headline text-navy">
          Protecting Your Child&apos;s Future
        </h1>
        <p className="mt-4 max-w-2xl text-body-lg text-grey-700">
          This page showcases the SchoolSure design system foundation: typography,
          buttons, cards, inputs, and information boxes.
        </p>
        <div className="mt-8 flex flex-wrap gap-4">
          <Button>Get Your Quote</Button>
          <Button variant="secondary">See How It Works</Button>
          <Button variant="ghost">Learn more</Button>
        </div>
        <div className="mt-6">
          <Tooltip content="SchoolSure protects school fees if something unexpected happens.">
            <span className="cursor-help text-sm text-grey-700 underline decoration-dotted">
              What is SchoolSure?
            </span>
          </Tooltip>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-16">
        <h2 className="text-h3 font-headline text-navy">Colour Palette</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {palette.map((item) => (
            <div key={item.label} className="rounded-2xl bg-white p-4 shadow-[0_2px_8px_rgba(0,0,0,0.06)]">
              <div className={`h-16 w-full rounded-xl ${item.className}`} />
              <div className="mt-3 text-sm font-semibold text-navy">{item.label}</div>
              <div className="text-xs text-grey-500">{item.text}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-16">
        <h2 className="text-h3 font-headline text-navy">Typography</h2>
        <div className="mt-6 space-y-3">
          <div className="text-h1 font-headline text-navy">Heading 1</div>
          <div className="text-h2 font-headline text-navy">Heading 2</div>
          <div className="text-h3 font-headline text-navy">Heading 3</div>
          <div className="text-h4 font-headline text-navy">Heading 4</div>
          <div className="text-body-lg text-grey-700">
            Body Large — clear, reassuring copy for premium financial services.
          </div>
          <div className="text-body text-grey-700">
            Body — concise, warm, and direct tone for supporting content.
          </div>
          <div className="text-small text-grey-500">Small — helper text and metadata.</div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-16">
        <h2 className="text-h3 font-headline text-navy">Cards</h2>
        <div className="mt-6 grid gap-6 md:grid-cols-3">
          <Card>
            <div className="text-h4 font-headline text-navy">Default Card</div>
            <p className="mt-2 text-body text-grey-700">
              Clean, spacious, and trustworthy presentation.
            </p>
          </Card>
          <Card variant="interactive">
            <div className="text-h4 font-headline text-navy">Interactive</div>
            <p className="mt-2 text-body text-grey-700">
              Hover to lift and reveal selection intent.
            </p>
          </Card>
          <Card variant="selected">
            <div className="text-h4 font-headline text-navy">Selected</div>
            <p className="mt-2 text-body text-grey-700">
              Highlighted for recommended choices.
            </p>
          </Card>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-20">
        <h2 className="text-h3 font-headline text-navy">Form Elements</h2>
        <div className="mt-6 grid gap-6 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-small font-semibold text-navy">
              Email Address
            </label>
            <Input placeholder="you@example.com" />
          </div>
          <div>
            <label className="mb-2 block text-small font-semibold text-navy">
              Annual Fees (Error)
            </label>
            <Input placeholder="$35,000" error />
          </div>
        </div>
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          <InfoBox variant="tip">
            School fees typically increase 5–6% each year. SchoolSure keeps your
            cover aligned automatically.
          </InfoBox>
          <InfoBox variant="warning">
            There is a 30-day waiting period before claims can be made (excluding
            accidental death or injury).
          </InfoBox>
        </div>
      </section>
    </div>
  );
}
