export type FishModel = {
  id: number
  name: string
  description: string | null
  waterType: 'FRESHWATER' | 'SALTWATER' | 'BRACKISH'
  species: string
  createdAt: Date
  updatedAt: Date
}


export type TweetModel = {
  id: number
  content: string
  nickname: string | null
  createdAt: Date
  updatedAt: Date
  userId: string
  user: {
    name: string | null
  }
}