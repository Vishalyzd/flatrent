"use client"

import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Linkedin, Twitter } from "lucide-react"

const team = [
  {
    name: "John Doe",
    role: "CEO & Founder",
    image: "/team/john-doe.jpg",
    bio: "15+ years of experience in real estate technology",
    social: {
      linkedin: "https://linkedin.com",
      twitter: "https://twitter.com",
    },
  },
  {
    name: "Jane Smith",
    role: "CTO",
    image: "/team/jane-smith.jpg",
    bio: "Expert in AI and machine learning",
    social: {
      linkedin: "https://linkedin.com",
      twitter: "https://twitter.com",
    },
  },
  {
    name: "Mike Johnson",
    role: "Head of Design",
    image: "/team/mike-johnson.jpg",
    bio: "Award-winning UX designer",
    social: {
      linkedin: "https://linkedin.com",
      twitter: "https://twitter.com",
    },
  },
]

export function TeamSection() {
  return (
    <div className="container">
      <div className="text-center space-y-4 mb-12">
        <h2 className="text-3xl font-bold">Meet Our Team</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          The passionate individuals behind Nirvasana who are dedicated to revolutionizing property search.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {team.map((member) => (
          <Card key={member.name}>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="relative w-32 h-32 rounded-full overflow-hidden">
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <h3 className="text-xl font-semibold">{member.name}</h3>
                  <p className="text-primary">{member.role}</p>
                  <p className="text-muted-foreground mt-2">{member.bio}</p>
                </div>
                <div className="flex gap-4">
                  <a
                    href={member.social.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-primary"
                  >
                    <Linkedin className="h-5 w-5" />
                  </a>
                  <a
                    href={member.social.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-primary"
                  >
                    <Twitter className="h-5 w-5" />
                  </a>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
} 