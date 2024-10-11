"use client"

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function Tab() {
  const [activeTab, setActiveTab] = useState(0);
  const [openTabs, setOpenTabs] = useState<boolean[]>(Array(30).fill(false));
  const scrollPositions = useRef<number[]>(Array(30).fill(0));
  const contentRefs = useRef<(HTMLDivElement | null)[]>([]);
  const tabsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    contentRefs.current = contentRefs.current.slice(0, 30);
  }, []);

  const handleScroll = useCallback((index: number) => {
    if (contentRefs.current[index]) {
      scrollPositions.current[index] = contentRefs.current[index]!.scrollTop;
    }
  }, []);

  useEffect(() => {
    openTabs.forEach((isOpen, index) => {
      const content = contentRefs.current[index];
      if (content && isOpen) {
        const scrollHandler = () => handleScroll(index);
        content.addEventListener('scroll', scrollHandler);
        content.scrollTop = scrollPositions.current[index];
        return () => content.removeEventListener('scroll', scrollHandler);
      }
    });
  }, [openTabs, handleScroll]);

  const handleTabClick = useCallback((index: number) => {
    setActiveTab(index);
  }, []);

  const toggleTab = useCallback((index: number) => {
    setOpenTabs(prev => {
      const newOpenTabs = [...prev];
      newOpenTabs[index] = !newOpenTabs[index];
      return newOpenTabs;
    });
  }, []);

  const tabContents = [
    Array(5).fill(null).map((_, i) => (
      <React.Fragment key={i}>
        <div className='[writing-mode:vertical-rl] m-4 space-x-3'>
          <h1 className='text-4xl font-bold m-2'>禁則処理</h1>
          <h2>禁則１：行頭禁則文字</h2>
          <p>「以下の問いに答えよ」「以下の問いに答え」</p>
          <p><span className='inline-block'>句読点が文頭に来る場合は、前の文章</span><span className='inline-block'>入力値、</span></p>
          <p>句読点が文頭に来る場合は、前の文章最後。。</p>
          <p>句読点が文頭に来る場合は、前の文章最後、、</p>
          <p>句読点が文頭に来る場合は、前の文章最後&gt;</p>
          <p>句読点が文頭に来る場合は、前の文章最後」」</p>
          <p>句読点が文頭に来る場合は、前の文章最後】】</p>
          <p>句読点が文頭に来る場合は、前の文章最後＞</p>
          <p>句読点が文頭に来る場合は、前の文章最後ぁぁ</p>
          <p>句読点が文頭に来る場合は、前の文章最後ー</p>
          <p>句読点が文頭に来る場合は、前の文章最後・</p>
          <p>句読点が文頭に来る場合は、前の文章最後―</p>
          <p>句読点が文頭に来る場合は、前の文章最後-</p>
          <p>句読点が文頭に来る場合は、前の文章最後、</p>
          <p>句読点が文頭に来る場合は、前の文章最後:</p>
          <p>句読点が文頭に来る場合は、前の文章最後？</p>
          <p>句読点が文頭に来る場合は、前の文章最後／</p>
          <p>句読点が文頭に来る場合は、前の文章最後々</p>
          <p>句読点が文頭に来る場合は、前の文章最後ゝ</p>
          <h2>禁則２：行末禁則文字</h2>
          <p>「句読点が文頭に来る場合は、前の文章最後」</p>
          <p>＜句読点が文頭に来る場合は、前の文章最後＞</p>
          <p>【句読点が文頭に来る場合は、前の文章最後】</p>
          <p>test</p>
          <p>「が文末に来る場合は、次の文章の頭に表「表示する。</p>
          <p>」が文頭に来る場合は、前の文章の最後尾に」表示する。</p>
          <p>小文字が文頭に来る場合は、前の文章のししょ尾に表示するしょうがっこうしょうがっっっ</p>
          <div className="relative w-[60px] h-[60px]">
            <Image src="/placeholder.svg" alt="Placeholder" width={60} height={60} />
          </div>
          <p className='text-decoration-line decoration-solid'>縦書き:Tab 1.</p>
          <p className="text-decoration-line decoration-solid">下線</p>
          <p className='text-decoration-line decoration-wavy'>波線</p>
          <p className='text-decoration-line decoration-double'>二重線</p>
          <p className='text-decoration-line decoration-dashed decoration-orange-700'>破線</p>
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
    ...Array(30).fill(null).map((_, i) => 
      Array(10).fill(null).map((_, j) => <p key={j}>タブ:Tab {i + 2}.</p>)
    )
  ];

  const totalTabs = tabContents.length;

  const handleNextTab = useCallback(() => {
    setActiveTab(prev => Math.min(prev + 1, totalTabs - 1));
  }, [totalTabs]);

  const handlePrevTab = useCallback(() => {
    setActiveTab(prev => Math.max(prev - 1, 0));
  }, []);

  const setContentRef = useCallback((el: HTMLDivElement | null, index: number) => {
    contentRefs.current[index] = el;
  }, []);

  return (
    <section className="p-4 text-white">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-4">
          <button onClick={handlePrevTab} disabled={activeTab === 0} className='bg-gray-800 text-white px-4 py-2 rounded'>
            <ChevronLeft />
          </button>
          <span>Tab {activeTab + 1} of {totalTabs}</span>
          <button onClick={handleNextTab} disabled={activeTab === totalTabs - 1} className='bg-gray-800 text-white px-4 py-2 rounded'>
            <ChevronRight />
          </button>
        </div>
        <div className="w-full mx-auto p-4">
          <div 
            ref={tabsRef}
            className="flex overflow-x-auto whitespace-nowrap border-b scrollbar-hide"
          >
            {tabContents.map((_, i) => (
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
          {tabContents.map((_, i) => (
              <div key={i} className={activeTab === i ? '' : 'hidden'}>
                <button
                  className="mt-4 bg-gray-800 text-white px-4 py-2 rounded"
                  onClick={() => toggleTab(i)}
                >
                  {openTabs[i] ? '閉じる' : '開く'} 解答画面
                </button>
                <div className={`w-[600px] h-[400px] bg-white text-black p-2 absolute t-contents ${openTabs[i] ? 'show' : ''}`}>
                  <div
                    ref={(el) => setContentRef(el, i)}
                    className="mt-2 h-[360px] overflow-y-auto"
                  >
                    {tabContents[i]}
                  </div>
                </div>
              </div>
            ))}
            <div className="relative w-[860px] h-[400px]">
              <Image 
                src="/images/dummy.png" 
                alt="logo" 
                layout="fill" 
                objectFit="cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}