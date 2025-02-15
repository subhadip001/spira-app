"use client"
import { MessageCircleQuestion } from "lucide-react"

interface WhatsAppButtonProps {
  phoneNumber: string // Phone number including country code without '+' or spaces
  message?: string // Optional pre-filled message
}

const WhatsAppButton: React.FC<WhatsAppButtonProps> = ({
  phoneNumber,
  message = "",
}) => {
  const handleWhatsAppClick = () => {
    // Encode the message for URL
    const encodedMessage = encodeURIComponent(message)

    // Create WhatsApp URL
    const whatsappUrl = `https://wa.me/${phoneNumber}${message ? `?text=${encodedMessage}` : ""}`

    // Open in new tab
    window.open(whatsappUrl, "_blank")
  }

  return (
    <div
      className="absolute w-10 bg-green-500 text-white items-center justify-center cursor-pointer aspect-square flex rounded-full right-4 bottom-16 z-50"
      onClick={handleWhatsAppClick}
      role="button"
      aria-label="Chat on WhatsApp"
    >
      <div>
        <MessageCircleQuestion className="h-4 w-4" />
      </div>
    </div>
  )
}

export default WhatsAppButton
