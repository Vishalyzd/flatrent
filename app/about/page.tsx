import { Card } from "@/components/ui/card"
import { Building2, Users, Shield, Heart } from "lucide-react"

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl mb-4">
          About FlatRent
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Your trusted platform for finding the perfect rental property. We connect tenants with property owners, making the rental process simple and transparent.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <Card className="p-6 text-center">
          <Building2 className="h-12 w-12 mx-auto mb-4 text-primary" />
          <h3 className="text-xl font-semibold mb-2">Quality Properties</h3>
          <p className="text-gray-600 dark:text-gray-400">
            Carefully curated listings of verified properties
          </p>
        </Card>

        <Card className="p-6 text-center">
          <Users className="h-12 w-12 mx-auto mb-4 text-primary" />
          <h3 className="text-xl font-semibold mb-2">Trusted Community</h3>
          <p className="text-gray-600 dark:text-gray-400">
            Verified sellers and reliable tenants
          </p>
        </Card>

        <Card className="p-6 text-center">
          <Shield className="h-12 w-12 mx-auto mb-4 text-primary" />
          <h3 className="text-xl font-semibold mb-2">Secure Platform</h3>
          <p className="text-gray-600 dark:text-gray-400">
            Safe transactions and data protection
          </p>
        </Card>

        <Card className="p-6 text-center">
          <Heart className="h-12 w-12 mx-auto mb-4 text-primary" />
          <h3 className="text-xl font-semibold mb-2">Customer Support</h3>
          <p className="text-gray-600 dark:text-gray-400">
            Dedicated assistance throughout your journey
          </p>
        </Card>
      </div>

      <div className="max-w-3xl mx-auto">
        <h2 className="text-3xl font-bold mb-6 text-center">Our Mission</h2>
        <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
          At FlatRent, we're committed to revolutionizing the rental property market by providing a seamless, transparent, and user-friendly platform. We believe in creating a community where property owners and tenants can connect with confidence and ease.
        </p>

        <h2 className="text-3xl font-bold mb-6 text-center">How It Works</h2>
        <div className="space-y-6">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center">
              1
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">List Your Property</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Property owners can easily list their properties with detailed information and high-quality images.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center">
              2
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">Verification Process</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Our team verifies all property listings to ensure quality and authenticity.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center">
              3
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">Connect with Tenants</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Property owners can connect with potential tenants through our secure messaging system.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 