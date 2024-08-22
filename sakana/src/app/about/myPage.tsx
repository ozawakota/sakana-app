"use client"

import { Button } from "@/components/ui/button"
import { ToastAction } from "@/components/ui/toast"
import { useToast } from "@/components/ui/use-toast"

export default function About() {
  const { toast } = useToast()

  return (
    <section className="p-4">
      <div className="">
        <h1 className="text-2xl font-bold mb-4 md:mb-10 text-white">About Page</h1>
        <Button
      variant="outline"
      onClick={() => {
        toast({
          title: "Scheduled: Catch up ",
          description: "Friday, February 10, 2023 at 5:57 PM",
          action: (
            <ToastAction altText="Goto schedule to undo">Undo</ToastAction>
          ),
        })
      }}
    >
      Add to calendar
    </Button>
      </div>
    </section>
  );
}
