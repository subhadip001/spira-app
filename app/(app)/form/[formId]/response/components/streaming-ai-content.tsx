"use client"

import { useEffect, useState } from "react"
import { Parser } from "htmlparser2"
import parse from "html-react-parser"

interface StreamingAiContentProps {
  currentStreamedResponse: string
  className?: string
}

export default function StreamingAiContent({
  currentStreamedResponse,
  className = "analysis",
}: StreamingAiContentProps) {
  const [extractedContent, setExtractedContent] = useState("")

  useEffect(() => {
    let isMounted = true

    const parseContent = async () => {
      const content = await extractSingleDivFromStreamingHtml(
        currentStreamedResponse,
        className
      )
      if (isMounted) {
        setExtractedContent(content as string)
      }
    }

    parseContent()

    return () => {
      isMounted = false
    }
  }, [currentStreamedResponse, className])

  return (
    <div className="mt-4 p-4 bg-gray-100 rounded-md">
      <div>{parse(extractedContent)}</div>
    </div>
  )
}

const extractSingleDivFromStreamingHtml = (html: string, className: string) => {
  return new Promise((resolve) => {
    let depth = 0
    let capturing = false
    let capturedContent = ""
    let targetFound = false

    const parser = new Parser(
      {
        onopentag(name, attributes) {
          if (
            !targetFound &&
            name === "div" &&
            attributes.class?.includes(className)
          ) {
            capturing = true
            targetFound = true
          }

          if (capturing) {
            depth++
            // Reconstruct the opening tag with attributes
            capturedContent += `<${name}`
            for (const [key, value] of Object.entries(attributes)) {
              capturedContent += ` ${key}="${value}"`
            }
            capturedContent += ">"
          }
        },

        ontext(text) {
          if (capturing) {
            // Preserve whitespace in text content
            capturedContent += text
          }
        },

        onclosetag(tagname) {
          if (capturing) {
            capturedContent += `</${tagname}>`
            depth--

            if (depth === 0 && targetFound) {
              capturing = false
              resolve(capturedContent)
            }
          }
        },

        onerror(error) {
          console.error("Parser error:", error)
          resolve("")
        },

        onend() {
          if (capturing) {
            // If we're still capturing when the parser ends, resolve with what we have
            resolve(capturedContent)
          } else if (!targetFound) {
            // If we never found the target div, resolve with empty string
            resolve("")
          }
        },
      },
      {
        decodeEntities: true,
        xmlMode: false,
        recognizeSelfClosing: true,
      }
    )

    try {
      parser.write(html)
      parser.end()
    } catch (error) {
      console.error("Parser error:", error)
      resolve("")
    }
  })
}

// Fallback parser using DOMParser for non-streaming cases
export function extractSingleDivFromHtml(
  html: string,
  className: string
): string {
  try {
    const parser = new DOMParser()
    const doc = parser.parseFromString(html, "text/html")
    const targetElement = doc.querySelector(`.${className}`)
    return targetElement?.innerHTML || ""
  } catch (error) {
    console.error("Error parsing HTML:", error)
    return ""
  }
}
