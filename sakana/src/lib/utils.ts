import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getWaterTypeJapanese(waterType: string) {
  switch (waterType) {
    case 'FRESHWATER':
      return '淡水';
    case 'SALTWATER':
      return '海水';
    case 'BRACKISH':
      return '汽水';
    default:
      return waterType;
  }
}

