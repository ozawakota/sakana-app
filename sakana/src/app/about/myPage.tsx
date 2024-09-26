"use client"

import React, { useState, useEffect, useRef } from 'react';

export default function About() {
  const [activeTab, setActiveTab] = useState(0);
  const scrollPositions = useRef([0, 0, 0, 0]);
  const contentRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      if (contentRef.current) {
        scrollPositions.current[activeTab] = contentRef.current.scrollTop;
      }
    };

    const content = contentRef.current;
    if (content) {
      content.addEventListener('scroll', handleScroll);
      content.scrollTop = scrollPositions.current[activeTab];
    }

    return () => {
      if (content) {
        content.removeEventListener('scroll', handleScroll);
      }
    };
  }, [activeTab]);

  const handleTabClick = (index) => {
    setActiveTab(index);
  };

  const tabContents = [
    Array(5).fill(null).map((_, i) => (
      <React.Fragment key={i}>
        <div className='[writing-mode:vertical-rl] m-4'>
          <p className=''>縦書き:Tab 1.</p>
          <p className="underline decoration-soli">下線</p>
          <p className='underline decoration-wavy'>波線</p>
          <p className='underline decoration-double'>二重線</p>
          <p className='underline decoration-dashed'>破線</p>
          <p className='text-4xl text-red-500'>フォント変更</p>
        </div>
    </React.Fragment>
    )),
    Array(50).fill(null).map((_, i) => <p key={i}>タブ:Tab 2.</p>),
    Array(50).fill(null).map((_, i) => <p key={i}>タブ:Tab 3.</p>),
    Array(50).fill(null).map((_, i) => <p key={i}>タブ:Tab 4.</p>),
  ];

  return (
    <section className="p-4 text-white">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-4 md:mb-10">魚図鑑について</h1>
        
        <div className="mb-16">
          <h2 className="text-xl font-bold pb-4">実装環境(ツール)</h2>
          <div 
            className="h-[200px] w-full rounded-md border border-gray-700 p-4 overflow-y-auto"
          >
            <ul className="list-disc pl-5 space-y-2">
              <li>next.js 14.2.5 (状態管理: zustand)</li>
              <li>@prisma/client 5.18.0</li>
              <li>mysql 8.0</li>
              <li>TablePlus 6.1.2</li>
              <li>Docker 3.0</li>
              <li>Docker:Mailhog</li>
            </ul>
          </div>
        </div>

        <div className="mb-16">
          <h2 className="text-xl font-bold pb-4">今後の予定追加機能(2024/8/28 現在)</h2>
          <div 
            className="h-[200px] w-full rounded-md border border-gray-700 p-4 overflow-y-auto"
          >
            <ul className="list-disc pl-5 space-y-2">
              <li>魚の疑問</li>
              <li>魚の写真投稿</li>
              <li>魚の統計</li>
              <li>魚の特徴</li>
              <li>魚の釣種</li>
              <li>お魚ニュース</li>
              <li>お魚のレシピ動画</li>
              <li>魚の動画</li>
            </ul>
          </div>
        </div>

        <div className="w-full max-w-2xl mx-auto p-4">
          <div className="flex border-b">
            {['Tab 1', 'Tab 2', 'Tab 3', 'Tab 4'].map((tab, index) => (
              <button
                key={index}
                className={`px-4 py-2 bg-white ${
                  activeTab === index
                    ? 'border-b-2 border-blue-500 text-blue-500'
                    : 'text-gray-500'
                }`}
                onClick={() => handleTabClick(index)}
              >
                {tab}
              </button>
            ))}
          </div>
          <div 
            ref={contentRef}
            className="mt-4 h-64 overflow-y-auto"
          >
            {tabContents[activeTab]}
          </div>
        </div>
      </div>
    </section>
  )
}
