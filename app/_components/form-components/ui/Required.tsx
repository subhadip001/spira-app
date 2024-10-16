import { Asterisk } from "lucide-react"

export const Required = () => {
  return (
    <div className="inline-flex items-center justify-center w-3 h-3 rounded-full bg-gray-200 text-gray-600">
      <Asterisk className="w-3 h-3" />
    </div>
  )
}
