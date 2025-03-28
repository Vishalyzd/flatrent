"use client"

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/auth-context'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useToast } from '@/components/ui/use-toast'
import { propertyService } from '@/lib/firebase/db'
import type { Property } from '@/types/database'
import { Edit, Trash2, Plus, MapPin, Home, Users, Bath, Ruler } from 'lucide-react'

export function PropertiesList() {
  const [properties, setProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    if (user?.role === 'seller') {
      loadProperties()
    } else {
      setLoading(false)
    }
  }, [user])

  const loadProperties = async () => {
    try {
      const sellerProperties = await propertyService.getBySellerId(user!.id)
      setProperties(sellerProperties)
    } catch (error) {
      console.error('Error loading properties:', error)
      toast({
        title: 'Error',
        description: 'Failed to load properties',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      await propertyService.delete(id)
      setProperties(properties.filter((p) => p.id !== id))
      toast({
        title: 'Success',
        description: 'Property deleted successfully',
      })
    } catch (error) {
      console.error('Error deleting property:', error)
      toast({
        title: 'Error',
        description: 'Failed to delete property',
        variant: 'destructive',
      })
    }
  }

  if (loading) {
    return <div>Loading...</div>
  }

  if (!user || user.role !== 'seller') {
    return null
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold tracking-tight">My Properties</h2>
        <Button onClick={() => router.push('/dashboard/properties/new')}>
          <Plus className="mr-2 h-4 w-4" />
          Add Property
        </Button>
      </div>

      {properties.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-8">
            <p className="text-muted-foreground">No properties found</p>
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => router.push('/dashboard/properties/new')}
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Your First Property
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {properties.map((property) => (
            <Card key={property.id}>
              <div className="relative h-48">
                <img
                  src={property.images[0]}
                  alt={property.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 right-2">
                  <Badge variant={property.status === 'active' ? 'default' : 'secondary'}>
                    {property.status}
                  </Badge>
                </div>
              </div>
              <CardHeader>
                <CardTitle className="text-lg">{property.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <MapPin className="mr-1 h-4 w-4" />
                    <span>{property.location.city}, {property.location.country}</span>
                  </div>
                  <div className="flex items-center space-x-4 text-sm">
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
                  <div className="flex justify-between items-center">
                    <p className="text-lg font-semibold">
                      ${property.pricing.monthly || property.pricing.nightly * 30}/month
                    </p>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => router.push(`/dashboard/properties/${property.id}/edit`)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleDelete(property.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
} 