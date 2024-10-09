"use client";

import React, { useState, useCallback } from "react";

// Extend JSX namespace to include rb element
declare global {
  namespace JSX {
    interface IntrinsicElements {
      rb: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
    }
  }
}

export default function Answer() {
  const [isFocused, setIsFocused] = useState(false);
  const [inputValue, setInputValue] = useState("");

  const handleFocus = useCallback(() => {
    setIsFocused(true);
  }, []);

  const handleBlur = useCallback(() => {
    setIsFocused(inputValue.trim() !== "");
  }, [inputValue]);

  const handleKeyUp = useCallback((event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.currentTarget.value.trim() !== "") {
      setIsFocused(true);
    }
  }, []);

  const handleChange = useCallback((event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(event.target.value);
  }, []);

  return (
    <section className="p-4 text-white min-h-screen">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-4 md:mb-10">
          <ruby>
            <rb>解答権</rb>
            <rt>かいとうけん</rt>
          </ruby>
        </h1>
        <div className="relative w-full">
          <textarea
            onFocus={handleFocus}
            onBlur={handleBlur}
            onKeyUp={handleKeyUp}
            onChange={handleChange}
            value={inputValue}
            placeholder=" "
            className="w-full min-h-[150px] p-2 bg-[#FDF6C9] rounded text-black text-[20px] resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
          />
          {!isFocused && (
            <div className="absolute top-2 left-2 text-gray-400 text-[18px] font-bold pointer-events-none">
              ここを
              <ruby>
                <rb>押</rb>
                <rt className="font-normal">お</rt>
              </ruby>
              して、キーボードで
              <ruby>
                <rb>解答</rb>
                <rt className="font-normal">かいとう</rt>
              </ruby>
              を
              <ruby>
                <rb>入力</rb>
                <rt className="tracking-[-2.4px] font-normal">にゅうりょく</rt>
              </ruby>
              してください
            </div>
          )}
        </div>
      </div>
    </section>
  );
}