import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatNumber(num: number, decimals: number = 2): string {
  return num.toFixed(decimals).replace(/\B(?=(\d{3})+(?!\d))/g, ",")
}

export function formatCO2(kg: number): string {
  if (kg >= 1000) {
    return `${formatNumber(kg / 1000, 2)} tonnes`
  }
  return `${formatNumber(kg, 2)} kg`
}
