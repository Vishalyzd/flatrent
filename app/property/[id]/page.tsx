import { notFound } from 'next/navigation'
import { propertyService } from '@/lib/firebase/db'
import { PropertyDetails } from '@/components/property/property-details'

interface PropertyPageProps {
  params: {
    id: string
  }
}

export default async function PropertyPage({ params }: PropertyPageProps) {
  const property = await propertyService.getById(params.id)

  if (!property) {
    notFound()
  }

  return <PropertyDetails property={property} />
} 