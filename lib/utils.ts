import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-AU", {
    style: "currency",
    currency: "AUD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatCurrencyWithCents(amount: number): string {
  return new Intl.NumberFormat("en-AU", {
    style: "currency",
    currency: "AUD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function formatFeeInput(value: string): string {
  const numbers = value.replace(/\D/g, "");
  if (!numbers) return "";
  return Number(numbers).toLocaleString("en-AU");
}

export function formatPhone(value: string): string {
  const numbers = value.replace(/\D/g, "");
  if (numbers.length <= 4) return numbers;
  if (numbers.length <= 7) return `${numbers.slice(0, 4)} ${numbers.slice(4)}`;
  return `${numbers.slice(0, 4)} ${numbers.slice(4, 7)} ${numbers.slice(7, 10)}`;
}
