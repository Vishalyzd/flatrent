import { DashboardLayout } from '@/components/dashboard/dashboard-layout'
import { ProtectedRoute } from '@/components/protected-route'
import { BookingsList } from '@/components/booking/bookings-list'

export default function BookingsPage() {
  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold">My Bookings</h1>
            <p className="text-muted-foreground">
              View and manage your property bookings.
            </p>
          </div>

          <BookingsList />
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  )
} 