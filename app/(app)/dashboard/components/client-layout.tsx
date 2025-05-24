"use client"

import React from "react"
import { AppSidebar } from "@/components/ui/app-sidebar"

interface ClientLayoutProps {
  children: React.ReactNode
}

const ClientLayout: React.FC<ClientLayoutProps> = ({ children }) => {
  return (
    <div className="dashboard-layout bg-white w-full flex flex-col min-h-screen">
      <main className="flex flex-grow w-full border-t">
        <AppSidebar />
        <section className="flex-grow p-4">{children}</section>
      </main>
    </div>
  )
}

export default ClientLayout
