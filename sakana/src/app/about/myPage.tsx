"use client"

import React, { useState, useEffect, useRef } from 'react';

export default function About() {
  const [activeTab, setActiveTab] = useState(0);
  const [isContentsOpen, setIsContentsOpen] = useState(true); // State for collapse
  const scrollPositions = useRef([0, 0, 0, 0]);
  const contentRef = useRef<HTMLDivElement>(null);
  const tabsRef = useRef<HTMLDivElement>(null);

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

  const handleTabClick = (index: number) => {
    setActiveTab(index);
  };

  const toggleContents = () => {
    setIsContentsOpen(!isContentsOpen);
  };

  const tabContents = [
    Array(5).fill(null).map((_, i) => (
      <React.Fragment key={i}>
        <div className='[writing-mode:vertical-rl] m-4'>
          <p className=''>縦書き:Tab 1.</p>
          <p className="underline decoration-solid">下線</p>
          <p className='underline decoration-wavy'>波線</p>
          <p className='underline decoration-double'>二重線</p>
          <p className='underline decoration-dashed decoration-orange-700'>破線</p>
          <p className='text-4xl text-red-500'>フォント変更</p>
          <p className='text-3xl'>
            この
            <ruby>
              <rb>３</rb>
              <rt>みっ</rt>
            </ruby>
            つ
            の
            <ruby>
              <rb>要素</rb>
              <rt>ようそ</rt>
            </ruby>
            が
            <ruby>
              <rb>正</rb>
              <rt>ただ</rt>
            </ruby>
            しく
            <ruby>
              <rb>揃</rb>
              <rt>そろ</rt>
            </ruby>
            っていれば、<br/>
            <ruby>
              <rb>植物</rb>
              <rt>しょくぶつ</rt>
            </ruby>
            の
            <ruby>
              <rb>成長</rb>
              <rt>せいちょう</rt>
            </ruby>
            が
            <ruby>
              <rb>円滑</rb>
              <rt>えんかつ</rt>
            </ruby>
            に
            <ruby>
              <rb>進</rb>
              <rt>すす</rt>
            </ruby>
            むことができます。
          </p>
        </div>
      </React.Fragment>
    )),
    ...Array(29).fill(null).map((_, i) => 
      Array(50).fill(null).map((_, j) => <p key={j}>タブ:Tab {i + 2}.</p>)
    )
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

        <div className="w-full mx-auto p-4">
          <div 
            ref={tabsRef}
            className="flex overflow-x-auto whitespace-nowrap border-b scrollbar-hide"
          >
            {Array.from({ length: 30 }, (_, i) => (
              <button
                key={i}
                className={`flex-shrink-0 px-4 py-2 bg-white ${
                  activeTab === i
                    ? 'border-b-2 border-blue-500 text-blue-500'
                    : 'text-gray-500'
                }`}
                onClick={() => handleTabClick(i)}
              >
                Tab {i + 1}
              </button>
            ))}
          </div>
          <div className='relative h-[400px]'>
            <button 
              className="mt-4 bg-gray-800 text-white px-4 py-2 rounded"
              onClick={toggleContents}
            >
              {isContentsOpen ? '閉じる' : '開く'} 解答画面
            </button>
            <div className={`w-[400px] bg-white text-black p-2 absolute t-contents ${isContentsOpen ? 'show' : ''}`}>
              <div
                ref={contentRef}
                className="mt-4 h-[400px] overflow-y-auto"
              >
                {tabContents[activeTab]}
              </div>
            </div>
            <div>
              <img src="https://placehold.jp/860x400.png" alt="logo" />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
