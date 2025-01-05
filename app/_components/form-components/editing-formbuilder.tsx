import React, { useState, useEffect } from "react"
import FormBuilder from "./FormBuilder"
import { FormSchema } from "@/types/FormSchema"

type EditingFormBuilderProps = {
  currentFormSchema: FormSchema
  streamedFormSchema?: Partial<FormSchema>
  className?: string
  published?: boolean
  editable?: boolean
}

const EditingFormBuilder = ({
  currentFormSchema,
  streamedFormSchema,
  className,
  published = false,
  editable = true,
}: EditingFormBuilderProps) => {
  const [scanPosition, setScanPosition] = useState(0)

  // Effect to animate the scanner
  useEffect(() => {
    const interval = setInterval(() => {
      setScanPosition((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          return 100
        }
        return prev + 0.5
      })
    }, 20)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="relative">
      {/* Original Form */}
      <div className={`${className} relative`}>
        <FormBuilder
          initialSchema={currentFormSchema}
          published={published}
          editable={false}
        />
      </div>

      {/* Scanner Overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `linear-gradient(
            to bottom,
            rgba(255, 255, 255, 0) ${scanPosition}%,
            rgba(0, 123, 255, 0.1) ${scanPosition}%,
            rgba(0, 123, 255, 0.1) ${scanPosition + 2}%,
            rgba(255, 255, 255, 0) ${scanPosition + 2}%
          )`,
        }}
      />

      {/* Updated Form with Clip */}
      <div
        className={`absolute top-0 left-0 w-full ${className}`}
        style={{
          clipPath: `polygon(0 0, 100% 0, 100% ${scanPosition}%, 0 ${scanPosition}%)`,
        }}
      >
        <FormBuilder
          initialSchema={streamedFormSchema as FormSchema}
          published={published}
          editable={editable}
        />
      </div>
    </div>
  )
}

export default EditingFormBuilder
