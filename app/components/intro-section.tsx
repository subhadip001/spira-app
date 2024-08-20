"use client";
import React from "react";
import WordRotate from "@/components/magicui/word-rotate";

const IntroSection = () => {
  return (
    <>
      <div className="flex gap-2 ">
        <h1 className="text-4xl text-center ">Create forms with Spira for</h1>
        <WordRotate
          className="text-4xl text-center "
          words={["Market Research", "User Feedback", "Hiring", "Quizzes"]}
        />
      </div>
    </>
  );
};

export default IntroSection;
