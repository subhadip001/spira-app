import React from "react"
import { Button } from "@/components/ui/button"
import { Icons } from "../icons"
import { Check, Sparkles } from "lucide-react"

interface ThankYouPageProps {
  onReset: () => void
}

const ThankYouPage: React.FC<ThankYouPageProps> = ({ onReset }) => {
  return (
    <div className="flex flex-col h-screen items-center justify-center space-y-4 text-center">
      <div className="bg-green-200 rounded-full p-5">
        <Check className="text-green-500" size={40} />
      </div>
      <h3 className="text-2xl">Thanks for completing this Spiraform</h3>
      <span>
        Now create your own with Spira AI — it's free, fastest & beautiful
      </span>
      <div>
        <Button
          className="w-full bg-spirablue hover:bg-blue-500"
          onClick={() => {
            window.open(process.env.NEXT_PUBLIC_SITE_URL, "_blank")
          }}
        >
          <div className="flex items-center gap-2 font-semibold text-xl">
            <div>
              <Sparkles className="w-4 h-4" />
            </div>
            Create a form
          </div>
        </Button>
      </div>
    </div>
  )
}

export default ThankYouPage
