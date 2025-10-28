"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { X, Plus, Upload } from "lucide-react"
import { createClient } from "@/utils/supabase/client"
import { nanoid } from "nanoid"
import { useRouter } from "next/navigation"

interface YachtFormProps {
  initialData?: any
  onSuccess?: () => void
  onCancel?: () => void
}

const yachtTypes = ["Motor Yacht", "Sailing Yacht", "Catamaran", "Superyacht", "Sport Yacht", "Fishing Yacht"]
const availableAmenities = [
  "WiFi", "Air Conditioning", "Jacuzzi", "Diving Equipment", "Chef Service",
  "Wine Cellar", "Helipad", "Gym", "Sauna", "Fishing Gear",
  "Kayaks", "Snorkeling Equipment", "Water Sports", "Entertainment System", "Bar", "Spa Services"
]

export default function YachtForm({ initialData, onSuccess, onCancel }: YachtFormProps) {
  const supabase = createClient()
  const router = useRouter()
  const [formData, setFormData] = useState({
    id: "",
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
    images: [] as string[],
    videos: [] as string[]
  })

  const [newAmenity, setNewAmenity] = useState("")
  const [newUnavailableDate, setNewUnavailableDate] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Prefill form if initialData exists
  useEffect(() => {
    if (initialData) {
      setFormData({
        id: initialData.id,
        name: initialData.name,
        type: initialData.type,
        price: initialData.price?.toString() || "",
        rating: initialData.rating?.toString() || "",
        reviews: initialData.reviews?.toString() || "",
        location: initialData.location,
        guests: initialData.guests?.toString() || "",
        length: initialData.length?.toString() || "",
        description: initialData.description,
        amenities: initialData.amenities || [],
        unavailableDates: initialData.unavailable_dates || [],
        images: initialData.images || [],
        videos: initialData.videos || []
      })
    }
  }, [initialData])

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  // --- Amenities & Unavailable Dates ---
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

  // --- Upload Helpers ---
  const uploadFile = async (file: File, folder: string) => {
    const id = nanoid(12)
    const ext = file.name.split('.').pop()
    const fileName = `${id}.${ext}`
    const filePath = `${folder}/${fileName}`

    const { error } = await supabase.storage.from("yacht-media").upload(filePath, file)
    if (error) throw error

    const { data } = supabase.storage.from("yacht-media").getPublicUrl(filePath)
    return data.publicUrl
  }

  const handleAddImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return
    const file = e.target.files[0]
    if (!file) return
    if (formData.images.length >= 8) return alert("Maximum 8 images allowed")

    try {
      const publicUrl = await uploadFile(file, "images")
      setFormData(prev => ({ ...prev, images: [...prev.images, publicUrl] }))
      e.target.value = ""
    } catch (err: any) {
      alert("Upload failed: " + err.message)
    }
  }

  const handleAddVideo = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return
    const file = e.target.files[0]
    if (!file) return
    if (formData.videos.length >= 2) return alert("Maximum 2 videos allowed")

    try {
      const publicUrl = await uploadFile(file, "videos")
      setFormData(prev => ({ ...prev, videos: [...prev.videos, publicUrl] }))
      e.target.value = ""
    } catch (err: any) {
      alert("Upload failed: " + err.message)
    }
  }

  const removeImage = (index: number) => setFormData(prev => ({ ...prev, images: prev.images.filter((_, i) => i !== index) }))
  const removeVideo = (index: number) => setFormData(prev => ({ ...prev, videos: prev.videos.filter((_, i) => i !== index) }))

  // --- Submit Form ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) throw new Error("You must be logged in to add or edit yachts.");

      if (formData.id) {
        // UPDATE existing yacht
        const { error: updateError } = await supabase
          .from("yachts")
          .update({
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
            images: formData.images,
            videos: formData.videos
          })
          .eq("id", formData.id);

        if (updateError) throw updateError;

        alert("Yacht updated successfully!");
        onSuccess?.();
      } else {
        // INSERT new yacht
        const { error: insertError } = await supabase.from("yachts").insert([{
          user_id: user.id,
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
          images: formData.images,
          videos: formData.videos
        }]);

        if (insertError) throw insertError;

        alert("Yacht created successfully!");
        onSuccess?.();
      }

    } catch (err: any) {
      console.error(err);
      alert("Error saving yacht: " + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- JSX ---
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl mx-auto p-4">
      <Card className="shadow-sm border border-gray-200 bg-white">
       <CardHeader className="flex items-center justify-between text-center">
  <Button type="button" className="border border-gray-300 text-white" onClick={onCancel}>Back</Button>

  <div className="flex flex-col items-center">
    <CardTitle className="flex items-center gap-2 text-primary">
      {formData.id ? "EDIT YACHT" : "ADD NEW YACHT"}
    </CardTitle>
    <CardDescription className="text-gray-600">
      {formData.id ? "Update your yacht listing" : "Create a new yacht listing for your fleet"}
    </CardDescription>
  </div>

  {/* Placeholder div to balance flex */}
  <div className="w-20"></div>
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
                  <SelectContent>
                    {yachtTypes.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Price / Guests / Length */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <Label>Price ($/day) *</Label>
                <Input type="number" value={formData.price} onChange={e => handleInputChange("price", e.target.value)} required />
              </div>
              <div>
                <Label>Max Guests *</Label>
                <Input type="number" value={formData.guests} onChange={e => handleInputChange("guests", e.target.value)} required />
              </div>
              <div>
                <Label>Length (ft) *</Label>
                <Input type="number" value={formData.length} onChange={e => handleInputChange("length", e.target.value)} required />
              </div>
            </div>

            <div>
              <Label>Location *</Label>
              <Input value={formData.location} onChange={e => handleInputChange("location", e.target.value)} required />
            </div>

            <div>
              <Label>Description</Label>
              <Textarea value={formData.description} onChange={e => handleInputChange("description", e.target.value)} rows={3} />
            </div>

            {/* Amenities */}
            <div>
              <Label>Amenities</Label>
              <div className="flex flex-wrap gap-2 mb-2">
                {formData.amenities.map(a => (
                  <Badge key={a} className="flex items-center gap-1">
                    {a}
                    <button type="button" onClick={() => removeAmenity(a)} className="text-gray-500 hover:text-gray-700">
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
              <div className="flex gap-2">
                <Select value={newAmenity} onValueChange={setNewAmenity}>
                  <SelectTrigger><SelectValue placeholder="Select amenity" /></SelectTrigger>
                  <SelectContent>{availableAmenities.map(a => <SelectItem key={a} value={a}>{a}</SelectItem>)}</SelectContent>
                </Select>
                <Button type="button" className="border-gray-300 text-gray-700 hover:bg-gray-100" onClick={addAmenity}><Plus /></Button>
              </div>
            </div>

            {/* Unavailable Dates */}
            <div>
              <Label>Unavailable Dates</Label>
              <div className="flex flex-wrap gap-2 mb-2">
                {formData.unavailableDates.map(d => (
                  <Badge key={d} className="flex items-center gap-1">
                    {d}
                    <button type="button" onClick={() => removeUnavailableDate(d)} className="text-gray-500 hover:text-gray-700">
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
              <div className="flex gap-2">
                <Input type="date" value={newUnavailableDate} onChange={e => setNewUnavailableDate(e.target.value)} />
                <Button type="button" className="border-gray-300 text-gray-700 hover:bg-gray-100" onClick={addUnavailableDate}><Plus /></Button>
              </div>
            </div>

            {/* Images */}
            <div>
              <Label>Images (Max 8)</Label>
              <div className="flex flex-wrap gap-4 mb-4">
                {formData.images.map((img, i) => (
                  <div key={i} className="relative w-48 h-32 rounded overflow-hidden border border-gray-200 shadow-sm">
                    <img src={img} alt={`Yacht Image ${i + 1}`} className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => removeImage(i)}
                      className="absolute top-1 right-1 text-red-600 hover:text-red-800"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
              <Input type="file" accept="image/*" onChange={handleAddImage} />
            </div>

            {/* Videos */}
            <div>
              <Label>Videos</Label>
              <div className="flex flex-wrap gap-4 mb-4">
                {formData.videos.map((vid, i) => (
                  <div key={i} className="relative w-48 h-32 rounded overflow-hidden border border-gray-200 shadow-sm">
                    <video src={vid} className="w-full h-full object-cover" controls />
                    <button
                      type="button"
                      onClick={() => removeVideo(i)}
                      className="absolute top-1 right-1 text-red-600 hover:text-red-800"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
              <Input type="file" accept="video/*" onChange={handleAddVideo} />
            </div>

            {/* Form Actions */}
            <div className="flex gap-4 pt-4">
              <Button type="submit" className="bg-gray-800 text-white hover:bg-gray-900" disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : formData.id ? "Update Yacht" : "Create Yacht"}
              </Button>
              <Button type="button" className="border border-gray-300 text-gray-700 hover:bg-gray-100" onClick={onCancel}>Cancel</Button>
            </div>

          </form>
        </CardContent>
      </Card>
    </motion.div>

  )
}
