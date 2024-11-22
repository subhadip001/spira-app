import { Search, Upload } from "lucide-react"
import ResponsePicker from "./components/response-picker"

export default function Dashboard() {
  return (
    <div className="flex flex-col h-screen">
      <section className="flex flex-col flex-grow px-2">
        <h1 className="text-2xl font-bold text-muted-foreground">Analytics</h1>
        <div className="flex flex-grow justify-center items-center py-10">
          <ResponsePicker />
        </div>
      </section>
    </div>
  )
}