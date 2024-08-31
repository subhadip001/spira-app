import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const fileSizeConverter = (bytes: number): string => {
  const megabytes = bytes / (1024 * 1024);
  if (megabytes >= 1000) {
    const gigabytes = megabytes / 1024;
    return `${gigabytes.toFixed(2)} GB`;
  } else {
    return `${megabytes.toFixed(2)} MB`;
  }
};
