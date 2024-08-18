import type { Metadata } from "next";
import { Inter as FontSans } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import Header from "./components/header";
import Sidebar from "./components/sidebar";

export const metadata: Metadata = {
  title: "Spira - Ai powered form builder",
  description:
    "Spira is an AI powered google form alternative. It helps you create forms, surveys and quizzes in seconds.",
};

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body
        className={cn(
          "min-h-screen flex bg-background font-sans antialiased",
          fontSans.variable
        )}
      >
        <Header className="hidden" />
        <Sidebar className="" />
        <div className="flex-grow">{children}</div>
      </body>
    </html>
  );
}
