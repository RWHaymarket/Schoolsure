"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowRight, Lock, ShieldCheck } from "lucide-react";

import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import InfoBox from "@/components/shared/InfoBox";
import StepTransition, { useStepTransition } from "@/components/quote/StepTransition";
import { formatFeeInput } from "@/lib/utils";
import { useQuoteStore } from "@/store/useQuoteStore";
import SchoolSearch from "@/components/quote/SchoolSearch";
import { School } from "@/data/schools";

function QuoteSchoolStepContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { startTransition, isTransitioning, buttonLabel, showButtonLoading } =
    useStepTransition();
  const {
    schoolId,
    schoolName,
    schoolSuburb,
    schoolPostcode,
    schoolState,
    schoolSector,
    annualFees,
    yearLevel,
    setSchoolDetails,
  } = useQuoteStore();
  const [errors, setErrors] = useState<string[]>([]);
  const preselectedSchoolName = searchParams.get("school");
  const preselectedSchoolId = searchParams.get("id");

  useEffect(() => {
    if (!preselectedSchoolName) return;
    if (schoolName) return;
    setSchoolDetails({
      schoolId: preselectedSchoolId || "",
      schoolName: preselectedSchoolName,
      schoolSuburb: schoolSuburb || "",
      schoolPostcode: schoolPostcode || "",
      schoolState: schoolState || "",
      schoolSector: schoolSector || "",
    });
  }, [
    preselectedSchoolName,
    preselectedSchoolId,
    schoolName,
    schoolSuburb,
    schoolPostcode,
    schoolState,
    schoolSector,
    setSchoolDetails,
  ]);

  const selectedSchool: School | null = schoolId
    ? {
        id: schoolId,
        name: schoolName,
        suburb: schoolSuburb,
        postcode: schoolPostcode,
        state: schoolState,
        sector: schoolSector || "Independent",
        fees: annualFees || undefined,
      }
    : null;

  const handleContinue = () => {
    if (isTransitioning) return;
    const nextErrors = [];
    if (!schoolName) nextErrors.push("School name is required.");
    if (!annualFees) nextErrors.push("Annual fees are required.");
    if (!yearLevel) nextErrors.push("Year level is required.");
    setErrors(nextErrors);
    if (nextErrors.length === 0) {
      startTransition({
        message: "Preparing your cover options...",
        onComplete: () => router.push("/quote/coverage"),
      });
    }
  };

  return (
    <section className="bg-white">
      <div className="mx-auto max-w-5xl px-4 py-12">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-grey-500">
              Step 1 of 4
            </p>
            <h1 className="text-h1 text-navy tracking-tight">Your school</h1>
            <p className="mt-3 text-lg text-grey-700">
              Find your school and enter annual fees to begin your quote.
            </p>
          </div>
          <div className="text-sm text-grey-500">
            Takes about 2 minutes to complete
          </div>
        </div>

        <Card className="mt-8 border border-grey-100 shadow-[0_16px_40px_rgba(15,23,42,0.12)]">
          <div className="grid gap-8">
            <div>
              <label className="mb-2 block text-small font-medium text-navy">
                School name
              </label>
              <SchoolSearch
                value={selectedSchool}
                onSelect={(school) =>
                  setSchoolDetails({
                    schoolId: school.id,
                    schoolName: school.name,
                    schoolSuburb: school.suburb,
                    schoolPostcode: school.postcode,
                    schoolState: school.state,
                    schoolSector: school.sector,
                    annualFees: school.fees || annualFees,
                  })
                }
                onFeesChange={(fees) => setSchoolDetails({ annualFees: fees })}
                onQueryChange={(value) =>
                  setSchoolDetails({ schoolName: value, schoolId: "" })
                }
                initialSchoolName={preselectedSchoolName}
                initialSchoolId={preselectedSchoolId}
              />
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-small font-medium text-navy">
                  Annual school fees (AUD)
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-grey-500">
                    $
                  </span>
                  <Input
                    className="pl-8"
                    placeholder="35,000"
                    inputMode="numeric"
                    value={formatFeeInput(String(annualFees || ""))}
                    onChange={(event) =>
                      setSchoolDetails({
                        annualFees: Number(
                          event.target.value.replace(/\D/g, "")
                        ),
                      })
                    }
                  />
                </div>
              </div>
              <div>
                <label className="mb-2 block text-small font-medium text-navy">
                  Current year level
                </label>
                <select
                  className="h-[52px] w-full rounded-[10px] border-2 border-transparent bg-grey-100 px-4 text-base text-navy transition-all duration-150 ease-out focus:border-navy focus:bg-white focus:outline-none focus:ring-4 focus:ring-navy/10"
                  value={yearLevel}
                  onChange={(event) =>
                    setSchoolDetails({ yearLevel: event.target.value })
                  }
                >
                  <option value="" disabled>
                    Select year level
                  </option>
                  <option>Kindergarten</option>
                  <option>Year 1</option>
                  <option>Year 2</option>
                  <option>Year 3</option>
                  <option>Year 4</option>
                  <option>Year 5</option>
                  <option>Year 6</option>
                  <option>Year 7</option>
                  <option>Year 8</option>
                  <option>Year 9</option>
                  <option>Year 10</option>
                  <option>Year 11</option>
                  <option>Year 12</option>
                </select>
              </div>
            </div>

            <InfoBox variant="tip">
              Not sure about fees? Check your fee schedule or recent invoice.
              Include tuition only — uniforms and extras are separate.
            </InfoBox>

            {errors.length ? (
              <div className="rounded-xl border border-grey-300 bg-grey-100 p-4 text-sm text-grey-700">
                {errors.map((error) => (
                  <div key={error}>• {error}</div>
                ))}
              </div>
            ) : null}

            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-4 text-xs text-grey-500">
                <span className="inline-flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-magenta" />
                  AFSL 530784
                </span>
                <span className="inline-flex items-center gap-2">
                  <Lock className="h-4 w-4 text-magenta" />
                  Secure and encrypted
                </span>
              </div>
              <Button onClick={handleContinue}>
                {showButtonLoading ? (
                  <span className="inline-flex items-center gap-2">
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/70 border-t-white" />
                    {buttonLabel}
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-2">
                    Continue
                    <ArrowRight className="h-4 w-4" />
                  </span>
                )}
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
}

export default function QuoteSchoolStep() {
  return (
    <Suspense fallback={<div />}>
      <StepTransition>
        <QuoteSchoolStepContent />
      </StepTransition>
    </Suspense>
  );
}
