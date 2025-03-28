import { DashboardLayout } from '@/components/dashboard/dashboard-layout'
import { ProtectedRoute } from '@/components/protected-route'
import { NotificationsList } from '@/components/notification/notifications-list'

export default function NotificationsPage() {
  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="space-y-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Notifications</h1>
            <p className="text-muted-foreground">
              Stay updated with your latest notifications
            </p>
          </div>
          <NotificationsList />
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  )
} 