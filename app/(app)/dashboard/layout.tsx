import React from "react"
import { Metadata } from "next"
import Header from "@/app/_components/header"

export const metadata: Metadata = {
  title: "Dashboard",
  description: "User dashboard for managing account and activities",
}

interface DashboardLayoutProps {
  children: React.ReactNode
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  return (
    <div className="dashboard-layout bg-white w-[100vw] min-h-[100svh]">
      <Header />
      <main>{children}</main>
    </div>
  )
}

export default DashboardLayout
