"use client"

import { AuroraText } from "@/components/magicui/aurora-text"
import { TextAnimate } from "@/components/magicui/text-animate"

const IntroSection = () => {
  return (
    <div className="">
      <div className="flex flex-col">
        <span className="text-5xl font-bold text-center">
          Create forms in{" "}
          <AuroraText className="text-6xl font-bold text-center">
            seconds.
          </AuroraText>
        </span>

        {/* <p className="text-center text-gray-500 font-sans">
          With Spira AI, Create forms faster than ever, remove survey bias, and
          get deeper insights
        </p> */}
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
    </div>
  )
}

export default IntroSection
