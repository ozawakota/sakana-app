"use client"
 
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
 
import { Button } from "@/components/ui/button"

import { toast } from "@/components/ui/use-toast"

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"


const formSchema = z.object({
  username: z
    .string()
    .min(2, {
      message: "2文字以上入力してください",
    }),
  content: z
    .string()
    .min(10, {
      message: "10文字以上入力してください。",
    })
    .max(160, {
      message: "160文字以内で入力してください。",
    }),
})


export default function Contact() {


  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
    },
  })

  function onSubmit(data: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(data, "値")
    toast({
      title: "成功：以下のデータを送信します",
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
    })

  }

  return (
    <section className="p-4">
      <div className="container">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>氏名</FormLabel>
                  <FormControl>
                    <Input placeholder="山田 太郎" {...field} />
                  </FormControl>
                  <FormDescription>
                    これはあなたの公開表示名です。
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>本文</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="何かツイートしてください"
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    本文は公開されます。
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">送信</Button>
          </form>
        </Form>


    
      </div>


    </section>
  );
}
