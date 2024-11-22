"use client"

import { useEffect, useState } from "react"
import { Parser } from "htmlparser2"
import parse from "html-react-parser"

interface StreamingAiContentProps {
  currentStreamedResponse: string
  className?: string
  extractClassName?: string
}

export default function StreamingAiContent({
  currentStreamedResponse,
  className,
  extractClassName = "analysis",
}: StreamingAiContentProps) {
  const [extractedContent, setExtractedContent] = useState("")

  useEffect(() => {
    const parseContent = async () => {
      const content = await extractSingleDivFromStreamingHtml(
        currentStreamedResponse,
        extractClassName
      )
      setExtractedContent(content)
    }

    parseContent()
  }, [currentStreamedResponse, extractClassName])

  return (
    <div className="mt-4 p-4 bg-gray-100 rounded-md">
      <div>{parse(extractedContent)}</div>
    </div>
  )
}

const extractSingleDivFromStreamingHtml = (
  html: string,
  className: string
): Promise<string> => {
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
            depth = 0
          }

          if (capturing) {
            depth++
            capturedContent += `<${name}${Object.entries(attributes).reduce((acc, [key, value]) => `${acc} ${key}="${value}"`, "")}>`
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

        onend() {
          resolve(targetFound ? capturedContent : "")
        },
      },
      { decodeEntities: true, recognizeSelfClosing: true }
    )

    parser.write(html)
    parser.end()
  })
}

export function extractSingleDivFromHtml(
  html: string,
  className: string
): string {
  const tempDiv = document.createElement("div")
  tempDiv.innerHTML = html
  const targetElement = tempDiv.querySelector(`.${className}`)
  return targetElement ? targetElement.innerHTML : ""
}
