// LoadingSkeleton.tsx
import React from 'react'
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export function LoadingSkeleton(): React.ReactElement {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 gap-6" aria-busy="true" aria-label="魚のリストを読み込み中">
      {[...Array(6)].map((_, index) => (
        <Card key={index} className="flex flex-col">
          <CardHeader>
            <Skeleton className="h-6 w-3/4 mb-2" />
            <Skeleton className="h-4 w-1/2" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-2/3" />
          </CardContent>
          <div className="mt-auto p-6">
            <Skeleton className="h-9 w-24" />
          </div>
        </Card>
      ))}
    </div>
  )
}