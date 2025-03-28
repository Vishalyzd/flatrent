"use client"

import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Avatar } from "@/components/ui/avatar"
import { Quote } from "lucide-react"
import type { Testimonial } from "@/lib/types"

const testimonials: Testimonial[] = [
  {
    id: "1",
    name: "Sarah Johnson",
    role: "First-time Homebuyer",
    content: "The gamified approach made house hunting fun! I found my dream home in half the time I expected.",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=256&h=256&q=80"
  },
  {
    id: "2",
    name: "Michael Chen",
    role: "Property Investor",
    content: "This platform's unique approach helped me understand market trends better. Highly recommended!",
    avatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=256&h=256&q=80"
  },
  {
    id: "3",
    name: "Emma Davis",
    role: "Real Estate Agent",
    content: "My clients love the interactive experience. It's revolutionizing how we match buyers with properties.",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=256&h=256&q=80"
  }
]

export function Testimonials() {
  return (
    <section className="py-16 bg-secondary/30">
      <div className="container px-4 md:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
            What Our Users Say
          </h2>
          <p className="mt-4 text-gray-500 md:text-xl dark:text-gray-400">
            Hear from people who found their perfect home through our platform
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="p-6 h-full flex flex-col">
                <div className="mb-4">
                  <Quote className="h-8 w-8 text-primary/40" />
                </div>
                <p className="flex-1 text-gray-600 dark:text-gray-300 mb-6">
                  "{testimonial.content}"
                </p>
                <div className="flex items-center gap-4">
                  <Avatar className="h-12 w-12">
                    <img
                      alt={testimonial.name}
                      src={testimonial.avatar}
                      className="object-cover"
                    />
                  </Avatar>
                  <div>
                    <h4 className="font-semibold">{testimonial.name}</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {testimonial.role}
                    </p>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}