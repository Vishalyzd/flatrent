"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/auth-context'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/components/ui/use-toast'
import { propertyService } from '@/lib/firebase/db'
import type { Property } from '@/types/database'
import { Plus, Trash2 } from 'lucide-react'
import { storage } from '@/lib/firebase'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'

export function PropertyForm() {
  const router = useRouter()
  const { user } = useAuth()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [images, setImages] = useState<File[]>([])
  const [previewUrls, setPreviewUrls] = useState<string[]>([])

  const [formData, setFormData] = useState<Partial<Property>>({
    title: '',
    description: '',
    price: 0,
    location: {
      address: '',
      city: '',
      country: '',
      coordinates: { lat: 0, lng: 0 },
    },
    bedrooms: 0,
    bathrooms: 0,
    area: 0,
    amenities: [],
    images: [],
    status: 'pending',
    sellerId: user?.id || '',
    rating: 0,
    reviewCount: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
  })

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    if (name.includes('.')) {
      const [parent, child] = name.split('.')
      setFormData((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent as keyof Property],
          [child]: value,
        },
      }))
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }))
    }
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    setImages((prev) => [...prev, ...files])
    
    // Create preview URLs
    const newPreviewUrls = files.map((file) => URL.createObjectURL(file))
    setPreviewUrls((prev) => [...prev, ...newPreviewUrls])
  }

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index))
    setPreviewUrls((prev) => {
      URL.revokeObjectURL(prev[index])
      return prev.filter((_, i) => i !== index)
    })
  }

  const handleAmenityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      amenities: checked
        ? [...(prev.amenities || []), value]
        : (prev.amenities || []).filter((amenity) => amenity !== value),
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    setLoading(true)
    try {
      // Upload images
      const imageUrls = await Promise.all(
        images.map(async (file) => {
          const storageRef = ref(storage, `properties/${user.id}/${file.name}`)
          const snapshot = await uploadBytes(storageRef, file)
          return getDownloadURL(snapshot.ref)
        })
      )

      // Create property with image URLs
      const propertyData: Property = {
        ...formData,
        images: imageUrls,
        sellerId: user.id,
        status: 'pending',
        createdAt: new Date(),
        updatedAt: new Date(),
      } as Property

      await propertyService.create(propertyData)

      toast({
        title: 'Success',
        description: 'Property submitted for approval',
      })
      router.push('/dashboard/properties')
    } catch (error) {
      console.error('Error creating property:', error)
      toast({
        title: 'Error',
        description: 'Failed to create property',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div>
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="price">Price (per month)</Label>
            <Input
              id="price"
              name="price"
              type="number"
              value={formData.price}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <Label htmlFor="area">Area (sq ft)</Label>
            <Input
              id="area"
              name="area"
              type="number"
              value={formData.area}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="bedrooms">Bedrooms</Label>
            <Input
              id="bedrooms"
              name="bedrooms"
              type="number"
              value={formData.bedrooms}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <Label htmlFor="bathrooms">Bathrooms</Label>
            <Input
              id="bathrooms"
              name="bathrooms"
              type="number"
              value={formData.bathrooms}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div>
          <Label htmlFor="location.address">Address</Label>
          <Input
            id="location.address"
            name="location.address"
            value={formData.location?.address}
            onChange={handleChange}
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="location.city">City</Label>
            <Input
              id="location.city"
              name="location.city"
              value={formData.location?.city}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <Label htmlFor="location.country">Country</Label>
            <Input
              id="location.country"
              name="location.country"
              value={formData.location?.country}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div>
          <Label>Images</Label>
          <div className="mt-2">
            <Input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageChange}
            />
          </div>
          {previewUrls.length > 0 && (
            <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-4">
              {previewUrls.map((url, index) => (
                <div key={index} className="relative">
                  <img
                    src={url}
                    alt={`Preview ${index + 1}`}
                    className="w-full h-32 object-cover rounded-md"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute top-2 right-2"
                    onClick={() => removeImage(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div>
          <Label>Amenities</Label>
          <div className="mt-2 grid grid-cols-2 md:grid-cols-3 gap-2">
            {[
              'WiFi',
              'Parking',
              'Air Conditioning',
              'Heating',
              'Kitchen',
              'Washer',
              'Dryer',
              'TV',
              'Pool',
              'Gym',
            ].map((amenity) => (
              <label key={amenity} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  value={amenity}
                  checked={formData.amenities?.includes(amenity)}
                  onChange={handleAmenityChange}
                />
                <span>{amenity}</span>
              </label>
            ))}
          </div>
        </div>
      </div>

      <div className="flex justify-end space-x-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push('/dashboard/properties')}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? 'Submitting...' : 'Submit Property'}
        </Button>
      </div>
    </form>
  )
} 