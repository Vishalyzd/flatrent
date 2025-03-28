import { useNotifications } from '@/contexts/notification-context'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { formatDistanceToNow } from 'date-fns'
import { Badge } from '@/components/ui/badge'

export function NotificationsList() {
  const { notifications, markAsRead, markAllAsRead } = useNotifications()

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button
          variant="outline"
          onClick={() => markAllAsRead()}
          disabled={notifications.length === 0}
        >
          Mark all as read
        </Button>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Message</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Time</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {notifications.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center">
                  No notifications found
                </TableCell>
              </TableRow>
            ) : (
              notifications.map((notification) => (
                <TableRow key={notification.id}>
                  <TableCell className="font-medium">
                    {notification.title}
                  </TableCell>
                  <TableCell>{notification.message}</TableCell>
                  <TableCell>
                    {!notification.read && (
                      <Badge variant="secondary">Unread</Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    {formatDistanceToNow(notification.createdAt, {
                      addSuffix: true,
                    })}
                  </TableCell>
                  <TableCell className="text-right">
                    {!notification.read && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => markAsRead(notification.id)}
                      >
                        Mark as read
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
} 