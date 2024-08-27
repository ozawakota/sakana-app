'use client'

import { useState, useEffect } from "react"
import { ThemeProvider } from "@/components/theme-provider"
import { Noto_Sans_JP } from "next/font/google"
import clsx from "clsx"
import "./globals.css"
import Header from "./header"
import Footer from "./footer"
import { Toaster } from "@/components/ui/toaster"
import { SessionProvider } from "next-auth/react"

const notoSansJP = Noto_Sans_JP({
  subsets: ['latin'],
  variable: '--font-noto-sans-jp',
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <html lang='ja' suppressHydrationWarning>
      <body className={clsx(notoSansJP.variable, 'font-sans')}>
        <SessionProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
            storageKey="acme-theme"
          >
            <div className="">
              <Header />
              <main className="md:py-[60px] py-[30px] bg-gradient-animation">
                <div className="c-container">
                  {children}
                </div>
              </main>
              <Toaster />
              <Footer/>
            </div>
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  )
}