import type { Metadata } from "next";
import { Noto_Sans_JP } from "next/font/google";
import clsx from "clsx";
import "./globals.css";
import Header from "./header";

const notoSansJP = Noto_Sans_JP({
  subsets: ['latin'],
  variable: '--font-noto-sans-jp',
  // weight: 'variable', // default なので不要。バリアブルフォントでなければ必要
  // display: 'swap', // default なので不要
  // preload: true, // default なので不要
  // adjustFontFallback: true, // next/font/google で default なので不要
  // fallback: ['system-ui', 'arial'], // local font fallback なので不要
})


export const metadata: Metadata = {
  title: "Page Transition",
  description: "Using framer-motion to add trasition between pages",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='ja'>
      <body className={clsx(notoSansJP.variable, 'font-sans')}>
        <div className="bg-gradient-animation">
          <Header />
          <main>{children}</main>
        </div>
      </body>
    </html>
  );
}
