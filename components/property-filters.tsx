"use client"

import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function PropertyFilters() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Filters</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <Label>Price Range</Label>
          <Slider
            defaultValue={[0, 1000000]}
            max={1000000}
            step={10000}
            className="py-4"
          />
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>$0</span>
            <span>$1,000,000</span>
          </div>
        </div>

        <div className="space-y-4">
          <Label>Bedrooms</Label>
          <div className="grid grid-cols-2 gap-2">
            {[1, 2, 3, 4, 5].map((num) => (
              <div key={num} className="flex items-center space-x-2">
                <Checkbox id={`bedroom-${num}`} />
                <Label htmlFor={`bedroom-${num}`}>{num}+</Label>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <Label>Bathrooms</Label>
          <div className="grid grid-cols-2 gap-2">
            {[1, 2, 3, 4].map((num) => (
              <div key={num} className="flex items-center space-x-2">
                <Checkbox id={`bathroom-${num}`} />
                <Label htmlFor={`bathroom-${num}`}>{num}+</Label>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <Label>Amenities</Label>
          <div className="space-y-2">
            {["Parking", "Pool", "Gym", "Security", "Elevator"].map((amenity) => (
              <div key={amenity} className="flex items-center space-x-2">
                <Checkbox id={amenity.toLowerCase()} />
                <Label htmlFor={amenity.toLowerCase()}>{amenity}</Label>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
} 