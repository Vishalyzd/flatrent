"use client"

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/auth-context'
import { bookingService } from '@/lib/firebase/db'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { useToast } from '@/components/ui/use-toast'
import { format } from 'date-fns'
import { Eye, Check, X } from 'lucide-react'
import type { Booking } from '@/types/database'

export function BookingsList() {
  const { user } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [bookings, setBookings] = useState<Booking[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!user) return

    async function loadBookings() {
      try {
        const userBookings = user.role === 'seller'
          ? await bookingService.getBySellerId(user.id)
          : await bookingService.getByBuyerId(user.id)
        setBookings(userBookings)
      } catch (error) {
        console.error('Error loading bookings:', error)
        toast({
          title: 'Error',
          description: 'Failed to load bookings. Please try again.',
          variant: 'destructive',
        })
      } finally {
        setIsLoading(false)
      }
    }

    loadBookings()
  }, [user, toast])

  const handleStatusUpdate = async (bookingId: string, status: Booking['status']) => {
    try {
      await bookingService.update(bookingId, { status })
      setBookings(
        bookings.map((booking) =>
          booking.id === bookingId ? { ...booking, status } : booking
        )
      )
      toast({
        title: 'Success',
        description: `Booking ${status} successfully.`,
      })
    } catch (error) {
      console.error('Error updating booking:', error)
      toast({
        title: 'Error',
        description: 'Failed to update booking. Please try again.',
        variant: 'destructive',
      })
    }
  }

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    )
  }

  if (bookings.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center space-y-4 rounded-lg border border-dashed p-8">
        <p className="text-lg text-muted-foreground">No bookings found</p>
      </div>
    )
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Property</TableHead>
            <TableHead>Dates</TableHead>
            <TableHead>Total Price</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="w-[100px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {bookings.map((booking) => (
            <TableRow key={booking.id}>
              <TableCell className="font-medium">
                <Button
                  variant="link"
                  className="p-0"
                  onClick={() => router.push(`/property/${booking.propertyId}`)}
                >
                  View Property
                </Button>
              </TableCell>
              <TableCell>
                {format(booking.checkIn, 'MMM d, yyyy')} -{' '}
                {format(booking.checkOut, 'MMM d, yyyy')}
              </TableCell>
              <TableCell>${booking.totalPrice}</TableCell>
              <TableCell>
                <Badge
                  variant={
                    booking.status === 'confirmed'
                      ? 'default'
                      : booking.status === 'pending'
                      ? 'secondary'
                      : 'destructive'
                  }
                >
                  {booking.status}
                </Badge>
              </TableCell>
              <TableCell>
                {user?.role === 'seller' && booking.status === 'pending' && (
                  <div className="flex space-x-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-green-600"
                      onClick={() => handleStatusUpdate(booking.id, 'confirmed')}
                    >
                      <Check className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-red-600"
                      onClick={() => handleStatusUpdate(booking.id, 'rejected')}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                )}
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => router.push(`/dashboard/bookings/${booking.id}`)}
                >
                  <Eye className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
} 