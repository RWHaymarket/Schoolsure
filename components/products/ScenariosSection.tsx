"use client";

import {
  BookOpen,
  Brain,
  Briefcase,
  Bus,
  GraduationCap,
  Heart,
  HeartPulse,
  Home,
  Shield,
  ShieldCheck,
  Shirt,
  Users,
} from "lucide-react";

export type IconKey =
  | "book-open"
  | "brain"
  | "briefcase"
  | "bus"
  | "graduation-cap"
  | "heart"
  | "heart-pulse"
  | "home"
  | "shield"
  | "shield-check"
  | "shirt"
  | "users";

export const ICONS: Record<
  IconKey,
  React.ComponentType<{ className?: string }>
> = {
  "book-open": BookOpen,
  brain: Brain,
  briefcase: Briefcase,
  bus: Bus,
  "graduation-cap": GraduationCap,
  heart: Heart,
  "heart-pulse": HeartPulse,
  home: Home,
  shield: Shield,
  "shield-check": ShieldCheck,
  shirt: Shirt,
  users: Users,
};

type Scenario = {
  title: string;
  story: string;
  outcome: string;
  tag: string;
  icon: IconKey;
};

export default function ScenariosSection({
  heading,
  scenarios,
}: {
  heading: string;
  scenarios: Scenario[];
}) {
  return (
    <div className="mx-auto max-w-[960px] px-6">
      <h2 className="text-center text-[28px] font-black text-navy">{heading}</h2>
      <div className="mt-10 grid gap-6 md:grid-cols-3">
        {scenarios.map((scenario) => {
          const ScenarioIcon = ICONS[scenario.icon];
          return (
            <div
              key={scenario.title}
              className="rounded-2xl border border-grey-300 bg-white p-7"
            >
              <ScenarioIcon className="h-6 w-6 text-navy" />
              <div className="mt-3 text-[18px] font-semibold text-navy">
                {scenario.title}
              </div>
              <p className="mt-2 text-[14px] leading-relaxed text-grey-700">
                {scenario.story}
              </p>
              <div className="my-4 h-px bg-grey-300" />
              <div className="text-[12px] font-semibold uppercase text-grey-500">
                Outcome
              </div>
              <div className="mt-2 text-[14px] font-semibold text-navy">
                {scenario.outcome}
              </div>
              <div className="mt-3 text-[12px] font-semibold text-magenta">
                {scenario.tag}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
