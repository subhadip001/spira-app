"use client"

import { useEffect, useState } from "react"
import { Parser } from "htmlparser2"
import parse from "html-react-parser"

interface StreamingAiContentProps {
  currentStreamedResponse: string
  className?: string
  loadingMessage?: string
}

export default function StreamingAiContent({
  currentStreamedResponse,
  className = "analysis",
  loadingMessage = "Response will appear here...",
}: StreamingAiContentProps) {
  const [extractedContent, setExtractedContent] = useState("")

  useEffect(() => {
    const extractSingleDivFromStreamingHtml = (
      html: string,
      className: string
    ) => {
      return new Promise((resolve) => {
        let depth = 0
        let capturing = false
        let capturedContent = ""

        const parser = new Parser({
          onopentag(name, attributes) {
            if (name === "div" && attributes.class?.includes(className)) {
              capturing = true
            }
            if (capturing) {
              depth++
              capturedContent += `<${name}`
              for (const [key, value] of Object.entries(attributes)) {
                capturedContent += ` ${key}="${value}"`
              }
              capturedContent += ">"
            }
          },
          ontext(text) {
            if (capturing) {
              capturedContent += text
            }
          },
          onclosetag(tagname) {
            if (capturing) {
              depth--
              capturedContent += `</${tagname}>`
              if (depth === 0) {
                capturing = false
                resolve(capturedContent)
              }
            }
          },
        })

        parser.write(html)
        parser.end()
      })
    }

    extractSingleDivFromStreamingHtml(currentStreamedResponse, className)
      .then((content) => setExtractedContent(content as string))
      .catch(console.error)
  }, [currentStreamedResponse, className])

  return (
    <div className="mt-4 p-4 bg-gray-100 rounded-md min-h-[100px]">
      {extractedContent.length > 0 ? (
        <div>{parse(extractedContent)}</div>
      ) : (
        <div>{loadingMessage}</div>
      )}
    </div>
  )
}

export function extractSingleDivFromHtml(
  html: string,
  className: string
): string {
  try {
    // Create a new DOMParser instance
    const parser = new DOMParser()

    // Parse the HTML string into a DOM document
    const doc = parser.parseFromString(html, "text/html")

    // Find the element with the specified class
    const targetElement = doc.querySelector(`.${className}`)

    // Return the HTML content of the found element, or empty string if not found
    return targetElement?.innerHTML || ""
  } catch (error) {
    console.error("Error parsing HTML:", error)
    return ""
  }
}
