'use client';
import Image from "next/image";
import Link from "next/link";
import { usePathname } from 'next/navigation';
import clsx from 'clsx';
import { ThemeToggle } from "@/components/theme-toggle";



export default function Header() {
  const pathname = usePathname();

  return (
    <header className="bg-white top-0 w-full z-50 pt-[5px] pb-[5px] md:h-[85px] md:py-[10px]">
      <div className="c-container flex justify-between relative">
        <h1 className="grid place-items-center">
          <Link href="/">
            魚図鑑
          </Link>
        </h1>
        <div className="flex gap-4 md:gap-4">
          <ThemeToggle />
          <nav className="p-4">
            <ul className="flex gap-4 md:gap-4">
              <li>
                <Link
                  href="/"
                  className={clsx(
                    'flex p-3 grow items-center justify-center gap-2 rounded-md text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3',
                    {
                      'bg-sky-100 text-blue-600': pathname === '/',
                    }
                  )}
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className={clsx(
                    'flex p-3 grow items-center justify-center gap-2 rounded-md text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3',
                    {
                      'bg-sky-100 text-blue-600': pathname === '/about',
                    }
                  )}
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className={clsx(
                    'flex p-3 grow items-center justify-center gap-2 rounded-md text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3',
                    {
                      'bg-sky-100 text-blue-600': pathname === '/contact',
                    }
                  )}

                >
                  Contact
                </Link>
              </li>
            </ul>
          </nav>

        </div>
      </div>
    </header>
  );
}
