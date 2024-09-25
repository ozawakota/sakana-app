"use client"

import { useState, useRef, useEffect } from "react"
import { Badge } from "@/components/ui/badge"

export default function About() {
  const scrollRefs = {
    implementation: useRef<HTMLDivElement>(null),
    features: useRef<HTMLDivElement>(null),
    tracker: useRef<HTMLDivElement>(null),
  }

  const [scrollAmounts, setScrollAmounts] = useState({
    implementation: 0,
    features: 0,
    tracker: 0,
  })

  useEffect(() => {
    const handleScroll = (key: keyof typeof scrollAmounts) => {
      if (scrollRefs[key].current) {
        setScrollAmounts(prev => ({
          ...prev,
          [key]: scrollRefs[key].current!.scrollTop
        }))
      }
    }

    Object.keys(scrollRefs).forEach((key) => {
      const scrollElement = scrollRefs[key as keyof typeof scrollRefs].current
      if (scrollElement) {
        scrollElement.addEventListener('scroll', () => handleScroll(key as keyof typeof scrollAmounts))
      }
    })

    return () => {
      Object.keys(scrollRefs).forEach((key) => {
        const scrollElement = scrollRefs[key as keyof typeof scrollRefs].current
        if (scrollElement) {
          scrollElement.removeEventListener('scroll', () => handleScroll(key as keyof typeof scrollAmounts))
        }
      })
    }
  }, [])

  return (
    <section className="p-4  text-white">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-4 md:mb-10">魚図鑑について</h1>
        
        <div className="mb-16">
          <h2 className="text-xl font-bold pb-4">実装環境(ツール)</h2>
          <Badge variant="outline" className="mb-2">
            スクロール量: {scrollAmounts.implementation}px
          </Badge>
          <div 
            ref={scrollRefs.implementation}
            className="h-[200px] w-full rounded-md border border-gray-700 p-4 overflow-y-auto"
          >
            <ul className="list-disc pl-5 space-y-2">
              <li>next.js 14.2.5 (状態管理: zustand)</li>
              <li>@prisma/client 5.18.0</li>
              <li>mysql 8.0</li>
              <li>TablePlus 6.1.2</li>
              <li>Docker 3.0</li>
              <li>Docker:Mailhog</li>
              {Array.from({ length: 10 }).map((_, index) => (
                <li key={index}>追加の実装環境項目 {index + 1}</li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mb-16">
          <h2 className="text-xl font-bold pb-4">今後の予定追加機能(2024/8/28 現在)</h2>
          <Badge variant="outline" className="mb-2">
            スクロール量: {scrollAmounts.features}px
          </Badge>
          <div 
            ref={scrollRefs.features}
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
              {Array.from({ length: 10 }).map((_, index) => (
                <li key={index}>追加の予定機能 {index + 1}</li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mb-16">
          <h2 className="text-xl font-bold mb-4">スクロール量トラッカー</h2>
          <Badge variant="outline" className="mb-2">
            スクロール量: {scrollAmounts.tracker}px
          </Badge>
          <div 
            ref={scrollRefs.tracker}
            className="h-[300px] w-full rounded-md border border-gray-700 p-4 overflow-y-auto"
          >
            <div className="space-y-4">
              {Array.from({ length: 50 }).map((_, index) => (
                <p key={index}>
                  これは段落 {index + 1} です。スクロールしてスクロール量の変化を確認してください。
                </p>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}