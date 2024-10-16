import Sidebar from "@/app/_components/dashboard-components/sidebar"

export default function Dashboard() {
  return (
    <div className="bg-white w-[100vw] flex border-t">
      <Sidebar />
      <section className="px-2 flex-grow">
        <h1 className="text-2xl font-bold">Your Forms</h1>
      </section>
    </div>
  )
}
