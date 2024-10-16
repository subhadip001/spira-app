"use client"
import React from "react"
import Header from "../header"
import useAppStore from "@/store/appStore"
import Sidebar from "./sidebar"

interface ClientLayoutProps {
  children: React.ReactNode
}

const ClientLayout: React.FC<ClientLayoutProps> = ({ children }) => {
  const user = useAppStore((state) => state.user)
  return (
    <div className="dashboard-layout bg-white w-[100vw] flex flex-col min-h-[100svh]">
      <Header />
      <main className="flex flex-grow w-full border-t">
        <Sidebar />
        {children}
      </main>
    </div>
  )
}

export default ClientLayout
