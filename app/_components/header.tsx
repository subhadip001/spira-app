"use client"

import { cn } from "@/lib/utils"
import dynamic from "next/dynamic"
import React, { useState, useCallback, useRef, useEffect } from "react"
import { Icons } from "./icons"
import { parse, Allow } from "partial-json"

type HeaderProps = {
  className?: string
}

const UserDropdown = dynamic(() => import("./user-dropdown"), {
  ssr: false,
})

interface FormField {
  constantId: number
  serialId: number
  type: string
  label: string
  description: string
  name: string
  placeholder?: string
  required: boolean
  options?: { label: string; value: string }[]
  accept?: string
  maxSize?: string
}

interface FormSchema {
  title: string
  description: string
  headerBackground: string
  fields: FormField[]
}

const Header: React.FC<HeaderProps> = ({ className }) => {
  const [streamContent, setStreamContent] = useState<string>("")
  const [formSchema, setFormSchema] = useState<Partial<FormSchema> | null>(null)
  const abortControllerRef = useRef<AbortController | null>(null)

  const generateFormSchema = useCallback(async () => {
    setStreamContent("")
    setFormSchema(null)

    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }
    abortControllerRef.current = new AbortController()

    try {
      const response = await fetch("/api/generate-form-schema", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt: "fullstack developer" }),
        signal: abortControllerRef.current.signal,
      })

      if (response.ok && response.body) {
        const reader = response.body.getReader()
        const decoder = new TextDecoder()

        let buffer = ""
        while (true) {
          const { done, value } = await reader.read()
          if (done) break
          const chunk = decoder.decode(value, { stream: true })

          buffer += chunk
          setStreamContent((prevContent) => prevContent + chunk)

          try {
            const parsedJson = parse(buffer, Allow.ALL) as Partial<FormSchema>
            setFormSchema(parsedJson)
          } catch (parseError) {
            // If parsing fails, it means the JSON is incomplete
            // We'll continue to accumulate more data
          }
        }

        // Final parse attempt after the stream is complete
        try {
          const finalParsedJson = parse(buffer) as FormSchema
          setFormSchema(finalParsedJson)
        } catch (finalParseError) {
          console.error("Error parsing final JSON:", finalParseError)
        }
      }
    } catch (error) {
      if (error) {
        console.error("Error generating form schema:", error)
      }
    }
  }, [])

  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }
    }
  }, [])

  const renderFormPreview = useCallback(() => {
    if (!formSchema) return null

    return (
      <div className="mt-4 p-4 border rounded-md">
        <h2
          className="text-2xl font-bold"
          style={{ color: formSchema.headerBackground }}
        >
          {formSchema.title}
        </h2>
        <p className="mt-2">{formSchema.description}</p>
        {formSchema.fields?.map((field) => (
          <div key={field.constantId} className="mt-4">
            <label className="block font-semibold">{field.label}</label>
            <p className="text-sm text-gray-600">{field.description}</p>
            {renderField(field)}
          </div>
        ))}
      </div>
    )
  }, [formSchema])

  const renderField = (field: FormField) => {
    switch (field.type) {
      case "text":
      case "email":
      case "tel":
        return (
          <input
            type={field.type}
            name={field.name}
            placeholder={field.placeholder}
            className="mt-1 w-full p-2 border rounded"
            required={field.required}
          />
        )
      case "textarea":
        return (
          <textarea
            name={field.name}
            placeholder={field.placeholder}
            className="mt-1 w-full p-2 border rounded"
            required={field.required}
          />
        )
      case "select":
        return (
          <select
            name={field.name}
            className="mt-1 w-full p-2 border rounded"
            required={field.required}
          >
            <option value="">{field.placeholder}</option>
            {field.options?.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        )
      case "checkbox":
      case "radio":
        return (
          <div className="mt-1">
            {field.options?.map((option) => (
              <label key={option.value} className="block">
                <input
                  type={field.type}
                  name={field.name}
                  value={option.value}
                  className="mr-2"
                />
                {option.label}
              </label>
            ))}
          </div>
        )
      case "file":
        return (
          <input
            type="file"
            name={field.name}
            accept={field.accept}
            className="mt-1"
            required={field.required}
          />
        )
      default:
        return null
    }
  }

  return (
    <div className={cn(className, "flex flex-col justify-between py-3 px-5")}>
      <div className="flex justify-between">
        <div>
          <Icons.logo />
        </div>
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded-md"
          onClick={generateFormSchema}
        >
          Generate Form
        </button>
        <UserDropdown />
      </div>
      <div className="mt-4">
        <h3 className="font-semibold">Form Preview:</h3>
        {renderFormPreview()}
      </div>
      {/* <div className="mt-4">
        <h3 className="font-semibold">Parsed Form Schema:</h3>
        <pre className="mt-2 bg-gray-100 p-4 rounded overflow-auto max-h-96">
          {JSON.stringify(formSchema, null, 2)}
        </pre>
      </div> */}
    </div>
  )
}

export default Header
