export interface Property {
  id: string
  title: string
  description: string
  price: number
  location: string
  bedrooms: number
  bathrooms: number
  area: number
  images: string[]
  amenities: string[]
  type: 'house' | 'apartment' | 'condo' | 'villa'
  status: 'for-sale' | 'for-rent'
  createdAt: string
  updatedAt: string
}

export interface Testimonial {
  id: string
  name: string
  role: string
  content: string
  avatar: string
}

export interface GameState {
  score: number
  level: number
  completed: boolean
  preferences: {
    location: string[]
    propertyType: string[]
    priceRange: [number, number]
    amenities: string[]
  }
}