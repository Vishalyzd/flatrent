"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { db } from "@/lib/firebase/config"
import { collection, query, where, getDocs } from "firebase/firestore"
import { toast } from "sonner"

interface Property {
  id: string
  title: string
  description: string
  price: number
  location: string
  propertyType: string
  bedrooms: number
  bathrooms: number
  area: number
  amenities: string[]
  status: "pending" | "approved" | "rejected"
  createdAt: string
  sellerId: string
}

export default function PropertiesPage() {
  const router = useRouter()
  const [properties, setProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [propertyType, setPropertyType] = useState("")

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const q = query(collection(db, "properties"), where("status", "==", "approved"))
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
  }, [])

  const filteredProperties = properties.filter(property => {
    const matchesSearch = property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      property.location.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = !propertyType || property.propertyType === propertyType
    return matchesSearch && matchesType
  })

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Loading...</div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Available Properties</h1>
        <Button onClick={() => router.push("/")}>Back to Home</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <Input
          placeholder="Search by title or location..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Select value={propertyType} onValueChange={setPropertyType}>
          <SelectTrigger>
            <SelectValue placeholder="Filter by property type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Types</SelectItem>
            <SelectItem value="apartment">Apartment</SelectItem>
            <SelectItem value="house">House</SelectItem>
            <SelectItem value="villa">Villa</SelectItem>
            <SelectItem value="studio">Studio</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProperties.map((property) => (
          <Card key={property.id} className="overflow-hidden">
            <div className="aspect-video bg-gray-100" />
            <div className="p-6">
              <div className="flex justify-between items-start mb-2">
                <h2 className="text-xl font-semibold">{property.title}</h2>
                <Badge variant="outline">{property.propertyType}</Badge>
              </div>
              <p className="text-gray-600 dark:text-gray-400 mb-4">{property.location}</p>
              
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div>
                  <p className="text-sm text-gray-500">Price</p>
                  <p className="font-semibold">₹{property.price.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Bedrooms</p>
                  <p className="font-semibold">{property.bedrooms}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Bathrooms</p>
                  <p className="font-semibold">{property.bathrooms}</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mb-4">
                {property.amenities.slice(0, 3).map((amenity, index) => (
                  <Badge key={index} variant="secondary">
                    {amenity}
                  </Badge>
                ))}
              </div>

              <Button
                className="w-full"
                onClick={() => router.push(`/properties/${property.id}`)}
              >
                View Details
              </Button>
            </div>
          </Card>
        ))}

        {filteredProperties.length === 0 && (
          <div className="col-span-full text-center py-12">
            <p className="text-gray-500">No properties found matching your criteria</p>
          </div>
        )}
      </div>
    </div>
  )
} 