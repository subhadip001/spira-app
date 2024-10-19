import React from "react"
import { Button } from "@/components/ui/button"
import { Icons } from "../icons"
import { Check } from "lucide-react"

interface ThankYouPageProps {
  onReset: () => void
}

const ThankYouPage: React.FC<ThankYouPageProps> = ({ onReset }) => {
  return (
    <div className="flex flex-col items-center justify-center space-y-4 text-center">
      <div className="bg-green-200 rounded-full p-5">
        <Check className="text-green-500" size={40} />
      </div>
      <h2 className="text-2xl font-bold">Thank You!</h2>
      <p className="text-lg">Your response has been successfully submitted.</p>
      <Button onClick={onReset} variant="outline">
        Submit Another Response
      </Button>
    </div>
  )
}

export default ThankYouPage
