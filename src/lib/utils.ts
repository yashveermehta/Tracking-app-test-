import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Utility to smartly merge Tailwind utility classes
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCapacityPercentage(currentLoad: number, capacity: number): number {
  if (capacity === 0) return 0;
  return Math.round((currentLoad / capacity) * 100);
}
