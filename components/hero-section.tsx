"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { ArrowRight, Home as HomeIcon, Building2, ChevronLeft, ChevronRight } from "lucide-react"
import Link from "next/link"

const heroImages = [
  "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=2075&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=2070&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1613490493576-7fde63acd811?q=80&w=2071&auto=format&fit=crop"
]

export function HeroSection() {
  const [currentImage, setCurrentImage] = useState(0)

  const nextImage = () => {
    setCurrentImage((prev) => (prev + 1) % heroImages.length)
  }

  const prevImage = () => {
    setCurrentImage((prev) => (prev - 1 + heroImages.length) % heroImages.length)
  }

  return (
    <section className="relative overflow-hidden">
      <div className="container px-4 md:px-6">
        <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
          <motion.div 
            className="flex flex-col justify-center space-y-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                Find Your Dream Home Through Play
              </h1>
              <p className="max-w-[600px] text-gray-500 md:text-xl dark:text-gray-400">
                Discover your perfect property through our unique gamified experience. Play, explore, and find your dream home.
              </p>
            </div>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <Button asChild size="lg">
                <Link href="/find-property">
                  Start Exploring
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link href="#how-it-works">
                  Learn More
                </Link>
              </Button>
            </div>
            <div className="flex gap-4 text-sm text-gray-500 dark:text-gray-400">
              <div className="flex items-center">
                <HomeIcon className="mr-2 h-4 w-4" />
                1000+ Properties
              </div>
              <div className="flex items-center">
                <Building2 className="mr-2 h-4 w-4" />
                All Property Types
              </div>
            </div>
          </motion.div>
          <motion.div 
            className="relative mx-auto aspect-video overflow-hidden rounded-xl sm:w-full lg:order-last"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="relative h-full w-full">
              {heroImages.map((image, index) => (
                <motion.img
                  key={image}
                  src={image}
                  alt={`Modern home ${index + 1}`}
                  className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-300 ${
                    index === currentImage ? "opacity-100" : "opacity-0"
                  }`}
                  initial={false}
                  animate={{ opacity: index === currentImage ? 1 : 0 }}
                  transition={{ duration: 0.5 }}
                />
              ))}
              <button
                onClick={prevImage}
                className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-2 text-gray-800 shadow-lg hover:bg-white"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-2 text-gray-800 shadow-lg hover:bg-white"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}