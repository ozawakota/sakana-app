'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface FishSquare {
  id: number
  backgroundColor: string
  text: string
}

export default function FishSquares() {
  const [squares, setSquares] = useState<FishSquare[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [loading, setLoading] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 3

  useEffect(() => {
    fetch('/squares.json')
      .then(response => response.json())
      .then(data => setSquares(data))
      .catch(error => console.error('Error loading squares data:', error))
  }, [])

  const totalPages = Math.ceil(squares.length / itemsPerPage)

  const loadNext = () => {
    setLoading(true)
    setTimeout(() => {
      const nextIndex = Math.min(currentIndex + 3, squares.length - 1)
      setCurrentIndex(nextIndex)
      setCurrentPage(Math.floor(nextIndex / itemsPerPage) + 1)
      setLoading(false)
    }, 500)
  }

  const loadPrevious = () => {
    setLoading(true)
    setTimeout(() => {
      const prevIndex = Math.max(currentIndex - 3, 0)
      setCurrentIndex(prevIndex)
      setCurrentPage(Math.floor(prevIndex / itemsPerPage) + 1)
      setLoading(false)
    }, 500)
  }

  const currentSquares = squares.slice(currentIndex, currentIndex + 3)

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
        {currentSquares.map(square => (
          <div
            key={square.id}
            className="aspect-square flex items-center justify-center text-white text-lg font-bold rounded-lg shadow-md transition-transform hover:scale-105"
            style={{ backgroundColor: square.backgroundColor }}
          >
            {square.text}
          </div>
        ))}
        {currentSquares.length < 3 && Array(3 - currentSquares.length).fill(null).map((_, index) => (
          <div key={`empty-${index}`} className="aspect-square" />
        ))}
      </div>
      <div className="flex justify-between items-center mt-4">
        <Button
          onClick={loadPrevious}
          disabled={loading || currentIndex === 0}
          className="flex items-center"
        >
          <ChevronLeft className="mr-2 h-4 w-4" />
          戻る
        </Button>
        <span className="text-white">
          ページ {currentPage} / {totalPages}
        </span>
        <Button
          onClick={loadNext}
          disabled={loading || currentIndex >= squares.length - 3}
          className="flex items-center"
        >
          次へ
          <ChevronRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}