"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Building2, Trees, Citrus as City, Bean as Beach, Mountain } from "lucide-react"
import type { GameState } from "@/lib/types"

const locations = [
  { name: "Urban", icon: City },
  { name: "Suburban", icon: Building2 },
  { name: "Rural", icon: Trees },
  { name: "Coastal", icon: Beach },
  { name: "Mountain", icon: Mountain },
]

export function GameSection() {
  const [gameState, setGameState] = useState<GameState>({
    score: 0,
    level: 1,
    completed: false,
    preferences: {
      location: [],
      propertyType: [],
      priceRange: [0, 1000000],
      amenities: [],
    },
  })

  const [currentStep, setCurrentStep] = useState(0)

  const handleLocationSelect = (location: string) => {
    setGameState(prev => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        location: [...prev.preferences.location, location],
      },
      score: prev.score + 10,
    }))
  }

  return (
    <section className="py-12">
      <div className="container px-4 md:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
            Property Preference Game
          </h2>
          <p className="mt-4 text-gray-500 md:text-xl dark:text-gray-400">
            Play our interactive game to discover your perfect property match
          </p>
        </div>

        <Card className="max-w-3xl mx-auto p-8">
          <div className="mb-8">
            <div className="flex justify-between mb-2 text-sm">
              <span>Progress</span>
              <span>Level {gameState.level}</span>
            </div>
            <Progress value={33} />
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              <h3 className="text-2xl font-bold text-center">
                Where would you like to live?
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {locations.map((location) => (
                  <Button
                    key={location.name}
                    variant="outline"
                    className="h-24 flex flex-col gap-2"
                    onClick={() => handleLocationSelect(location.name)}
                  >
                    <location.icon className="h-8 w-8" />
                    {location.name}
                  </Button>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>

          <div className="mt-8 flex justify-between">
            <Button
              variant="outline"
              disabled={currentStep === 0}
              onClick={() => setCurrentStep(prev => prev - 1)}
            >
              Previous
            </Button>
            <Button
              onClick={() => setCurrentStep(prev => prev + 1)}
            >
              Next
            </Button>
          </div>
        </Card>
      </div>
    </section>
  )
}