'use client';

import { useState } from "react"
import Image from "next/image"
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Menu, LogIn, LogOut, User } from "lucide-react"
import { usePathname } from 'next/navigation';
import clsx from 'clsx';
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useSession, signOut } from "next-auth/react"
import { toast } from "@/components/ui/use-toast"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

function LoginLogoutButton() {
  const { data: session } = useSession();
  const router = useRouter();

  const handleLoginLogout = async () => {
    if (session) {
      toast({
        title: "ログアウト成功",
        description: "ログアウトしました。またのご利用をお待ちしております。",
      });
      setTimeout(async () => {
        await signOut({ redirect: true });
        router.push('/');
      }, 1000);
    } else {
      router.push('/auth/signin');
    }
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleLoginLogout}
      className="flex items-center gap-2"
    >
      {session ? (
        <>
          <LogOut className="h-4 w-4" />
          ログアウト
        </>
      ) : (
        <>
          <LogIn className="h-4 w-4" />
          ログイン
        </>
      )}
    </Button>
  );
}

function UserAvatar({ image }: { image: string | null | undefined }) {
  return (
    <Avatar>
      <AvatarImage src={image || undefined} alt="User avatar" />
      <AvatarFallback>
        <User className="h-5 w-5" />
      </AvatarFallback>
    </Avatar>
  )
}

export default function Header() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname();
  const { data: session } = useSession();

  const menuItems = [
    { href: "/", label: "ホーム" },
    ...(session ? [{ href: "/register-fish", label: "魚登録" }] : []),
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
          <nav className="p-4 hidden lg:flex items-center gap-4">
            <ul className="flex select-none gap-4">
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
            <LoginLogoutButton />
            {session && (
              <UserAvatar image={session.user?.image} />
            )}

          </nav>
          <div className="hidden lg:block ml-4">
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
                <div className="flex justify-center mt-4">
                  <LoginLogoutButton />
                </div>
                {session && (
                  <div className="flex justify-center">
                    <UserAvatar image={session.user?.image} />
                  </div>
                )}
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