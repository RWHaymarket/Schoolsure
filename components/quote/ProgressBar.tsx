"use client";

import { Check } from "lucide-react";
import Link from "next/link";

interface ProgressBarProps {
  currentStep: 1 | 2 | 3 | 4;
}

const steps = [
  { number: 1, label: "Your School", path: "/quote/school" },
  { number: 2, label: "Coverage", path: "/quote/coverage" },
  { number: 3, label: "Your Details", path: "/quote/details" },
  { number: 4, label: "Review", path: "/quote/review" },
];

export default function ProgressBar({ currentStep }: ProgressBarProps) {
  return (
    <div className="w-full">
      <div className="relative">
        <div className="absolute left-4 right-4 top-5 h-0.5 bg-grey-200" />
        <div className="grid grid-cols-4 gap-2">
          {steps.map((step) => {
            const isActive = step.number === currentStep;
            const isComplete = step.number < currentStep;
            return (
              <div key={step.label} className="flex flex-col items-center text-center">
                {isComplete ? (
                  <Link
                    href={step.path}
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-navy shadow-sm"
                    aria-label={`Go to ${step.label}`}
                  >
                    <Check className="h-5 w-5 text-white" />
                  </Link>
                ) : (
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-full border-2 text-sm font-semibold ${
                      isActive
                        ? "border-magenta bg-magenta text-white"
                        : "border-grey-300 text-grey-400 bg-white"
                    }`}
                    aria-current={isActive ? "step" : undefined}
                  >
                    {step.number}
                  </div>
                )}
                <span
                  className={`mt-2 text-sm font-medium ${
                    isActive ? "text-navy" : "text-grey-500"
                  }`}
                >
                  {step.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
