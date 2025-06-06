"use client"

import { AuroraText } from "@/components/magicui/aurora-text"
import { TextAnimate } from "@/components/magicui/text-animate"

const IntroSection = () => {
  return (
    <div className="flex flex-col font-instrument-serif-regular">
      <span className="text-5xl md:text-7xl font-bold text-center">
        Create forms in{" "}
        <AuroraText
          speed={1.5}
          className="text-5xl md:text-7xl font-bold text-center"
        >
          seconds.
        </AuroraText>
      </span>

      <TextAnimate
        animation="blurInUp"
        by="character"
        once
        className="text-center text-gray-500 font-medium font-sans"
      >
        With Spira AI, Create forms faster than ever, remove survey bias, and
        get deeper insights
      </TextAnimate>
    </div>
  )
}

export default IntroSection
