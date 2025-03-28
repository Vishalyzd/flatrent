"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Target, Users, Sparkles, Shield } from "lucide-react"

const values = [
  {
    icon: Target,
    title: "Our Mission",
    description: "To revolutionize property search by making it engaging, efficient, and enjoyable for everyone.",
  },
  {
    icon: Users,
    title: "Our Vision",
    description: "To become the world's leading platform for finding dream properties through innovative technology.",
  },
  {
    icon: Sparkles,
    title: "Our Values",
    description: "Innovation, transparency, and customer satisfaction drive everything we do.",
  },
  {
    icon: Shield,
    title: "Our Promise",
    description: "We commit to providing accurate, up-to-date information and exceptional service.",
  },
]

export function MissionSection() {
  return (
    <div className="container">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {values.map((value) => (
          <Card key={value.title}>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="p-3 rounded-full bg-primary/10">
                  <value.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">{value.title}</h3>
                <p className="text-muted-foreground">{value.description}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
} 