"use client"

import { useEffect, useRef } from "react"
import { Card } from "@/components/ui/card"
import { MapPin, Navigation } from "lucide-react"

interface YachtLocationMapProps {
  location: string
  yachtName: string
  className?: string
}

export default function YachtLocationMap({ location, yachtName, className = "" }: YachtLocationMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)

  // Mock coordinates for different locations
  const locationCoordinates: { [key: string]: { lat: number; lng: number; zoom: number } } = {
    "Miami, FL": { lat: 25.7617, lng: -80.1918, zoom: 12 },
    "Key West, FL": { lat: 24.5551, lng: -81.7816, zoom: 12 },
    "Key Largo, FL": { lat: 25.0865, lng: -80.4473, zoom: 12 },
    "Fort Lauderdale, FL": { lat: 26.1224, lng: -80.1373, zoom: 12 },
    "Boca Raton, FL": { lat: 26.3683, lng: -80.1289, zoom: 12 }
  }

  const coords = locationCoordinates[location] || locationCoordinates["Miami, FL"]

  useEffect(() => {
    // In a real implementation, you would load Google Maps API here
    // For now, we'll create a placeholder with a static map image
    if (mapRef.current) {
      const mapUrl = `https://maps.googleapis.com/maps/api/staticmap?center=${coords.lat},${coords.lng}&zoom=${coords.zoom}&size=600x300&maptype=hybrid&markers=color:red%7C${coords.lat},${coords.lng}&key=YOUR_API_KEY`
      
      // For demo purposes, we'll use a placeholder
      mapRef.current.innerHTML = `
        <div class="w-full h-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white">
          <div class="text-center">
            <div class="text-4xl mb-2">🗺️</div>
            <div class="text-lg font-semibold">${location}</div>
            <div class="text-sm opacity-80">${yachtName} Location</div>
            <div class="text-xs mt-2 opacity-60">Interactive map would be displayed here</div>
          </div>
        </div>
      `
    }
  }, [location, yachtName, coords])

  return (
    <Card className={`p-6 ${className}`}>
      <div className="flex items-center gap-2 mb-4">
        <MapPin className="h-5 w-5 text-primary" />
        <h3 className="text-lg font-semibold">Yacht Location</h3>
      </div>
      
      <div 
        ref={mapRef}
        className="w-full h-64 rounded-lg overflow-hidden border"
      />
      
      <div className="mt-4 space-y-2">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Navigation className="h-4 w-4" />
          <span>Docked at: {location}</span>
        </div>
        <div className="text-xs text-muted-foreground">
          Popular destinations: South Beach, Biscayne Bay, Key Biscayne
        </div>
      </div>
    </Card>
  )
}
