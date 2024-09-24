import type { Metadata } from "next";
import { Inter as FontSans } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import ReactQueryProvider from "@/app/_components/react-query-provider";
import { Toaster } from "react-hot-toast";
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
      <ReactQueryProvider>
        <body
          className={cn(
            "min-h-screen flex bg-[#F3F3ED] font-sans antialiased",
            fontSans.variable
          )}
        >
          <div className="absolute w-full h-full overflow-hidden">
            <video
              src="https://w06x29rjhxvpmsmw.public.blob.vercel-storage.com/videos/bg-IfZJXb3k8lYIUWixRaliM7LTCj12v0.mp4"
              autoPlay
              loop
              muted
              style={{
                position: "absolute",
                width: "100%",
                left: "50%",
                top: "50%",
                height: "100%",
                objectFit: "cover",
                transform: "translate(-50%, -50%)",
                zIndex: "-1",
              }}
            />
          </div>
          <div className="flex-grow z-10">{children}</div>
          <Toaster />
        </body>
      </ReactQueryProvider>
    </html>
  );
}
