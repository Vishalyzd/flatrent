import { HeroSection } from "@/components/hero-section"
import { HowItWorks } from "@/components/how-it-works"
import { GameSection } from "@/components/game-section"
import { PropertySlider } from "@/components/property-slider"
import { Testimonials } from "@/components/testimonials"
import { ContactForm } from "@/components/contact-form"

export default function HomePage() {
  return (
    <div className="flex flex-col gap-20 py-8">
      <HeroSection />
      <HowItWorks />
      <GameSection />
      <PropertySlider />
      <Testimonials />
      <ContactForm />
    </div>
  )
}