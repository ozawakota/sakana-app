"use client"

import React, { useState, useEffect, useRef } from 'react';

export default function About() {
  const [activeTab, setActiveTab] = useState(0);
  const [openTabs, setOpenTabs] = useState<boolean[]>(Array(30).fill(false));
  const scrollPositions = useRef<number[]>(Array(30).fill(0));
  const contentRefs = useRef<(HTMLDivElement | null)[]>([]);
  const tabsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    contentRefs.current = contentRefs.current.slice(0, 30);
  }, []);

  useEffect(() => {
    const handleScroll = (index: number) => {
      if (contentRefs.current[index]) {
        scrollPositions.current[index] = contentRefs.current[index]!.scrollTop;
      }
    };

    openTabs.forEach((isOpen, index) => {
      const content = contentRefs.current[index];
      if (content && isOpen) {
        content.addEventListener('scroll', () => handleScroll(index));
        content.scrollTop = scrollPositions.current[index];
      }
    });

    return () => {
      openTabs.forEach((isOpen, index) => {
        const content = contentRefs.current[index];
        if (content && isOpen) {
          content.removeEventListener('scroll', () => handleScroll(index));
        }
      });
    };
  }, [openTabs]);

  const handleTabClick = (index: number) => {
    setActiveTab(index);
  };

  const toggleTab = (index: number) => {
    setOpenTabs(prev => {
      const newOpenTabs = [...prev];
      newOpenTabs[index] = !newOpenTabs[index];
      return newOpenTabs;
    });
  };

  const fixPunctuation = (text: string) => {
    // 行頭禁則文字
    const startForbidden = /^[、。！？」』）］｝〕〉》"'ぁぃぅぇぉっゃゅょゎァィゥェォッャュョヮ]/;
    
    // 行末禁則文字
    const endForbidden = /[「『（［｛〔〈《"']/;
  
    // テキストを文字配列に分割
    const chars = text.split('');
  
    // 禁則処理を適用
    for (let i = 0; i < chars.length - 1; i++) {
      if (startForbidden.test(chars[i + 1])) {
        // 次の文字が行頭禁則文字の場合、現在の文字にくっつける
        chars[i] += chars[i + 1];
        chars.splice(i + 1, 1);
      } else if (endForbidden.test(chars[i])) {
        // 現在の文字が行末禁則文字の場合、次の文字とくっつける
        chars[i] += chars[i + 1];
        chars.splice(i + 1, 1);
      }
    }
  
    return chars.join('');
  };

  const tabContents = [
    Array(5).fill(null).map((_, i) => (
      <React.Fragment key={i}>
        <div className='[writing-mode:vertical-rl] m-4 space-x-3'>
          <h1 className='text-4xl font-bold m-2'>禁則処理</h1>
          <h2>禁則１：行頭禁則文字</h2>
          <p>「以下の問いに答えよ」「以下の問いに答え」</p>
          {/* <p>{fixPunctuation("")}</p> */}
          <p><span className='inline-block'>句読点が文頭に来る場合は、前の文章</span><span className='inline-block'>入力値、</span></p>
          <p>句読点が文頭に来る場合は、前の文章最後。。</p>
          <p>句読点が文頭に来る場合は、前の文章最後、、</p>
          <p>句読点が文頭に来る場合は、前の文章最後></p>
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
          <p>{<img src="https://placehold.jp/60x60.png" />}</p>
          <p className=''>縦書き:Tab 1.</p>
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
    ...Array(29).fill(null).map((_, i) => 
      Array(50).fill(null).map((_, j) => <p key={j}>タブ:Tab {i + 2}.</p>)
    )
  ];

  return (
    <section className="p-4 text-white">
      <div className="max-w-4xl mx-auto">

        <div className="w-full mx-auto p-4">
          <div 
            ref={tabsRef}
            className="flex overflow-x-auto whitespace-nowrap border-b scrollbar-hide"
          >
            {Array.from({ length: 15 }, (_, i) => (
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
            {Array.from({ length: 15 }, (_, i) => (
              <div key={i} className={activeTab === i ? '' : 'hidden'}>
                <button
                  className="mt-4 bg-gray-800 text-white px-4 py-2 rounded"
                  onClick={() => toggleTab(i)}
                >
                  {openTabs[i] ? '閉じる' : '開く'} 解答画面
                </button>
                <div className={`w-[600px] h-[400px] bg-white text-black p-2 absolute t-contents ${openTabs[i] ? 'show' : ''}`}>
                  <div
                    ref={el => contentRefs.current[i] = el}
                    className="mt-2 h-[360px] overflow-y-auto"
                  >
                    {tabContents[i]}
                  </div>
                </div>
              </div>
            ))}
            <div>
              <img src="https://placehold.jp/860x400.png" alt="logo" />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}