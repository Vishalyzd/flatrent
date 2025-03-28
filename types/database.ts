export type UserRole = 'admin' | 'seller' | 'buyer'

export interface User {
  id: string
  email: string
  name: string
  role: UserRole
  phone?: string
  avatar?: string
  createdAt: Date
  updatedAt: Date
  fcmToken?: string
}

export interface Property {
  id: string
  sellerId: string
  title: string
  description: string
  price: number
  location: {
    address: string
    city: string
    country: string
    coordinates: {
      lat: number
      lng: number
    }
  }
  details: {
    bedrooms: number
    bathrooms: number
    squareFootage: number
    propertyType: 'house' | 'apartment' | 'condo' | 'villa'
    amenities: string[]
  }
  images: string[]
  availability: {
    startDate: Date
    endDate: Date
    blockedDates: Date[]
  }
  pricing: {
    nightly: number
    weekly?: number
    monthly?: number
    cleaningFee: number
    serviceFee: number
  }
  status: 'active' | 'inactive' | 'pending' | 'sold'
  createdAt: Date
  updatedAt: Date
  rating: number
  reviewCount: number
}

export interface Booking {
  id: string
  propertyId: string
  buyerId: string
  sellerId: string
  checkIn: Date
  checkOut: Date
  guests: number
  totalPrice: number
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed'
  paymentStatus: 'pending' | 'paid' | 'refunded'
  createdAt: Date
  updatedAt: Date
}

export interface Review {
  id: string
  propertyId: string
  bookingId: string
  buyerId: string
  rating: number
  comment: string
  createdAt: Date
  updatedAt: Date
}

export interface Message {
  id: string
  senderId: string
  receiverId: string
  propertyId?: string
  bookingId?: string
  content: string
  read: boolean
  createdAt: Date
}

export interface Notification {
  id: string
  userId: string
  title: string
  message: string
  type: 'booking' | 'message' | 'property' | 'review'
  read: boolean
  createdAt: Date
  data?: {
    bookingId?: string
    propertyId?: string
    messageId?: string
    reviewId?: string
  }
} 