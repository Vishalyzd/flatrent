"use client"

import { DashboardLayout } from '@/components/dashboard/dashboard-layout'
import { ProtectedRoute } from '@/components/protected-route'
import { useAuth } from '@/contexts/auth-context'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Plus, Home, Calendar, MessageSquare, Star } from 'lucide-react'
import Link from 'next/link'
import { DashboardOverview } from '@/components/dashboard/dashboard-overview'

export default function DashboardPage() {
  const { user } = useAuth()

  if (!user) return null

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="space-y-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground">
              Welcome to your dashboard overview
            </p>
          </div>
          <DashboardOverview />
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  )
} 