"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Phone, Mail, MapPin, Clock } from "lucide-react"

const contactInfo = [
  {
    icon: Phone,
    title: "Phone",
    content: "+1 (555) 123-4567",
    link: "tel:+15551234567",
  },
  {
    icon: Mail,
    title: "Email",
    content: "contact@nirvasana.com",
    link: "mailto:contact@nirvasana.com",
  },
  {
    icon: MapPin,
    title: "Address",
    content: "123 Property Street, City, Country",
    link: "https://maps.google.com",
  },
  {
    icon: Clock,
    title: "Working Hours",
    content: "Mon - Fri: 9:00 AM - 6:00 PM",
  },
]

export function ContactInfo() {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-8">
          <div>
            <h2 className="text-2xl font-bold mb-4">Get in Touch</h2>
            <p className="text-muted-foreground">
              Have questions about our services? We're here to help. Reach out to us through any of the following channels.
            </p>
          </div>
          <div className="space-y-6">
            {contactInfo.map((info) => (
              <div key={info.title} className="flex items-start space-x-4">
                <div className="p-2 rounded-full bg-primary/10">
                  <info.icon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold">{info.title}</h3>
                  {info.link ? (
                    <a
                      href={info.link}
                      target={info.link.startsWith("http") ? "_blank" : undefined}
                      rel={info.link.startsWith("http") ? "noopener noreferrer" : undefined}
                      className="text-muted-foreground hover:text-primary"
                    >
                      {info.content}
                    </a>
                  ) : (
                    <p className="text-muted-foreground">{info.content}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
} 