"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { X, Plus, Upload, Calendar, MapPin, Users, Ruler } from "lucide-react"
import { createClient } from "@/utils/supabase/client"

interface YachtFormProps {
  onSuccess?: () => void
  onCancel?: () => void
}

const yachtTypes = ["Motor Yacht", "Sailing Yacht", "Catamaran", "Superyacht", "Sport Yacht", "Fishing Yacht"]
const availableAmenities = [
  "WiFi", "Air Conditioning", "Jacuzzi", "Diving Equipment", "Chef Service",
  "Wine Cellar", "Helipad", "Gym", "Sauna", "Fishing Gear",
  "Kayaks", "Snorkeling Equipment", "Water Sports", "Entertainment System", "Bar", "Spa Services"
]

export default function YachtForm({ onSuccess, onCancel }: YachtFormProps) {
  const supabase = createClient()
  const [formData, setFormData] = useState({
    name: "",
    type: "",
    price: "",
    rating: "",
    reviews: "",
    location: "",
    guests: "",
    length: "",
    description: "",
    amenities: [] as string[],
    unavailableDates: [] as string[],
    images: [] as string[], // storing base64
    videos: [] as string[]  // storing base64
  })
  const [newAmenity, setNewAmenity] = useState("")
  const [newUnavailableDate, setNewUnavailableDate] = useState("")
  const [newImageFile, setNewImageFile] = useState<File | null>(null)
  const [newVideoFile, setNewVideoFile] = useState<File | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const addAmenity = () => {
    if (newAmenity && !formData.amenities.includes(newAmenity)) {
      setFormData(prev => ({ ...prev, amenities: [...prev.amenities, newAmenity] }))
      setNewAmenity("")
    }
  }
  const removeAmenity = (a: string) => setFormData(prev => ({ ...prev, amenities: prev.amenities.filter(x => x !== a) }))
  const addUnavailableDate = () => {
    if (newUnavailableDate && !formData.unavailableDates.includes(newUnavailableDate)) {
      setFormData(prev => ({ ...prev, unavailableDates: [...prev.unavailableDates, newUnavailableDate] }))
      setNewUnavailableDate("")
    }
  }
  const removeUnavailableDate = (d: string) => setFormData(prev => ({ ...prev, unavailableDates: prev.unavailableDates.filter(x => x !== d) }))

  const fileToBase64 = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => resolve(reader.result as string)
      reader.onerror = error => reject(error)
    })

  const handleAddImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return
    const file = e.target.files[0]
    if (!file) return
    if (formData.images.length >= 8) return alert("Maximum 8 images allowed")
    const base64 = await fileToBase64(file)
    setFormData(prev => ({ ...prev, images: [...prev.images, base64] }))
    e.target.value = ""
  }

  const handleAddVideo = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return
    const file = e.target.files[0]
    if (!file) return
    if (formData.videos.length >= 2) return alert("Maximum 2 videos allowed")
    const base64 = await fileToBase64(file)
    setFormData(prev => ({ ...prev, videos: [...prev.videos, base64] }))
    e.target.value = ""
  }

  const removeImage = (index: number) => setFormData(prev => ({ ...prev, images: prev.images.filter((_, i) => i !== index) }))
  const removeVideo = (index: number) => setFormData(prev => ({ ...prev, videos: prev.videos.filter((_, i) => i !== index) }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      const { error } = await supabase.from("yachts").insert([{
        name: formData.name,
        type: formData.type,
        price: parseFloat(formData.price),
        rating: parseFloat(formData.rating) || 0,
        reviews: parseInt(formData.reviews) || 0,
        location: formData.location,
        guests: parseInt(formData.guests),
        length: parseFloat(formData.length),
        description: formData.description,
        amenities: formData.amenities,
        unavailable_dates: formData.unavailableDates,
           images: formData.images, // push directly
  videos: formData.videos  
      }])
      if (error) throw error
      alert("Yacht created successfully!")
      onSuccess?.()
    } catch (err) {
      console.error(err)
      alert("Error saving yacht. Check console.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl mx-auto p-4">
      <Card className="shadow-lg bg-gradient-to-br from-blue-50 to-cyan-50">
        <CardHeader className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-t-lg">
          <CardTitle className="flex items-center gap-2"><Upload className="h-6 w-6" /> Add New Yacht</CardTitle>
          <CardDescription className="text-blue-100">Create a new yacht listing for your fleet</CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">

            {/* Name & Type */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label>Yacht Name *</Label>
                <Input value={formData.name} onChange={e => handleInputChange("name", e.target.value)} required />
              </div>
              <div>
                <Label>Type *</Label>
                <Select value={formData.type} onValueChange={v => handleInputChange("type", v)}>
                  <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
                  <SelectContent>{yachtTypes.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
                </Select>
              </div>
            </div>

            {/* Price / Guests / Length */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div><Label>Price ($/day) *</Label><Input type="number" value={formData.price} onChange={e => handleInputChange("price", e.target.value)} required /></div>
              <div><Label>Max Guests *</Label><Input type="number" value={formData.guests} onChange={e => handleInputChange("guests", e.target.value)} required /></div>
              <div><Label>Length (ft) *</Label><Input type="number" value={formData.length} onChange={e => handleInputChange("length", e.target.value)} required /></div>
            </div>

            <div><Label>Location *</Label><Input value={formData.location} onChange={e => handleInputChange("location", e.target.value)} required /></div>
            <div><Label>Description</Label><Textarea value={formData.description} onChange={e => handleInputChange("description", e.target.value)} rows={3} /></div>

            {/* Amenities */}
            <div>
              <Label>Amenities</Label>
              <div className="flex flex-wrap gap-2 mb-2">
                {formData.amenities.map(a => <Badge key={a}>{a} <button type="button" onClick={() => removeAmenity(a)}><X className="h-3 w-3" /></button></Badge>)}
              </div>
              <div className="flex gap-2">
                <Select value={newAmenity} onValueChange={setNewAmenity}>
                  <SelectTrigger><SelectValue placeholder="Select amenity" /></SelectTrigger>
                  <SelectContent>{availableAmenities.map(a => <SelectItem key={a} value={a}>{a}</SelectItem>)}</SelectContent>
                </Select>
                <Button type="button" onClick={addAmenity}><Plus /></Button>
              </div>
            </div>

            {/* Unavailable Dates */}
            <div>
              <Label>Unavailable Dates</Label>
              <div className="flex flex-wrap gap-2 mb-2">
                {formData.unavailableDates.map(d => <Badge key={d}>{d} <button type="button" onClick={() => removeUnavailableDate(d)}><X className="h-3 w-3" /></button></Badge>)}
              </div>
              <div className="flex gap-2">
                <Input type="date" value={newUnavailableDate} onChange={e => setNewUnavailableDate(e.target.value)} />
                <Button type="button" onClick={addUnavailableDate}><Plus /></Button>
              </div>
            </div>

            {/* Images */}
            <div>
              <Label>Images (Max 8)</Label>
              <div className="flex flex-wrap gap-2 mb-2">
                {formData.images.map((img, i) => <Badge key={i}>Image {i + 1} <button type="button" onClick={() => removeImage(i)}><X className="h-3 w-3" /></button></Badge>)}
              </div>
              <Input type="file" accept="image/*" onChange={handleAddImage} />
            </div>

            {/* Videos */}
            <div>
              <Label>Videos (Max 2)</Label>
              <div className="flex flex-wrap gap-2 mb-2">
                {formData.videos.map((vid, i) => <Badge key={i}>Video {i + 1} <button type="button" onClick={() => removeVideo(i)}><X className="h-3 w-3" /></button></Badge>)}
              </div>
              <Input type="file" accept="video/*" onChange={handleAddVideo} />
            </div>

            <div className="flex gap-4 pt-4">
              <Button type="submit" disabled={isSubmitting}>{isSubmitting ? "Saving..." : "Create Yacht"}</Button>
              <Button type="button" onClick={onCancel}>Cancel</Button>
            </div>

          </form>
        </CardContent>
      </Card>
    </motion.div>
  )
}
