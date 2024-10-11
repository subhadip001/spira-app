import React, { useState, useEffect, useRef } from "react"

interface AnimatedPlaceholderInputProps {
  placeholders: string[]
  className?: string
  name: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void
  duration?: number
}

export default function AnimatedPlaceholderInput({
  placeholders,
  duration = 3000,
  className,
  name,
  value,
  onChange,
  onKeyDown,
}: AnimatedPlaceholderInputProps) {
  const [currentPlaceholder, setCurrentPlaceholder] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const interval = setInterval(() => {
      setIsAnimating(true)
      setTimeout(() => {
        setCurrentPlaceholder((prev) => (prev + 1) % placeholders.length)
        setIsAnimating(false)
      }, 500)
    }, duration)

    return () => clearInterval(interval)
  }, [placeholders.length])

  return (
    <div className={`relative w-full ${className}`}>
      <input
        ref={inputRef}
        className="w-full border-none outline-none px-3 py-1 rounded text-lg"
        name={name}
        autoComplete="off"
        value={value}
        onChange={onChange}
        onKeyDown={onKeyDown}
      />
      {!value && (
        <span
          className={`absolute left-3 top-1 pointer-events-none text-gray-400 text-lg ${
            isAnimating
              ? "animate-placeholder-exit"
              : "animate-placeholder-enter"
          }`}
        >
          {placeholders[currentPlaceholder]}
        </span>
      )}
      <style jsx>{`
        @keyframes placeholderEnter {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 0.8;
            transform: translateY(0);
          }
        }
        @keyframes placeholderExit {
          from {
            opacity: 0.8;
            transform: translateY(0);
          }
          to {
            opacity: 0;
            transform: translateY(-10px);
          }
        }
        .animate-placeholder-enter {
          animation: placeholderEnter 0.5s forwards;
        }
        .animate-placeholder-exit {
          animation: placeholderExit 0.5s forwards;
        }
      `}</style>
    </div>
  )
}
