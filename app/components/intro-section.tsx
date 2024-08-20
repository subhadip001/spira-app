"use client";
import React from "react";
import WordRotate from "@/components/magicui/word-rotate";

const IntroSection = () => {
  return (
    <div className="">
      <div className="flex flex-col">
        <span className="text-4xl text-center">
          Create forms with Spira for
          <WordRotate
            className="text-4xl text-center"
            words={["Market Research", "User Feedback", "Hiring", "Quizzes"]}
          />
        </span>
      </div>
    </div>
  );
};

export default IntroSection;
