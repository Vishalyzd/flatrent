"use client"

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Slider } from '@/components/ui/slider'
import { propertyService } from '@/lib/firebase/db'
import type { Property } from '@/types/database'
import { MapPin, Star, Search, Filter } from 'lucide-react'

export default function FindPropertyPage() {
  const searchParams = useSearchParams()
  const [properties, setProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    location: searchParams.get('location') || '',
    minPrice: 0,
    maxPrice: 10000,
    bedrooms: 'all',
    propertyType: 'all',
  })

  useEffect(() => {
    loadProperties()
  }, [filters])

  const loadProperties = async () => {
    try {
      const activeProperties = await propertyService.getByStatus('active')
      let filteredProperties = activeProperties

      // Apply filters
      if (filters.location) {
        filteredProperties = filteredProperties.filter((property) =>
          property.location.city.toLowerCase().includes(filters.location.toLowerCase()) ||
          property.location.country.toLowerCase().includes(filters.location.toLowerCase())
        )
      }

      if (filters.minPrice > 0) {
        filteredProperties = filteredProperties.filter(
          (property) => property.pricing.monthly || property.pricing.nightly * 30 >= filters.minPrice
        )
      }

      if (filters.maxPrice < 10000) {
        filteredProperties = filteredProperties.filter(
          (property) => property.pricing.monthly || property.pricing.nightly * 30 <= filters.maxPrice
        )
      }

      if (filters.bedrooms !== 'all') {
        filteredProperties = filteredProperties.filter(
          (property) => property.details.bedrooms === parseInt(filters.bedrooms)
        )
      }

      if (filters.propertyType !== 'all') {
        filteredProperties = filteredProperties.filter(
          (property) => property.details.propertyType === filters.propertyType
        )
      }

      setProperties(filteredProperties)
    } catch (error) {
      console.error('Error loading properties:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Filters Sidebar */}
        <div className="w-full md:w-64 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Filter className="h-5 w-5" />
                Filters
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium">Location</label>
                <Input
                  placeholder="Enter city or country"
                  value={filters.location}
                  onChange={(e) =>
                    setFilters((prev) => ({ ...prev, location: e.target.value }))
                  }
                />
              </div>

              <div>
                <label className="text-sm font-medium">Price Range</label>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    value={filters.minPrice}
                    onChange={(e) =>
                      setFilters((prev) => ({
                        ...prev,
                        minPrice: parseInt(e.target.value) || 0,
                      }))
                    }
                    className="w-24"
                  />
                  <span>-</span>
                  <Input
                    type="number"
                    value={filters.maxPrice}
                    onChange={(e) =>
                      setFilters((prev) => ({
                        ...prev,
                        maxPrice: parseInt(e.target.value) || 10000,
                      }))
                    }
                    className="w-24"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium">Bedrooms</label>
                <Select
                  value={filters.bedrooms}
                  onValueChange={(value) =>
                    setFilters((prev) => ({ ...prev, bedrooms: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select bedrooms" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Any</SelectItem>
                    <SelectItem value="1">1</SelectItem>
                    <SelectItem value="2">2</SelectItem>
                    <SelectItem value="3">3</SelectItem>
                    <SelectItem value="4">4+</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium">Property Type</label>
                <Select
                  value={filters.propertyType}
                  onValueChange={(value) =>
                    setFilters((prev) => ({ ...prev, propertyType: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Any</SelectItem>
                    <SelectItem value="apartment">Apartment</SelectItem>
                    <SelectItem value="house">House</SelectItem>
                    <SelectItem value="condo">Condo</SelectItem>
                    <SelectItem value="villa">Villa</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Property List */}
        <div className="flex-1">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">Available Properties</h1>
            <p className="text-gray-600">
              {properties.length} properties found
            </p>
          </div>

          {loading ? (
            <div>Loading...</div>
          ) : properties.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-8">
                <p className="text-muted-foreground">No properties found</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {properties.map((property) => (
                <Card key={property.id} className="overflow-hidden">
                  <div className="relative h-48">
                    <img
                      src={property.images[0]}
                      alt={property.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 right-2 bg-white px-2 py-1 rounded-full text-sm font-semibold">
                      ${property.pricing.monthly || property.pricing.nightly * 30}/month
                    </div>
                  </div>
                  <CardHeader>
                    <CardTitle className="text-lg">{property.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <MapPin className="h-4 w-4" />
                      <span>{property.location.city}, {property.location.country}</span>
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="text-sm">{property.rating.toFixed(1)}</span>
                      <span className="text-sm text-gray-600">
                        ({property.reviewCount} reviews)
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 