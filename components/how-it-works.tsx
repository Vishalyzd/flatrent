"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Gamepad2, Search, Heart, Key } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { useToast } from "@/hooks/use-toast"

const steps = [
  {
    title: "Play the Game",
    description: "Start with our interactive property preference game",
    icon: Gamepad2,
    reward: "🎮 Game Master Badge"
  },
  {
    title: "Discover Properties",
    description: "Get personalized property recommendations based on your gameplay",
    icon: Search,
    reward: "🔍 Property Explorer Badge"
  },
  {
    title: "Save Favorites",
    description: "Create a collection of properties that match your preferences",
    icon: Heart,
    reward: "⭐ Collection Pro Badge"
  },
  {
    title: "Make It Yours",
    description: "Schedule viewings and make your dream home a reality",
    icon: Key,
    reward: "🏠 Home Finder Badge"
  }
]

export function HowItWorks() {
  const [clickCount, setClickCount] = useState(0)
  const [unlockedRewards, setUnlockedRewards] = useState<string[]>([])
  const { toast } = useToast()

  const handleClick = () => {
    const newCount = clickCount + 1
    setClickCount(newCount)

    if (newCount % 5 === 0 && unlockedRewards.length < steps.length) {
      const newReward = steps[unlockedRewards.length].reward
      setUnlockedRewards([...unlockedRewards, newReward])
      toast({
        title: "New Reward Unlocked! 🎉",
        description: `You've earned: ${newReward}`,
      })
    }
  }

  return (
    <section className="py-12 bg-secondary/50" id="how-it-works">
      <div className="container px-4 md:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">How It Works</h2>
          <p className="mt-4 text-gray-500 md:text-xl dark:text-gray-400">
            Four simple steps to find your perfect home
          </p>
          <div className="mt-6 space-y-4">
            <Button 
              onClick={handleClick}
              size="lg"
              className="animate-pulse"
            >
              Click to Earn Rewards! ({clickCount})
            </Button>
            <Progress value={(unlockedRewards.length / steps.length) * 100} className="w-full max-w-md mx-auto" />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={step.title}
              className="flex flex-col items-center text-center p-6 bg-background rounded-lg shadow-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className="rounded-full bg-primary/10 p-4 mb-4">
                <step.icon className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">{step.title}</h3>
              <p className="text-gray-500 dark:text-gray-400 mb-4">{step.description}</p>
              {unlockedRewards.includes(step.reward) && (
                <div className="text-2xl animate-bounce">{step.reward}</div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}