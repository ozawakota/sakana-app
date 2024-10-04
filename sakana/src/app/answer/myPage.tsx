"use client";

import { useState } from "react";

export default function Answer() {
  const [isFocused, setIsFocused] = useState(false);
  const [inputValue, setInputValue] = useState("");

  const handleKeyUp = (event) => {
    if (event.target.value.trim() !== "") {
      setIsFocused(true); // 文字が入力されている場合はプレースホルダーを消す
    }
  };

  return (
    <section className="p-4 text-white">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-4 md:mb-10">
          <ruby>
            <rb>解答権</rb>
            <rt>かいとうけん</rt>
          </ruby>
        </h1>
        <div className="relative w-50">
          <textarea
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(inputValue.trim() !== "")} // 入力があればフォーカスを維持
            onKeyUp={handleKeyUp} // keyup イベントを処理
            onChange={(e) => setInputValue(e.target.value)} // 入力内容を管理
            placeholder=" "
            className="w-full min-h-[150px] p-2 bg-[#FDF6C9] rounded text-black text-[20px] resize-none"
          ></textarea>
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
