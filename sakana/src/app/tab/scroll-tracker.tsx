"use client"

import { useState, useRef, useEffect } from "react"
import { Badge } from "@/components/ui/badge"

export default function ScrollAmountTracker() {
  const [scrollAmount, setScrollAmount] = useState(0)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleScroll = () => {
      if (scrollRef.current) {
        setScrollAmount(scrollRef.current.scrollTop)
      }
    }

    const scrollElement = scrollRef.current
    if (scrollElement) {
      scrollElement.addEventListener('scroll', handleScroll)
    }

    return () => {
      if (scrollElement) {
        scrollElement.removeEventListener('scroll', handleScroll)
      }
    }
  }, [])

  return (
    <div className="p-4 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">スクロール量トラッカー</h1>
      <Badge variant="outline" className="mb-4">
        スクロール量: {scrollAmount}px
      </Badge>
      <div 
        ref={scrollRef}
        className="h-[300px] w-full rounded-md border p-4 overflow-y-auto"
      >
        <div className="space-y-4">
          {Array.from({ length: 50 }).map((_, index) => (
            <p key={index} className="text-gray-800">
              これは段落 {index + 1} です。スクロールしてスクロール量の変化を確認してください。
            </p>
          ))}
        </div>
      </div>
    </div>
  )
}