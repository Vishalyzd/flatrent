"use client"

import { useEffect, useState } from 'react'
import { useAuth } from '@/contexts/auth-context'
import { useRouter } from 'next/navigation'
import { DashboardLayout } from '@/components/dashboard/dashboard-layout'
import { ProtectedRoute } from '@/components/protected-route'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { propertyService } from '@/lib/firebase/db'
import type { Property } from '@/types/database'
import { Check, X } from 'lucide-react'
import { db } from "@/lib/firebase/config"
import { collection, query, where, getDocs, updateDoc, doc } from "firebase/firestore"
import { toast } from "sonner"

export default function AdminPropertiesPage() {
  const [properties, setProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!user) {
      router.push("/login")
      return
    }

    const fetchProperties = async () => {
      try {
        const q = query(collection(db, "properties"), where("status", "==", "pending"))
        const querySnapshot = await getDocs(q)
        const propertiesData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Property[]
        setProperties(propertiesData)
      } catch (error) {
        console.error("Error fetching properties:", error)
        toast.error("Failed to fetch properties")
      } finally {
        setLoading(false)
      }
    }

    fetchProperties()
  }, [user, router])

  const handleStatusUpdate = async (propertyId: string, status: "approved" | "rejected") => {
    try {
      const propertyRef = doc(db, "properties", propertyId)
      await updateDoc(propertyRef, {
        status,
        updatedAt: new Date().toISOString(),
      })

      setProperties(prev => prev.filter(p => p.id !== propertyId))
      toast.success(`Property ${status}`)
    } catch (error) {
      console.error("Error updating property status:", error)
      toast.error("Failed to update property status")
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Loading...</div>
      </div>
    )
  }

  if (!user || user.role !== 'admin') {
    return null
  }

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold">Property Approvals</h1>
            <p className="text-muted-foreground">
              Review and approve pending property listings.
            </p>
          </div>

          {properties.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-8">
                <p className="text-muted-foreground">No pending properties to review</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {properties.map((property) => (
                <Card key={property.id}>
                  <CardHeader>
                    <CardTitle>{property.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <p className="text-sm text-muted-foreground">{property.description}</p>
                      <div className="flex justify-end space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleStatusUpdate(property.id, "rejected")}
                        >
                          <X className="h-4 w-4 mr-2" />
                          Reject
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => handleStatusUpdate(property.id, "approved")}
                        >
                          <Check className="h-4 w-4 mr-2" />
                          Approve
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  )
} 