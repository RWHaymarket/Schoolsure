"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, ChevronDown, Shield, Users, Zap } from "lucide-react";

import Button from "@/components/ui/Button";

export default function Hero() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const prefersReducedMotion = useMemo(() => {
    if (typeof window === "undefined") return true;
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);

  const handleQuoteClick = () => {
    if (isLoading) return;
    setIsLoading(true);
    if (prefersReducedMotion) {
      router.push("/quote/school");
      return;
    }
    if (typeof window === "undefined") {
      router.push("/quote/school");
      return;
    }
    window.setTimeout(() => {
      router.push("/quote/school");
    }, 400);
  };

  return (
    <section id="hero" className="relative overflow-hidden bg-navy pb-0">
      <div className="mx-auto grid max-w-7xl gap-12 px-4 pt-24 pb-16 md:grid-cols-2 md:items-stretch">
        <div className="flex h-full flex-col">
          <p className="text-sm sm:text-base font-semibold tracking-widest uppercase text-white/70 mb-4">
            School Fee Protection Insurance
          </p>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-[1.1] mb-6">
            If something happens to you,{" "}
            <span className="text-[#D6336C]">your child still goes to school.</span>
          </h1>
          <p className="text-lg text-white/70 max-w-lg mb-8">
            Covers Kindy to Year 12. Get covered for less than the cost of a
            coffee a day.
          </p>
            <div className="mt-auto">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <Button
                size="lg"
                className="w-full sm:w-auto text-lg min-h-[56px] shadow-lg shadow-magenta/25"
                onClick={handleQuoteClick}
              >
                {isLoading ? (
                  <span className="inline-flex items-center gap-2">
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/70 border-t-white" />
                    Loading...
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-2">
                    Get Your Quote
                    <ArrowRight className="h-5 w-5" />
                  </span>
                )}
              </Button>
              <Link href="/how-it-works" className="w-full sm:w-auto">
                <Button
                  variant="secondary"
                  size="lg"
                  className="w-full text-lg min-h-[56px] bg-white/10 text-white border-white/20 hover:bg-white/20"
                >
                  See How It Works
                </Button>
              </Link>
            </div>
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 mt-6 text-sm text-white/60">
            <span className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-[#D6336C]" /> Underwritten by Lloyd's of London
            </span>
            <span className="flex items-center gap-2">
              <Users className="w-4 h-4 text-[#D6336C]" /> Parents & Students Cover
            </span>
            <span className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-[#D6336C]" /> Get covered in 2 minutes
            </span>
          </div>
          </div>
        </div>

        <div className="relative">
          <div className="rounded-3xl bg-white p-3 shadow-2xl ring-1 ring-white/10">
            <div className="relative aspect-[16/9] overflow-hidden rounded-2xl">
              <Image
                src="/images/hero/hero-stlukes-students.png"
                alt="Students in school uniforms"
                fill
                className="object-cover object-[center_20%]"
                sizes="(min-width: 768px) 50vw, 100vw"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-navy/30 to-transparent" />
            </div>
          </div>
        </div>
      </div>
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <ChevronDown className="w-6 h-6 text-white/40" />
      </div>
    </section>
  );
}
