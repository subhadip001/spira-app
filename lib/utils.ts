import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const quickStartQueries = [
  {
    id: 1,
    query: "User feedback survey",
  },
  {
    id: 2,
    query: "A job application form",
  },
  {
    id: 3,
    query: "Form for e-bike market research",
  },
  {
    id: 4,
    query: "Make a quiz about India",
  },
]
