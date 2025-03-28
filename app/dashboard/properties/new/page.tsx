"use client"

import { DashboardLayout } from '@/components/dashboard/dashboard-layout'
import { ProtectedRoute } from '@/components/protected-route'
import { PropertyForm } from '@/components/property/property-form'

export default function NewPropertyPage() {
  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold">Add New Property</h1>
            <p className="text-muted-foreground">
              Fill in the details of your property. It will be reviewed by our team before being published.
            </p>
          </div>
          <PropertyForm />
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  )
} 