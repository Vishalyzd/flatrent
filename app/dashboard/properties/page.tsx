"use client"

import { DashboardLayout } from '@/components/dashboard/dashboard-layout'
import { ProtectedRoute } from '@/components/protected-route'
import { PropertiesList } from '@/components/property/properties-list'

export default function PropertiesPage() {
  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="space-y-4">
          <PropertiesList />
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  )
} 