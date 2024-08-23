"use client"

import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <section className="p-4">
      <div className="inner">
        <div className="flex justify-center md:w-[900px] mx-auto gap-[50px]">
          <Button>ボタン</Button>
          <Button size="lg" variant="secondary" onClick={() => { alert('aleart')}}>Alert!</Button>
          <Button >Save</Button>
          <Button >ボタン</Button>
        </div>
      </div>
    </section>
  );
}
