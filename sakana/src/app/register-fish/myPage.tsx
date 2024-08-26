'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm, SubmitHandler, Controller } from 'react-hook-form'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "@/components/ui/use-toast"

type FormInputs = {
  name: string
  description: string
  waterType: 'FRESHWATER' | 'SALTWATER' | 'BRACKISH'
  species: string[]
}

const speciesList = [
  "サケ科", "コイ科", "タイ科", "サバ科", "カレイ科", "ナマズ科", "スズキ科", "フグ科", "ウナギ科", "カサゴ科","その他"
]

export default function RegisterFish() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const { register, handleSubmit, control, formState: { errors }, setValue } = useForm<FormInputs>()

  const onSubmit: SubmitHandler<FormInputs> = async (data) => {
    console.log(data,"data");
    
    setIsLoading(true)
    try {
      const response = await fetch('/api/fish', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error('Failed to register fish')
      }

      const result = await response.json()
      toast({
        title: "登録完了",
        description: `${result.name}が図鑑に追加されました。`,
      })
      router.push('/fish-list')
    } catch (error) {
      console.error('Error registering fish:', error)
      toast({
        title: "登録失敗",
        description: "魚の登録中にエラーが発生しました。もう一度お試しください。",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex items-center justify-center">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle>お魚を登録</CardTitle>
          <CardDescription>図鑑に新しいお魚を登録します</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <Label htmlFor="name">名前</Label>
              <Input
                id="name"
                {...register("name", {
                  required: "必須項目です",
                  maxLength: { value: 255, message: "255文字以内で入力してください" }
                })}
                placeholder="カサゴ"
              />
              {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
            </div>
            <div>
              <Label htmlFor="description">説明</Label>
              <Textarea
                id="description"
                {...register("description")}
                placeholder="テキスト"
              />
              {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>}
            </div>
            <div>
              <Label htmlFor="waterType">生息地域</Label>
              <Controller
                name="waterType"
                control={control}
                rules={{ required: "必須項目です" }}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder="生息地域" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="FRESHWATER">淡水</SelectItem>
                      <SelectItem value="SALTWATER">海水</SelectItem>
                      <SelectItem value="BRACKISH">汽水</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.waterType && <p className="text-red-500 text-sm mt-1">{errors.waterType.message}</p>}
            </div>
            <div>
              <Label className="text-base font-semibold">科目</Label>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {speciesList.map((species) => (
                  <div key={species} className="flex items-center space-x-2">
                    <div className="flex items-center space-x-2 cursor-pointer">
                      <Checkbox
                        id={species}
                        {...register("species")}
                        value={species}
                      />
                      <Label
                        htmlFor={species}
                        className="cursor-pointer text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {species}
                      </Label>
                    </div>
                  </div>
                ))}
              </div>
              {errors.species && <p className="text-red-500 text-sm mt-1">{errors.species.message}</p>}
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "登録中..." : "登録する"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-gray-600">
            登録した図鑑を見たいですか?{' '}
            <a href="/fish-list" className="text-blue-600 hover:underline">
              一覧を見る
            </a>
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}