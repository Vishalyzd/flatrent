"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Users, Home, Star, Award } from "lucide-react"

const stats = [
  {
    icon: Users,
    value: "10K+",
    label: "Happy Clients",
  },
  {
    icon: Home,
    value: "5K+",
    label: "Properties Listed",
  },
  {
    icon: Star,
    value: "4.8/5",
    label: "Customer Rating",
  },
  {
    icon: Award,
    value: "15+",
    label: "Years Experience",
  },
]

export function StatsSection() {
  return (
    <div className="container">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center space-y-2">
                <div className="p-3 rounded-full bg-primary/10">
                  <stat.icon className="h-6 w-6 text-primary" />
                </div>
                <div className="text-3xl font-bold">{stat.value}</div>
                <div className="text-muted-foreground">{stat.label}</div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
} 