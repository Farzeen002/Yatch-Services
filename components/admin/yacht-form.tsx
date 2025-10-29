"use client"

import { useState, useEffect, useCallback } from "react"
import Cropper, { Area } from "react-easy-crop"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card } from "@/components/ui/card"
import {
  X,
  Plus,
  Upload,
  Loader2,
  ImageIcon,
  Video,
  CalendarDays,
  Anchor,
  Info,
  Settings2,
} from "lucide-react"
import { nanoid } from "nanoid"
import { createClient } from "@/utils/supabase/client"
import { nanoid } from "nanoid"
import { useRouter } from "next/navigation"

const yachtTypes = [
  "Motor Yacht",
  "Sailing Yacht",
  "Catamaran",
  "Superyacht",
  "Sport Yacht",
  "Fishing Yacht",
]
const availableAmenities = [
  "WiFi",
  "Air Conditioning",
  "Jacuzzi",
  "Diving Equipment",
  "Chef Service",
  "Wine Cellar",
  "Helipad",
  "Gym",
  "Sauna",
  "Fishing Gear",
  "Kayaks",
  "Snorkeling Equipment",
  "Water Sports",
  "Entertainment System",
  "Bar",
  "Spa Services",
]

interface YachtFormProps {
  initialData?: any
  onSuccess?: () => void
  onCancel?: () => void
}

// ✅ Utility: create image for cropping
const createImage = (url: string): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const image = new Image()
    image.addEventListener("load", () => resolve(image))
    image.addEventListener("error", (error) => reject(error))
    image.src = url
  })

// ✅ Crop helper
const getCroppedImg = async (imageSrc: string, crop: Area): Promise<Blob> => {
  const image = await createImage(imageSrc)
  const canvas = document.createElement("canvas")
  const ctx = canvas.getContext("2d")!

  canvas.width = crop.width
  canvas.height = crop.height
  ctx.drawImage(
    image,
    crop.x,
    crop.y,
    crop.width,
    crop.height,
    0,
    0,
    crop.width,
    crop.height
  )

  return new Promise((resolve) => {
    canvas.toBlob((blob) => resolve(blob!), "image/jpeg")
  })
}

// ✅ Supabase upload utility
const uploadToSupabase = async (file: File, folder: string): Promise<string> => {
  const supabase = createClient()
  const fileExt = file.name.split(".").pop()
  const fileName = `${folder}/${nanoid()}.${fileExt}`

  const { data, error } = await supabase.storage
    .from("yacht-media")
    .upload(fileName, file)

  if (error) throw new Error(error.message)

  const { data: publicUrlData } = supabase.storage
    .from("yacht-media")
    .getPublicUrl(fileName)

  return publicUrlData.publicUrl
}

export default function YachtForm({ initialData, onSuccess, onCancel }: YachtFormProps) {
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    type: "",
    price: "",
    guests: "",
    length: "",
    location: "",
    description: "",
    amenities: [] as string[],
    unavailableDates: [] as string[],
    images: [] as string[],
    videos: [] as string[],
  })

  const [newAmenity, setNewAmenity] = useState("")
  const [newUnavailableDate, setNewUnavailableDate] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [croppingImage, setCroppingImage] = useState<string | null>(null)
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null)

  useEffect(() => {
    if (initialData) {
      setFormData({
        id: initialData.id,
        name: initialData.name || "",
        type: initialData.type || "",
        price: initialData.price?.toString() || "",
        guests: initialData.guests?.toString() || "",
        length: initialData.length?.toString() || "",
        location: initialData.location || "",
        description: initialData.description || "",
        amenities: initialData.amenities || [],
        unavailableDates: initialData.unavailable_dates || [],
        images: initialData.images || [],
        videos: initialData.videos || [],
      })
    }
  }, [initialData])

  const handleInput = (field: string, value: string) =>
    setFormData((prev) => ({ ...prev, [field]: value }))

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) setCroppingImage(URL.createObjectURL(file))
  }

  const onCropComplete = useCallback((_: Area, croppedAreaPixels: Area) => {
    setCroppedAreaPixels(croppedAreaPixels)
  }, [])

  const handleCropConfirm = async () => {
    try {
      const croppedBlob = await getCroppedImg(croppingImage!, croppedAreaPixels)
      const file = new File([croppedBlob], `cropped-${nanoid()}.jpg`, {
        type: "image/jpeg",
      })
      const url = await uploadToSupabase(file, "images")
      setFormData((prev) => ({ ...prev, images: [...prev.images, url] }))
      setCroppingImage(null)
    } catch (err: any) {
      alert("Crop failed: " + err.message)
    }
  }

  const removeImage = (i: number) =>
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, idx) => idx !== i),
    }))

  const handleAddVideo = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (formData.videos.length >= 2)
      return alert("Max 2 videos allowed")

    try {
      const url = await uploadToSupabase(file, "videos")
      setFormData((prev) => ({ ...prev, videos: [...prev.videos, url] }))
    } catch (err: any) {
      alert("Video upload failed: " + err.message)
    }
  }

  const removeVideo = (i: number) =>
    setFormData((prev) => ({
      ...prev,
      videos: prev.videos.filter((_, idx) => idx !== i),
    }))

  const addAmenity = () => {
    if (newAmenity && !formData.amenities.includes(newAmenity)) {
      setFormData((prev) => ({
        ...prev,
        amenities: [...prev.amenities, newAmenity],
      }))
      setNewAmenity("")
    }
  }

  const removeAmenity = (a: string) =>
    setFormData((prev) => ({
      ...prev,
      amenities: prev.amenities.filter((x) => x !== a),
    }))

  const addUnavailableDate = () => {
    if (
      newUnavailableDate &&
      !formData.unavailableDates.includes(newUnavailableDate)
    ) {
      setFormData((prev) => ({
        ...prev,
        unavailableDates: [...prev.unavailableDates, newUnavailableDate],
      }))
      setNewUnavailableDate("")
    }
  }

  const removeUnavailableDate = (d: string) =>
    setFormData((prev) => ({
      ...prev,
      unavailableDates: prev.unavailableDates.filter((x) => x !== d),
    }))

  // --- Submit Form ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    const supabase = createClient()

    const yachtPayload = {
      name: formData.name,
      type: formData.type,
      price: Number(formData.price),
      guests: Number(formData.guests),
      length: Number(formData.length),
      location: formData.location,
      description: formData.description,
      amenities: formData.amenities,
      unavailable_dates: formData.unavailableDates,
      images: formData.images,
      videos: formData.videos,
    }

    try {
      if (formData.id) {
        await supabase
          .from("yachts")
          .update(yachtPayload)
          .eq("id", formData.id)
      } else {
        await supabase.from("yachts").insert(yachtPayload)
      }

      alert("Yacht saved successfully!")
      onSuccess?.()
    } catch (err: any) {
      alert("Save failed: " + err.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  // UI starts (unchanged)

  return (
    <div className="min-h-screen py-12 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-6xl mx-auto"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="inline-flex items-center justify-center w-16 h-16 gradient-ocean rounded-2xl mb-4 shadow-medium"
          >
            <Anchor className="w-8 h-8 text-primary-foreground" />
          </motion.div>
          <h1 className="text-4xl font-bold text-primary mb-2">
            {formData.id ? "Edit Yacht Listing" : "List Your Yacht"}
          </h1>
          <p className="text-muted-foreground text-lg">
            Showcase your vessel to premium clients worldwide
          </p>
        </div>

        {/* Main Form Card */}
        <Card className="bg-card/60 backdrop-blur-xl border-border/50 shadow-large overflow-hidden">
          <div className="gradient-ocean h-1.5" />
          
          <form onSubmit={handleSubmit} className="p-8 md:p-12 space-y-10">
            
            {/* General Information Section */}
            <section className="space-y-6">
              <div className="flex items-center gap-3 pb-4 border-b border-border/50">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Info className="w-5 h-5 text-primary" />
                </div>
                <h2 className="text-2xl font-semibold text-foreground">General Information</h2>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  className="space-y-2"
                >
                  <Label className="text-sm font-medium text-foreground">Yacht Name *</Label>
                  <Input
                    value={formData.name}
                    onChange={e => handleInput("name", e.target.value)}
                    placeholder="e.g., Oceanic Dream"
                    required
                    className="h-12 bg-background/50 border-border/60 focus:border-primary transition-colors"
                  />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.25 }}
                  className="space-y-2"
                >
                  <Label className="text-sm font-medium text-foreground">Yacht Type *</Label>
                  <select
                    className="w-full h-12 rounded-lg border border-border/60 bg-background/50 px-4 focus:outline-none focus:border-primary transition-colors text-foreground"
                    value={formData.type}
                    onChange={e => handleInput("type", e.target.value)}
                    required
                  >
                    <option value="">Select Type</option>
                    {yachtTypes.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </motion.div>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="space-y-2"
                >
                  <Label className="text-sm font-medium text-foreground">Price per Day *</Label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">$</span>
                    <Input
                      type="number"
                      value={formData.price}
                      onChange={e => handleInput("price", e.target.value)}
                      placeholder="5000"
                      required
                      className="h-12 pl-8 bg-background/50 border-border/60 focus:border-primary transition-colors"
                    />
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.35 }}
                  className="space-y-2"
                >
                  <Label className="text-sm font-medium text-foreground">Max Guests *</Label>
                  <Input
                    type="number"
                    value={formData.guests}
                    onChange={e => handleInput("guests", e.target.value)}
                    placeholder="12"
                    required
                    className="h-12 bg-background/50 border-border/60 focus:border-primary transition-colors"
                  />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="space-y-2"
                >
                  <Label className="text-sm font-medium text-foreground">Length (ft)</Label>
                  <Input
                    type="number"
                    value={formData.length}
                    onChange={e => handleInput("length", e.target.value)}
                    placeholder="85"
                    className="h-12 bg-background/50 border-border/60 focus:border-primary transition-colors"
                  />
                </motion.div>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.45 }}
                className="space-y-2"
              >
                <Label className="text-sm font-medium text-foreground">Location *</Label>
                <Input
                  value={formData.location}
                  onChange={e => handleInput("location", e.target.value)}
                  placeholder="e.g., Monaco, French Riviera"
                  required
                  className="h-12 bg-background/50 border-border/60 focus:border-primary transition-colors"
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="space-y-2"
              >
                <Label className="text-sm font-medium text-foreground">Description *</Label>
                <Textarea
                  rows={4}
                  value={formData.description}
                  onChange={e => handleInput("description", e.target.value)}
                  placeholder="Describe your yacht's unique features and amenities..."
                  required
                  className="bg-background/50 border-border/60 focus:border-primary transition-colors resize-none"
                />
              </motion.div>
            </section>

            {/* Amenities Section */}
            <section className="space-y-6">
              <div className="flex items-center gap-3 pb-4 border-b border-border/50">
                <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center">
                  <Settings2 className="w-5 h-5 text-secondary" />
                </div>
                <h2 className="text-2xl font-semibold text-foreground">Amenities & Features</h2>
              </div>

              <div className="flex flex-wrap gap-2 min-h-[60px] p-4 rounded-xl bg-muted/30 border border-border/40">
                {formData.amenities.length === 0 && (
                  <span className="text-muted-foreground text-sm">No amenities added yet</span>
                )}
                {formData.amenities.map(a => (
                  <motion.span
                    key={a}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.8, opacity: 0 }}
                    className="inline-flex items-center gap-2 bg-primary/10 text-primary border border-primary/20 px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-primary/20 transition-colors"
                  >
                    {a}
                    <button
                      type="button"
                      onClick={() => removeAmenity(a)}
                      className="hover:text-destructive transition-colors"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </motion.span>
                ))}
              </div>

              <div className="flex gap-3">
                <select
                  className="flex-1 h-12 rounded-lg border border-border/60 bg-background/50 px-4 focus:outline-none focus:border-secondary transition-colors text-foreground"
                  value={newAmenity}
                  onChange={e => setNewAmenity(e.target.value)}
                >
                  <option value="">Select Amenity</option>
                  {availableAmenities.map(a => <option key={a} value={a}>{a}</option>)}
                </select>
                <Button
                  type="button"
                  onClick={addAmenity}
                  disabled={!newAmenity}
                  className="h-12 px-6 bg-accent hover:bg-accent/90 text-accent-foreground"
                >
                  <Plus className="w-5 h-5" />
                </Button>
              </div>
            </section>

            {/* Unavailable Dates Section */}
            <section className="space-y-6">
              <div className="flex items-center gap-3 pb-4 border-b border-border/50">
                <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
                  <CalendarDays className="w-5 h-5 text-accent" />
                </div>
                <h2 className="text-2xl font-semibold text-foreground">Availability Calendar</h2>
              </div>

              <div className="flex flex-wrap gap-2 min-h-[60px] p-4 rounded-xl bg-muted/30 border border-border/40">
                {formData.unavailableDates.length === 0 && (
                  <span className="text-muted-foreground text-sm">No blocked dates</span>
                )}
                {formData.unavailableDates.map(d => (
                  <motion.span
                    key={d}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.8, opacity: 0 }}
                    className="inline-flex items-center gap-2 bg-destructive/10 text-destructive border border-destructive/20 px-3 py-1.5 rounded-lg text-sm font-medium"
                  >
                    {d}
                    <button
                      type="button"
                      onClick={() => removeUnavailableDate(d)}
                      className="hover:text-destructive/70 transition-colors"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </motion.span>
                ))}
              </div>

              <div className="flex gap-3">
                <Input
                  type="date"
                  value={newUnavailableDate}
                  onChange={e => setNewUnavailableDate(e.target.value)}
                  className="flex-1 h-12 bg-background/50 border-border/60 focus:border-accent transition-colors"
                />
                <Button
                  type="button"
                  onClick={addUnavailableDate}
                  disabled={!newUnavailableDate}
                  className="h-12 px-6 bg-accent hover:bg-accent/90 text-accent-foreground"
                >
                  <Plus className="w-5 h-5" />
                </Button>
              </div>
            </section>

            {/* Images Section */}
            <section className="space-y-6">
              <div className="flex items-center gap-3 pb-4 border-b border-border/50">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <ImageIcon className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-semibold text-foreground">Photo Gallery</h2>
                  <p className="text-sm text-muted-foreground">Upload up to 8 high-quality images</p>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {formData.images.map((img, i) => (
                  <motion.div
                    key={i}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="relative aspect-[4/3] rounded-xl overflow-hidden shadow-medium group"
                  >
                    <img src={img} className="object-cover w-full h-full" alt={`Yacht ${i + 1}`} />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors" />
                    <button
                      type="button"
                      onClick={() => removeImage(i)}
                      className="absolute top-2 right-2 bg-destructive text-destructive-foreground rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg hover:scale-110"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </motion.div>
                ))}
                
                {formData.images.length < 8 && (
                  <label className="cursor-pointer aspect-[4/3] flex flex-col items-center justify-center border-2 border-dashed border-border/60 rounded-xl hover:border-primary hover:bg-primary/5 transition-all group">
                    <Upload className="w-8 h-8 text-muted-foreground group-hover:text-primary transition-colors mb-2" />
                    <span className="text-sm text-muted-foreground group-hover:text-primary transition-colors font-medium">Add Photo</span>
                    <input type="file" accept="image/*" className="hidden" onChange={handleImageSelect} />
                  </label>
                )}
              </div>
            </section>

            {/* Videos Section */}
            <section className="space-y-6">
              <div className="flex items-center gap-3 pb-4 border-b border-border/50">
                <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center">
                  <Video className="w-5 h-5 text-secondary" />
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-semibold text-foreground">Video Tours</h2>
                  <p className="text-sm text-muted-foreground">Add up to 2 video showcases</p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                {formData.videos.map((vid, i) => (
                  <motion.div
                    key={i}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="relative aspect-video rounded-xl overflow-hidden shadow-medium group"
                  >
                    <video src={vid} className="w-full h-full object-cover" controls />
                    <button
                      type="button"
                      onClick={() => removeVideo(i)}
                      className="absolute top-2 right-2 bg-destructive text-destructive-foreground rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </motion.div>
                ))}
                
                {formData.videos.length < 2 && (
                  <label className="cursor-pointer aspect-video flex flex-col items-center justify-center border-2 border-dashed border-border/60 rounded-xl hover:border-secondary hover:bg-secondary/5 transition-all group">
                    <Upload className="w-8 h-8 text-muted-foreground group-hover:text-secondary transition-colors mb-2" />
                    <span className="text-sm text-muted-foreground group-hover:text-secondary transition-colors font-medium">Add Video</span>
                    <input type="file" accept="video/*" className="hidden" onChange={handleAddVideo} />
                  </label>
                )}
              </div>
            </section>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row justify-end gap-4 pt-8 border-t border-border/50">
              {onCancel && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={onCancel}
                  className="h-12 px-8 border-border/60 hover:bg-muted"
                >
                  Cancel
                </Button>
              )}
              <Button
                type="submit"
                disabled={isSubmitting}
                className="h-12 px-8 gradient-ocean hover:opacity-90 text-primary-foreground font-medium shadow-medium"
              >
                {isSubmitting && <Loader2 className="animate-spin mr-2 h-5 w-5" />}
                {formData.id ? "Update Listing" : "Publish Yacht"}
              </Button>
            </div>
          </form>
        </Card>
      </motion.div>

      {/* Cropping Modal */}
      <AnimatePresence>
        {croppingImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-card rounded-2xl shadow-large w-full max-w-2xl overflow-hidden"
            >
              <div className="bg-gradient-ocean p-6">
                <h3 className="text-xl font-semibold text-primary-foreground">Crop Your Image</h3>
                <p className="text-primary-foreground/80 text-sm mt-1">Adjust the crop area to showcase your yacht perfectly</p>
              </div>
              
              <div className="relative w-full h-96 bg-black">
                <Cropper
                  image={croppingImage}
                  crop={crop}
                  zoom={zoom}
                  aspect={4 / 3}
                  onCropChange={setCrop}
                  onZoomChange={setZoom}
                  onCropComplete={onCropComplete}
                />
              </div>
              
              <div className="p-6 bg-card">
                <div className="mb-6">
                  <Label className="text-sm mb-2 block">Zoom</Label>
                  <input
                    type="range"
                    min={1}
                    max={3}
                    step={0.1}
                    value={zoom}
                    onChange={(e) => setZoom(parseFloat(e.target.value))}
                    className="w-full accent-primary"
                  />
                </div>
                
                <div className="flex justify-end gap-3">
                  <Button onClick={() => setCroppingImage(null)} variant="outline" className="h-11 px-6">
                    Cancel
                  </Button>
                  <Button onClick={handleCropConfirm} className="h-11 px-6 gradient-ocean">
                    Crop & Save
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}


