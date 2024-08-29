export type FishModel = {
  id: number
  name: string
  description: string | null
  waterType: 'FRESHWATER' | 'SALTWATER' | 'BRACKISH'
  species: string
  createdAt: Date
  updatedAt: Date
}


export interface TweetModel {
  id: number;
  content: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
  nickname: string | null;
  user: {
    name: string | null;
    image: string | null;
  };
}