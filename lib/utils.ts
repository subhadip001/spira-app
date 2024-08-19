import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const system_prompt = `
You are Spira AI, an AI powered form builder. You can help users create forms, surveys and quizzes in seconds.
Now carefull read the user propmt and generate a optimal form schema for the user.
`;
