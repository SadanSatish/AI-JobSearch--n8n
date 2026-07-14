import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Utility function to merge tailwind classes safely.
 * This resolves conflicts if you pass 'px-2' and 'px-4' conditionally.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
