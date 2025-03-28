"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Bed, Bath, Square, ArrowRight, ChevronLeft, ChevronRight } from "lucide-react"
import Link from "next/link"

const properties = [
  {
    id: "1",
    title: "Modern Villa with Pool",
    price: "$1,200,000",
    location: "Beverly Hills, CA",
    bedrooms: 4,
    bathrooms: 3,
    area: 3200,
    image: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?q=80&w=2071&auto=format&fit=crop",
    type: "Villa"
  },
  {
    id: "2",
    title: "Luxury Penthouse",
    price: "$2,500,000",
    location: "Manhattan, NY",
    bedrooms: 3,
    bathrooms: 2,
    area: 2800,
    image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=2070&auto=format&fit=crop",
    type: "Penthouse"
  },
  {
    id: "3",
    title: "Seaside Cottage",
    price: "$800,000",
    location: "Malibu, CA",
    bedrooms: 2,
    bathrooms: 2,
    area: 1500,
    image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=2075&auto=format&fit=crop",
    type: "Cottage"
  }
]

export function PropertySlider() {
  const [currentSlide, setCurrentSlide] = useState(0)

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % properties.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + properties.length) % properties.length)
  }

  return (
    <section className="py-16">
      <div className="container px-4 md:px-6">
        <div className="flex justify-between items-center mb-12">
          <div>
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              Featured Properties
            </h2>
            <p className="mt-4 text-gray-500 md:text-xl dark:text-gray-400">
              Discover our handpicked selection of premium properties
            </p>
          </div>
        </div>

        <div className="relative">
          <div className="overflow-hidden">
            <div 
              className="flex transition-transform duration-300 ease-in-out"
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
              {properties.map((property) => (
                <div key={property.id} className="w-full flex-shrink-0 px-4">
                  <Card className="overflow-hidden">
                    <div className="relative aspect-video">
                      <img
                        src={property.image}
                        alt={property.title}
                        className="object-cover w-full h-full"
                      />
                      <Badge className="absolute top-4 right-4">{property.type}</Badge>
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-bold mb-2">{property.title}</h3>
                      <p className="text-2xl font-bold text-primary mb-4">{property.price}</p>
                      <p className="text-gray-500 mb-4">{property.location}</p>
                      <div className="flex justify-between mb-6">
                        <div className="flex items-center">
                          <Bed className="h-4 w-4 mr-2" />
                          <span>{property.bedrooms} beds</span>
                        </div>
                        <div className="flex items-center">
                          <Bath className="h-4 w-4 mr-2" />
                          <span>{property.bathrooms} baths</span>
                        </div>
                        <div className="flex items-center">
                          <Square className="h-4 w-4 mr-2" />
                          <span>{property.area} sq ft</span>
                        </div>
                      </div>
                      <Button asChild className="w-full">
                        <Link href={`/property/${property.id}`}>
                          View Details
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                      </Button>
                    </div>
                  </Card>
                </div>
              ))}
            </div>
          </div>
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-2 text-gray-800 shadow-lg hover:bg-white"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-2 text-gray-800 shadow-lg hover:bg-white"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        </div>
      </div>
    </section>
  )
}