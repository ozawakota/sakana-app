'use client';

import { useState } from "react"
import Link from "next/link";
import { Menu } from "lucide-react"
import { usePathname } from 'next/navigation';
import clsx from 'clsx';
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"


export default function Header() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname();
  const menuItems = [
    { href: "/", label: "ホーム" },
    { href: "/register-fish", label: "魚登録" },
    { href: "/about", label: "魚図鑑について" },
    { href: "/contact", label: "お問い合わせ" },
  ]

  return (
    <header className="top-0 w-full z-50 py-[10px]">
      <div className="c-container flex justify-between relative">
        <h1 className="grid place-items-center">
          <Link href="/">
            魚図鑑
          </Link>
        </h1>
        <div className="flex items-center relative">
          <nav className="p-4 hidden lg:block">
            <ul className="lg:flex select-none gap-4 md:gap-4">
              {menuItems.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={clsx(
                      'flex p-3 grow items-center justify-center gap-2 rounded-md text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3',
                      {
                        'bg-sky-100 text-blue-600': pathname === item.href,
                      }
                    )}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <div className="hidden lg:block">
            <ThemeToggle />
          </div>
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden">
                <Menu className="h-6 w-6" />
                <span className="sr-only">メニューを開く</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <nav className="flex flex-col space-y-4 mt-10">
                {menuItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={clsx(
                      'flex p-3 grow items-center justify-center gap-2 rounded-md text-sm font-medium hover:bg-sky-100 hover:text-blue-600',
                      {
                        'bg-sky-100 text-blue-600': pathname === item.href,
                      }
                    )}
                    onClick={() => setOpen(false)}
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
              <div className="flex justify-center mt-10">
              <ThemeToggle />
              </div>
              
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )

}
