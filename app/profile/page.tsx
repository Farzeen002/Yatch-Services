"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/utils/supabase/client"

export default function ProfilePage() {
  const supabase = createClient()

  const [userId, setUserId] = useState<string | null>(null)
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [phoneNumber, setPhoneNumber] = useState("")
  const [profileImage, setProfileImage] = useState<File | null>(null)
  const [currentImage, setCurrentImage] = useState("/profile-placeholder.png")
  const [loading, setLoading] = useState(false)

  // Fetch user profile on mount
  useEffect(() => {
    const fetchUser = async () => {
      const { data, error } = await supabase.auth.getUser()
      if (error) return console.error(error.message)
      const user = data.user
      if (!user) return

      setUserId(user.id)
      setEmail(user.email || "")

      const { data: profile, error: profileError } = await supabase
        .from("users")
        .select("username, phone_number, profile_image")
        .eq("id", user.id)
        .single()

      if (profileError) return console.error(profileError.message)

      if (profile) {
        setName(profile.username || "")
        setPhoneNumber(profile.phone_number || "")
        setCurrentImage(profile.profile_image || "/profile-placeholder.png")
      }
    }

    fetchUser()
  }, [supabase])

  // Preview image when selected
  const handleImageChange = (file: File) => {
    setProfileImage(file)
    const reader = new FileReader()
    reader.onload = (e) => {
      if (e.target?.result) setCurrentImage(e.target.result as string)
    }
    reader.readAsDataURL(file)
  }

  const handleSave = async () => {
    if (!userId) return
    setLoading(true)

    try {
      let imageUrl = currentImage

      if (profileImage) {
        const ext = profileImage.name.split(".").pop()
        const fileName = `${userId}.${ext}`
        const { error: uploadError } = await supabase.storage
          .from("profile-images")
          .upload(fileName, profileImage, { upsert: true })

        if (uploadError) throw uploadError

        const { data } = supabase.storage.from("profile-images").getPublicUrl(fileName)
        imageUrl = data.publicUrl
      }

      await supabase
        .from("users")
        .update({ username: name, phone_number: phoneNumber, profile_image: imageUrl })
        .eq("id", userId)

      alert("Profile updated successfully!")
    } catch (err: any) {
      alert(err.message || "Failed to update profile")
    }

    setLoading(false)
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-start p-8 bg-gray-50">
      <h1 className="text-2xl font-bold mb-6">Edit Profile</h1>

      {/* Profile Image Centered */}
      <div className="mb-6 flex flex-col items-center">
        <img
          src={currentImage}
          alt="Profile"
          className="w-32 h-32 rounded-full object-cover mb-4"
        />
        <input
          type="file"
          accept="image/*"
          onChange={(e) => e.target.files && handleImageChange(e.target.files[0])}
          className="mt-2"
        />
      </div>

      <div className="flex flex-col gap-4 w-full max-w-md">
        <label className="flex flex-col">
          Name
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 p-2 border rounded"
          />
        </label>

        <label className="flex flex-col">
          Email (cannot edit)
          <input
            type="text"
            value={email}
            disabled
            className="mt-1 p-2 border rounded bg-gray-100"
          />
        </label>

        <label className="flex flex-col">
          Phone Number
          <input
            type="text"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            className="mt-1 p-2 border rounded"
          />
        </label>

        <button
          onClick={handleSave}
          disabled={loading}
          className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </div>
  )
}
