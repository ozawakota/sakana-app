import Image from "next/image";
import Link from "next/link";

export default function Header() {
  return (
    <header className="bg-white top-0 w-full z-50 h-[60px] pt-[5px] pb-[10px] md:h-[85px] md:py-[10px]">
      <div className="c-container flex justify-between relative">
        <h1 className="grid place-items-center">
          <Link href="/">
            計算機
          </Link>
        </h1>
        <div className="">
          <nav className="p-4">
            <ul className="flex gap-8">
              <li>
                <Link href="/">Home</Link>
              </li>
              <li>
                <Link href="/about">About</Link>
              </li>
              <li>
                <Link href="/contact">Contact</Link>
              </li>
            </ul>
          </nav>

        </div>
      </div>
    </header>
  );
}
