'use client'

import React, { useEffect, useRef, useState } from 'react'
import { Button } from "@/components/ui/button"
import { SaveIcon } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

export default function DrawingApp() {
  const mainCanvasRef = useRef<HTMLCanvasElement>(null)
  const previewCanvasRef = useRef<HTMLCanvasElement>(null)
  const [ws, setWs] = useState<WebSocket | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    const mainCanvas = mainCanvasRef.current
    const previewCanvas = previewCanvasRef.current
    const mainCtx = mainCanvas?.getContext('2d')
    const previewCtx = previewCanvas?.getContext('2d')
    if (!mainCanvas || !mainCtx || !previewCanvas || !previewCtx) return

    // Set up the preview canvas
    previewCanvas.width = mainCanvas.width / 2
    previewCanvas.height = mainCanvas.height / 2
    previewCtx.scale(0.5, 0.5)

    // Set white background for both canvases
    setWhiteBackground(mainCtx, mainCanvas.width, mainCanvas.height)
    setWhiteBackground(previewCtx, previewCanvas.width * 2, previewCanvas.height * 2)

    // WebSocket connection
    const socket = new WebSocket('ws://localhost:3000')
    setWs(socket)

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data)
      if (data.type === 'draw') {
        drawLine(mainCtx, data.x0, data.y0, data.x1, data.y1)
        drawLine(previewCtx, data.x0, data.y0, data.x1, data.y1)
      } else if (data.type === 'reset') {
        setWhiteBackground(mainCtx, mainCanvas.width, mainCanvas.height)
        setWhiteBackground(previewCtx, previewCanvas.width * 2, previewCanvas.height * 2)
      }
    }

    let drawing = false
    let lastX = 0
    let lastY = 0

    const draw = (e: MouseEvent) => {
      if (!drawing) return
      const rect = mainCanvas.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      drawLine(mainCtx, lastX, lastY, x, y)
      drawLine(previewCtx, lastX, lastY, x, y)
      socket.send(JSON.stringify({ type: 'draw', x0: lastX, y0: lastY, x1: x, y1: y }))
      lastX = x
      lastY = y
    }

    mainCanvas.addEventListener('mousedown', (e) => {
      drawing = true
      const rect = mainCanvas.getBoundingClientRect()
      lastX = e.clientX - rect.left
      lastY = e.clientY - rect.top
    })
    mainCanvas.addEventListener('mousemove', draw)
    mainCanvas.addEventListener('mouseup', () => drawing = false)
    mainCanvas.addEventListener('mouseout', () => drawing = false)

    return () => {
      socket.close()
      mainCanvas.removeEventListener('mousedown', () => {})
      mainCanvas.removeEventListener('mousemove', draw)
      mainCanvas.removeEventListener('mouseup', () => {})
      mainCanvas.removeEventListener('mouseout', () => {})
    }
  }, [])

  const drawLine = (ctx: CanvasRenderingContext2D, x0: number, y0: number, x1: number, y1: number) => {
    ctx.beginPath()
    ctx.moveTo(x0, y0)
    ctx.lineTo(x1, y1)
    ctx.stroke()
  }

  const setWhiteBackground = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    ctx.fillStyle = 'white'
    ctx.fillRect(0, 0, width, height)
  }

  const handleReset = () => {
    const mainCanvas = mainCanvasRef.current
    const previewCanvas = previewCanvasRef.current
    const mainCtx = mainCanvas?.getContext('2d')
    const previewCtx = previewCanvas?.getContext('2d')
    if (!mainCanvas || !mainCtx || !previewCanvas || !previewCtx) return

    setWhiteBackground(mainCtx, mainCanvas.width, mainCanvas.height)
    setWhiteBackground(previewCtx, previewCanvas.width * 2, previewCanvas.height * 2)
    ws?.send(JSON.stringify({ type: 'reset' }))
  }

  const handleSave = () => {
    const mainCanvas = mainCanvasRef.current
    if (!mainCanvas) {
      toast({
        title: "エラー",
        description: "画像を保存できませんでした。",
        variant: "destructive",
      })
      return
    }

    try {
      const dataUrl = mainCanvas.toDataURL('image/png')
      const link = document.createElement('a')
      link.href = dataUrl
      link.download = `drawing-${Date.now()}.png`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      toast({
        title: "保存成功",
        description: "画像を高画質で保存しました。",
      })
    } catch (error) {
      console.error('Error saving image:', error)
      toast({
        title: "エラー",
        description: "画像の保存中にエラーが発生しました。",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="flex space-x-4">
        <div className="flex flex-col items-center">
          <h2 className="text-lg font-semibold mb-2">入力画面</h2>
          <canvas 
            ref={mainCanvasRef} 
            width={500} 
            height={500} 
            className="border border-gray-300 rounded-lg shadow-md"
          />
        </div>
        <div className="flex flex-col items-center">
          <h2 className="text-lg font-semibold mb-2">プレビュー画面</h2>
          <canvas 
            ref={previewCanvasRef} 
            width={250} 
            height={250} 
            className="border border-gray-300 rounded-lg shadow-md"
          />
        </div>
      </div>
      <div className="flex space-x-4">
        <Button onClick={handleReset} variant="outline">
          リセットボタン
        </Button>
        <Button onClick={handleSave} variant="outline">
          <SaveIcon className="w-4 h-4 mr-2" />
          保存
        </Button>
      </div>
    </div>
  )
}