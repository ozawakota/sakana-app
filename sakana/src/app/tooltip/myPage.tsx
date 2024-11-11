"use client"

import React, { useState, useEffect, useRef } from 'react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const HorizontalScroll = () => {
  const [items, setItems] = useState([
    'Item 1', 'Item 2', 'Item 3', 'Item 4', 'Item 5',
    'Item 6', 'Item 7', 'Item 8', 'Item 9', 'Item 10'
  ]);
  const [isAtStart, setIsAtStart] = useState(true);
  const [isAtEnd, setIsAtEnd] = useState(false);
  const [scrollPosition, setScrollPosition] = useState(0);
  
  const scrollContainerRef = useRef(null);

  const handleScroll = () => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const position = container.scrollLeft;
    const maxScroll = container.scrollWidth - container.clientWidth;
    
    setScrollPosition(position);
    setIsAtStart(position === 0);
    setIsAtEnd(Math.abs(position - maxScroll) < 1);
  };

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
      handleScroll();
    }

    return () => {
      if (container) {
        container.removeEventListener('scroll', handleScroll);
      }
    };
  }, []);

  const addItem = () => {
    setItems(prev => [...prev, `Item ${prev.length + 1}`]);
  };

  const removeItem = () => {
    setItems(prev => prev.slice(0, -1));
  };

  // ツールチップを表示するかどうかの条件
  const shouldShowTooltip = !(isAtStart && !isAtEnd);

  console.log('====================================');
  console.log(shouldShowTooltip, "aa");
  console.log('====================================');

  return (
    <TooltipProvider>
      <div className="w-full space-y-4">
        <div className="flex gap-4">
          <Tooltip open={shouldShowTooltip ? undefined : false}>
            <TooltipTrigger asChild>
              <button
                onClick={() => {
                  if (scrollContainerRef.current) {
                    scrollContainerRef.current.scrollTo({
                      left: 0,
                      behavior: 'smooth'
                    });
                  }
                }}
                className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
                disabled={isAtStart}
              >
                先頭へ
              </button>
            </TooltipTrigger>
            <TooltipContent>
              <p>先頭へスクロール</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip open={shouldShowTooltip ? undefined : false}>
            <TooltipTrigger asChild>
              <button
                onClick={() => {
                  if (scrollContainerRef.current) {
                    scrollContainerRef.current.scrollTo({
                      left: scrollContainerRef.current.scrollWidth,
                      behavior: 'smooth'
                    });
                  }
                }}
                className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
                disabled={isAtEnd}
              >
                末尾へ
              </button>
            </TooltipTrigger>
            <TooltipContent>
              <p>末尾へスクロール</p>
            </TooltipContent>
          </Tooltip>
        </div>

        <div className="relative">
          {shouldShowTooltip && (
            <p>続き</p>
          )}
          
          <div 
            ref={scrollContainerRef}
            className="overflow-x-auto pb-4"
          >
            <div className="flex space-x-4">
              {items.map((item, index) => (
                <div
                  key={index}
                  className="flex-none w-48 h-48 bg-white rounded-lg shadow-md flex items-center justify-center"
                >
                  <span className="text-lg font-medium text-gray-700">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <div className="text-sm text-gray-600">
            スクロール位置: {Math.round(scrollPosition)}px
          </div>
          <div className="text-sm text-gray-600">
            先頭: {isAtStart ? 'はい' : 'いいえ'} | 
            末尾: {isAtEnd ? 'はい' : 'いいえ'}
          </div>
          <div className="flex gap-4">
            <Tooltip open={shouldShowTooltip ? undefined : false}>
              <TooltipTrigger asChild>
                <button
                  onClick={addItem}
                  className="px-4 py-2 bg-green-500 text-white rounded"
                >
                  アイテム追加
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p>新しいアイテムを追加</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip open={shouldShowTooltip ? undefined : false}>
              <TooltipTrigger asChild>
                <button
                  onClick={removeItem}
                  className="px-4 py-2 bg-red-500 text-white rounded"
                  disabled={items.length === 0}
                >
                  アイテム削除
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p>最後のアイテムを削除</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
};

export default HorizontalScroll;