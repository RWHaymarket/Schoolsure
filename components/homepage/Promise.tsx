import Link from "next/link";
import { Shield, ArrowRight } from "lucide-react";

import Button from "@/components/ui/Button";

export default function Promise() {
  return (
    <section className="bg-off-white">
      <div className="mx-auto max-w-3xl px-4 py-20 text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-off-white border-2 border-grey-300">
          <Shield className="h-6 w-6 text-navy" />
        </div>
        <div className="text-h2 text-navy">The SchoolSure Promise</div>
        <p className="mt-4 text-body-lg text-grey-700 leading-relaxed">
          We started SchoolSure because no parent should have to choose between
          their health and their child's education. We're a small, specialist team —
          not a faceless corporation. We built this product for families like ours,
          and we stand behind every policy with the backing of Lloyd's of London.
        </p>
        <div className="mt-8">
          <Link href="/about">
            <Button variant="secondary" size="lg" className="text-lg">
              Meet the team behind SchoolSure
              <ArrowRight className="h-5 w-5" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
