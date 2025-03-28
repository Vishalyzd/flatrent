"use client"

import { useState } from 'react'
import { useAuth } from '@/contexts/auth-context'
import { bookingService } from '@/lib/firebase/db'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useToast } from '@/components/ui/use-toast'
import { Calendar } from '@/components/ui/calendar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { format } from 'date-fns'
import { Calendar as CalendarIcon, Star, MapPin, Home, Users, Bath, Ruler } from 'lucide-react'
import type { Property } from '@/types/database'

interface PropertyDetailsProps {
  property: Property
}

export function PropertyDetails({ property }: PropertyDetailsProps) {
  const { user } = useAuth()
  const { toast } = useToast()
  const [selectedDates, setSelectedDates] = useState<{
    from: Date | undefined
    to: Date | undefined
  }>({
    from: undefined,
    to: undefined,
  })
  const [isBooking, setIsBooking] = useState(false)

  const handleBooking = async () => {
    if (!user || !selectedDates.from || !selectedDates.to) return

    setIsBooking(true)
    try {
      await bookingService.create({
        propertyId: property.id,
        buyerId: user.id,
        sellerId: property.sellerId,
        checkIn: selectedDates.from,
        checkOut: selectedDates.to,
        guests: 1, // TODO: Add guest selection
        status: 'pending',
        paymentStatus: 'pending',
        totalPrice: calculateTotalPrice(selectedDates.from, selectedDates.to),
      })

      toast({
        title: 'Success',
        description: 'Booking request sent successfully!',
      })

      setSelectedDates({ from: undefined, to: undefined })
    } catch (error) {
      console.error('Error creating booking:', error)
      toast({
        title: 'Error',
        description: 'Failed to create booking. Please try again.',
        variant: 'destructive',
      })
    } finally {
      setIsBooking(false)
    }
  }

  const calculateTotalPrice = (startDate: Date, endDate: Date) => {
    const days = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))
    return days * (property.pricing.monthly || property.pricing.nightly * 30)
  }

  return (
    <div className="container mx-auto py-8">
      <div className="grid gap-8 lg:grid-cols-2">
        {/* Property Images */}
        <div className="space-y-4">
          <div className="aspect-video overflow-hidden rounded-lg">
            <img
              src={property.images[0]}
              alt={property.title}
              className="h-full w-full object-cover"
            />
          </div>
          <div className="grid grid-cols-4 gap-2">
            {property.images.slice(1).map((image, index) => (
              <div key={index} className="aspect-square overflow-hidden rounded-lg">
                <img
                  src={image}
                  alt={`${property.title} - Image ${index + 2}`}
                  className="h-full w-full object-cover"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Property Information */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold">{property.title}</h1>
            <div className="mt-2 flex items-center text-muted-foreground">
              <MapPin className="mr-1 h-4 w-4" />
              <span>
                {property.location.city}, {property.location.country}
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <Star className="mr-1 h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span>{property.rating.toFixed(1)}</span>
              <span className="ml-1 text-muted-foreground">
                ({property.reviewCount} reviews)
              </span>
            </div>
            <div className="flex items-center">
              <Home className="mr-1 h-4 w-4" />
              <span>{property.details.propertyType}</span>
            </div>
            <div className="flex items-center">
              <Users className="mr-1 h-4 w-4" />
              <span>{property.details.bedrooms} beds</span>
            </div>
            <div className="flex items-center">
              <Bath className="mr-1 h-4 w-4" />
              <span>{property.details.bathrooms} baths</span>
            </div>
            <div className="flex items-center">
              <Ruler className="mr-1 h-4 w-4" />
              <span>{property.details.squareFootage} sq ft</span>
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>${property.pricing.monthly || property.pricing.nightly * 30} / month</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={`w-full justify-start text-left font-normal ${
                          !selectedDates.from && 'text-muted-foreground'
                        }`}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {selectedDates.from ? (
                          format(selectedDates.from, 'PPP')
                        ) : (
                          <span>Check-in</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={selectedDates.from}
                        onSelect={(date) =>
                          setSelectedDates((prev) => ({ ...prev, from: date }))
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>

                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={`w-full justify-start text-left font-normal ${
                          !selectedDates.to && 'text-muted-foreground'
                        }`}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {selectedDates.to ? (
                          format(selectedDates.to, 'PPP')
                        ) : (
                          <span>Check-out</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={selectedDates.to}
                        onSelect={(date) =>
                          setSelectedDates((prev) => ({ ...prev, to: date }))
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                {selectedDates.from && selectedDates.to && (
                  <div className="rounded-lg bg-muted p-4">
                    <div className="flex justify-between">
                      <span>Total price</span>
                      <span className="font-bold">
                        ${calculateTotalPrice(selectedDates.from, selectedDates.to)}
                      </span>
                    </div>
                  </div>
                )}

                <Button
                  className="w-full"
                  disabled={!selectedDates.from || !selectedDates.to || isBooking}
                  onClick={handleBooking}
                >
                  {isBooking ? 'Processing...' : 'Book Now'}
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>About this property</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{property.description}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Amenities</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                {property.details.amenities.map((amenity, index) => (
                  <div key={index} className="flex items-center">
                    <span className="mr-2">•</span>
                    {amenity}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
} 