'use client'

import { useState , useEffect} from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useForm, SubmitHandler, Controller } from 'react-hook-form'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "@/components/ui/use-toast"
import { Loader2 } from "lucide-react"
import { speciesList } from "@/lib/common"

type FormInputs = {
  name: string
  description: string
  waterType: 'FRESHWATER' | 'SALTWATER' | 'BRACKISH'
  species: string
}

function hiraganaToKatakana(str: string): string {
  return str.replace(/[\u3041-\u3096]/g, function(match) {
    const chr = match.charCodeAt(0) + 0x60;
    return String.fromCharCode(chr);
  });
}

export default function RegisterFish() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const { register, handleSubmit, control, formState: { errors }, setValue, setError } = useForm<FormInputs>()
  
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/')
    }
  }, [status, router])


  const onSubmit: SubmitHandler<FormInputs> = async (data) => {
    setIsLoading(true)
    try {
      const convertedData = {
        ...data,
        name: hiraganaToKatakana(data.name)
      }

      const response = await fetch('/api/fish', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(convertedData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        if (response.status === 400 && errorData.error === 'A fish with this name already exists') {
          setError('name', { type: 'manual', message: '魚の名前が既に登録されています' })
          throw new Error('魚の名前が既に登録されています')
        }
        throw new Error(errorData.error || 'Failed to register fish')
      }

      const result = await response.json()
      toast({
        title: "登録完了",
        description: `${result.name}が図鑑に追加されました。`,
      })
      router.push('/fish-list')
    } catch (error) {
      console.error('Error registering fish:', error)
      if (error instanceof Error) {
        if (error.message === '魚の名前が既に登録されています') {
          toast({
            title: "登録失敗",
            description: error.message,
            variant: "destructive",
          })
        } else {
          toast({
            title: "登録失敗",
            description: "魚の登録中にエラーが発生しました。もう一度お試しください。",
            variant: "destructive",
          })
        }
      }
    } finally {
      setIsLoading(false)
    }
  }

  if (status === 'loading') {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" aria-label="読み込み中" />
      </div>
    )
  }

  if (!session) {
    return null
  }


  return (
    <div className="flex items-center justify-center">
      <Card className="w-full sm:max-w-[725px]">
        <CardHeader>
          <CardTitle>お魚を登録</CardTitle>
          <CardDescription>図鑑に新しいお魚を登録します</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <Label htmlFor="name">名前（カタカナ）</Label>
              <Input
                id="name"
                {...register("name", {
                  required: "必須項目です",
                  maxLength: { value: 255, message: "255文字以内で入力してください" }
                })}
                placeholder="カサゴ"
                className={errors.name ? "border-red-500" : ""}
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
              <Controller
                name="species"
                control={control}
                rules={{ required: "科目を選択してください" }}
                render={({ field }) => (
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="grid grid-cols-2 gap-2 mt-2"
                  >
                    {speciesList.map((species) => (
                      <div key={species} className="flex items-center space-x-2">
                        <RadioGroupItem value={species} id={species} />
                        <Label
                          htmlFor={species}
                          className="cursor-pointer text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          {species}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                )}
              />
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