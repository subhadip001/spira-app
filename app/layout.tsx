import type { Metadata } from "next"
import { Inter as FontSans } from "next/font/google"
import "./globals.css"
import { cn } from "@/lib/utils"
import ReactQueryProvider from "@/app/_components/react-query-provider"
import { Toaster } from "react-hot-toast"
import { ThemeProvider } from "@/components/theme-provider"

const ogImage =
  "https://ytyftdvatzggzgniwjrw.supabase.co/storage/v1/object/public/spira-micro/spira-image.png"

const title = "Spira - AI first form builder"
const description =
  "Spira is an AI powered google form alternative. It helps you create forms, surveys in seconds."
const url = "https://heyspira.com"
const siteName = "heyspira.com"
const keywords = "spira, ai, google form, form builder, survey"

export const metadata: Metadata = {
  metadataBase: new URL(url),
  title,
  description,
  icons: {
    icon: "/favicon.ico",
  },
  keywords,
  openGraph: {
    images: [ogImage],
    title,
    description,
    url: url,
    siteName: siteName,
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    images: [ogImage],
    title,
    description,
  },
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
