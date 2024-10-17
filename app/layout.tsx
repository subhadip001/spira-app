import type { Metadata } from "next"
import { Inter as FontSans } from "next/font/google"
import "./globals.css"
import { cn } from "@/lib/utils"
import ReactQueryProvider from "@/app/_components/react-query-provider"
import { Toaster } from "react-hot-toast"
import { ThemeProvider } from "@/components/theme-provider"

export const metadata: Metadata = {
  title: "Spira - Ai powered form builder",
  description:
    "Spira is an AI powered google form alternative. It helps you create forms, surveys and quizzes in seconds.",
}

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <ReactQueryProvider>
        <body
          className={cn(
            "min-h-screen flex font-sans antialiased",
            fontSans.variable
          )}
        >
          <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
            <div className="flex-grow z-10">{children}</div>
            <Toaster position="top-right" />
          </ThemeProvider>
        </body>
      </ReactQueryProvider>
    </html>
  )
}
