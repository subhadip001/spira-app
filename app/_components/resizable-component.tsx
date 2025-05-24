"use client"
import React, { useState, useCallback, useEffect, MouseEvent } from "react"
import { useMediaQuery } from "react-responsive"

type HorizontalResizableComponentProps = {
  children: React.ReactNode
  minWidth?: number
  maxWidth?: number
  initialWidth: number
  className?: string
}

const HorizontalResizableComponent: React.FC<
  HorizontalResizableComponentProps
> = ({
  children,
  minWidth = 300,
  maxWidth = Infinity,
  initialWidth,
  className = "",
}) => {
  const [width, setWidth] = useState<number>(initialWidth)
  const [isResizing, setIsResizing] = useState<boolean>(false)
  const [startX, setStartX] = useState<number>(0)
  const [startWidth, setStartWidth] = useState<number>(initialWidth)
  const [resizeOrigin, setResizeOrigin] = useState<"left" | "right" | null>(
    null
  )
  const isSmallScreen = useMediaQuery({ query: "(max-width: 920px)" })

  useEffect(() => {
    setWidth(initialWidth)
  }, [initialWidth])

  const startResize = useCallback(
    (origin: "left" | "right") => (e: React.MouseEvent) => {
      e.preventDefault()
      setIsResizing(true)
      setStartX(e.clientX)
      setStartWidth(width)
      setResizeOrigin(origin)
    },
    [width]
  )

  const stopResize = useCallback(() => {
    setIsResizing(false)
    setResizeOrigin(null)
  }, [])

  const resize = useCallback(
    (e: MouseEvent) => {
      if (!isResizing || !resizeOrigin) return

      const diff = e.clientX - startX
      let newWidth: number

      if (resizeOrigin === "right") {
        newWidth = startWidth + diff * 2
      } else {
        newWidth = startWidth - diff * 2
      }

      newWidth = Math.max(minWidth, Math.min(newWidth, maxWidth))
      setWidth(newWidth)
    },
    [isResizing, startX, startWidth, minWidth, maxWidth, resizeOrigin]
  )

  useEffect(() => {
    if (isResizing) {
      const handleMouseMove = (e: globalThis.MouseEvent) =>
        resize(e as unknown as MouseEvent)
      const handleMouseUp = () => stopResize()

      window.addEventListener("mousemove", handleMouseMove)
      window.addEventListener("mouseup", handleMouseUp)

      return () => {
        window.removeEventListener("mousemove", handleMouseMove)
        window.removeEventListener("mouseup", handleMouseUp)
      }
    }
  }, [isResizing, resize, stopResize])

  if (isSmallScreen) {
    return children as React.ReactElement
  }

  return (
    <div
      className={`relative ${className}`}
      style={{
        width: `${width}px`,
        maxWidth: "100%",
        height: "100%",
      }}
    >
      <div className="absolute w-full -translate-y-[50%] top-[50%] ">
        {children}
      </div>
      <div
        className="absolute top-[50%] -translate-y-[50%] left-0 w-[0.3rem] h-14 cursor-ew-resize bg-gray-300 hover:bg-gray-400 transition-colors rounded-md"
        onMouseDown={startResize("left")}
      />
      <div
        className="absolute top-[50%] -translate-y-[50%] right-0 w-[0.3rem] h-14 cursor-ew-resize bg-gray-300 hover:bg-gray-400 transition-colors rounded-md"
        onMouseDown={startResize("right")}
      />
    </div>
  )
}

export default HorizontalResizableComponent
