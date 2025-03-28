"use client"

import Image from "next/image"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Heart, MapPin, BedDouble, Bath, Square } from "lucide-react"

const properties = [
  {
    id: 1,
    title: "Modern Downtown Apartment",
    price: "$450,000",
    location: "Downtown, City",
    beds: 2,
    baths: 2,
    sqft: 1200,
    image: "/properties/property-1.jpg",
    tags: ["New", "Furnished"],
  },
  {
    id: 2,
    title: "Luxury Villa with Pool",
    price: "$1,200,000",
    location: "Suburban Area",
    beds: 4,
    baths: 3,
    sqft: 2500,
    image: "/properties/property-2.jpg",
    tags: ["Luxury", "Pool"],
  },
  {
    id: 3,
    title: "Cozy Studio Apartment",
    price: "$280,000",
    location: "City Center",
    beds: 1,
    baths: 1,
    sqft: 800,
    image: "/properties/property-3.jpg",
    tags: ["Studio", "Modern"],
  },
]

export function PropertyGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {properties.map((property) => (
        <Card key={property.id} className="overflow-hidden">
          <div className="relative h-48">
            <Image
              src={property.image}
              alt={property.title}
              fill
              className="object-cover"
            />
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2 bg-background/80 hover:bg-background"
            >
              <Heart className="h-4 w-4" />
            </Button>
          </div>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold">{property.title}</h3>
                <p className="text-2xl font-bold text-primary">{property.price}</p>
              </div>
              <div className="flex gap-1">
                {property.tags.map((tag) => (
                  <Badge key={tag} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center text-muted-foreground text-sm mb-2">
              <MapPin className="h-4 w-4 mr-1" />
              {property.location}
            </div>
            <div className="flex gap-4 text-sm text-muted-foreground">
              <div className="flex items-center">
                <BedDouble className="h-4 w-4 mr-1" />
                {property.beds} beds
              </div>
              <div className="flex items-center">
                <Bath className="h-4 w-4 mr-1" />
                {property.baths} baths
              </div>
              <div className="flex items-center">
                <Square className="h-4 w-4 mr-1" />
                {property.sqft} sqft
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full">View Details</Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
} 