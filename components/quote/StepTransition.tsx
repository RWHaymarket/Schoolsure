"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

type TransitionOptions = {
  message: string;
  onComplete: () => void;
  buttonLabel?: string;
  minDelay?: number;
  maxDelay?: number;
};

type StepTransitionContextValue = {
  startTransition: (options: TransitionOptions) => void;
  isTransitioning: boolean;
  buttonLabel: string;
  showButtonLoading: boolean;
};

const StepTransitionContext = createContext<StepTransitionContextValue | null>(
  null
);

export function useStepTransition() {
  const context = useContext(StepTransitionContext);
  if (!context) {
    throw new Error("useStepTransition must be used within StepTransition");
  }
  return context;
}

export default function StepTransition({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [message, setMessage] = useState("");
  const [buttonLabel, setButtonLabel] = useState("Preparing...");
  const [showButtonLoading, setShowButtonLoading] = useState(false);
  const timeoutRef = useRef<number | null>(null);

  const prefersReducedMotion = useMemo(() => {
    if (typeof window === "undefined") return true;
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);

  const startTransition = useCallback(
    ({
      message: nextMessage,
      onComplete,
      buttonLabel: nextButtonLabel = "Preparing...",
      minDelay = 800,
      maxDelay = 1200,
    }: TransitionOptions) => {
      if (prefersReducedMotion) {
        onComplete();
        return;
      }

      setMessage(nextMessage);
      setButtonLabel(nextButtonLabel);
      setIsTransitioning(true);
      setShowButtonLoading(false);

      window.setTimeout(() => {
        setShowButtonLoading(true);
      }, 150);

      const delay =
        Math.floor(Math.random() * (maxDelay - minDelay + 1)) + minDelay;
      timeoutRef.current = window.setTimeout(() => {
        onComplete();
      }, delay);
    },
    [prefersReducedMotion]
  );

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const value = useMemo(
    () => ({
      startTransition,
      isTransitioning,
      buttonLabel,
      showButtonLoading,
    }),
    [buttonLabel, isTransitioning, showButtonLoading, startTransition]
  );

  return (
    <StepTransitionContext.Provider value={value}>
      <div className="relative">
        {children}
        {isTransitioning ? (
          <div className="absolute inset-0 z-50 flex items-center justify-center bg-white/90 backdrop-blur-sm">
            <div className="flex flex-col items-center">
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-grey-300 border-t-magenta" />
              <div className="mt-4 text-[16px] font-semibold text-navy pulse-soft">
                {message}
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </StepTransitionContext.Provider>
  );
}
