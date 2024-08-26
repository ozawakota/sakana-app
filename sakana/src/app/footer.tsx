'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Facebook, Twitter, Instagram, Github } from 'lucide-react'

export default function Footer() {
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear())

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentYear(new Date().getFullYear())
    }, 1000 * 60 * 60) // Update every hour

    return () => clearInterval(timer)
  }, [])

  return (
    <footer className="bg-gray-100 border-t">
      <div className="c-container px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h2 className="text-lg font-semibold mb-4">クイックリンク</h2>
            <ul className="space-y-2">
              <li><Link href="/" className="text-sm text-gray-600 hover:text-blue-600">ホーム</Link></li>
              <li><Link href="/fish-list" className="text-sm text-gray-600 hover:text-blue-600">魚一覧</Link></li>
              <li><Link href="/register-fish" className="text-sm text-gray-600 hover:text-blue-600">新しい魚を登録</Link></li>
              <li><Link href="/contact" className="text-sm text-gray-600 hover:text-blue-600">お問い合わせ</Link></li>
            </ul>
          </div>
          <div>
            <h2 className="text-lg font-semibold mb-4">フォローする</h2>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-blue-500" aria-label="Facebook">
                <Facebook />
              </a>
              <a href="#" className="text-gray-400 hover:text-blue-400" aria-label="Twitter">
                <Twitter />
              </a>
              <a href="#" className="text-gray-400 hover:text-pink-500" aria-label="Instagram">
                <Instagram />
              </a>
              <a href="#" className="text-gray-400 hover:text-gray-900" aria-label="GitHub">
                <Github />
              </a>
            </div>
          </div>
        </div>
        <div className="mt-8 border-t pt-4">
          <p className="text-sm text-center text-gray-500">
            © {currentYear} 魚図鑑. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}