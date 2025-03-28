import { ContactForm } from "@/components/contact-form"
import { ContactInfo } from "@/components/contact-info"
import { MapSection } from "@/components/map-section"

export default function ContactPage() {
  return (
    <div className="flex flex-col gap-20 py-8">
      <div className="container space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold">Contact Us</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
          </p>
        </div>
      </div>
      
      <div className="container grid grid-cols-1 md:grid-cols-2 gap-8">
        <ContactInfo />
        <ContactForm />
      </div>
      
      <MapSection />
    </div>
  )
} 