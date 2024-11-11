import { Select, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus } from "lucide-react"
import Link from "next/link"
import FormsContainer from "./components/forms-container"

export default async function Dashboard() {
  return (
    <div className="">
      <section className="px-2 flex-grow flex flex-col gap-4">
        <h1 className="text-2xl font-bold text-muted-foreground">Your Forms</h1>
        <div className="actions flex justify-between">
          <div className="filters flex items-center gap-2">
            <span className="text-muted-foreground text-sm">Show:</span>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="All Forms" />
              </SelectTrigger>
            </Select>
          </div>
          <Link
            href="/"
            className="bg-spirablue text-white px-4 py-2 rounded-md flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            New Form
          </Link>
        </div>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <h2 className="text-muted-foreground">All Forms</h2>
            <div className="flex flex-col gap-2">
              <FormsContainer />
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
