"use client";

import { Dialog } from "@headlessui/react";
import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { Loader2, Camera } from "lucide-react";

interface ProfileModalProps {
  open: boolean;
  onClose: () => void;
}

export default function ProfileModal({ open, onClose }: ProfileModalProps) {
  const supabase = createClient();

  const [userId, setUserId] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [currentImage, setCurrentImage] = useState("/profile-placeholder.png");
  const [newImageBase64, setNewImageBase64] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  //  Fetch user data when modal opens
  useEffect(() => {
    if (!open) return;

    const fetchUser = async () => {
      const { data: authData, error: authError } = await supabase.auth.getUser();
      if (authError || !authData.user) return;

      const user = authData.user;
      setUserId(user.id);
      setEmail(user.email || "");

      // Fetch from users table
      const { data: profile } = await supabase
        .from("users")
        .select("username, phone_number, profile_image")
        .eq("id", user.id)
        .single();

      let avatarUrl = "/profile-placeholder.png";

      if (profile?.profile_image) {
        if (
          profile.profile_image.startsWith("http") ||
          profile.profile_image.startsWith("data:image")
        ) {
          avatarUrl = profile.profile_image;
        }
      } else if (user.user_metadata?.avatar_url) {
        avatarUrl = user.user_metadata.avatar_url;
      } else if (user.user_metadata?.picture) {
        avatarUrl = user.user_metadata.picture;
      }

      setName(
        profile?.username ||
          user.user_metadata?.full_name ||
          user.user_metadata?.name ||
          user.email?.split("@")[0] ||
          "User"
      );
      setPhoneNumber(profile?.phone_number || "");
      setCurrentImage(avatarUrl);
    };

    fetchUser();
  }, [open]);

  //  Convert image file to Base64 and preview
  const handleImageChange = (file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      if (reader.result) {
        setCurrentImage(reader.result as string);
        setNewImageBase64(reader.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  //  Save profile (Base64 image)
  const handleSave = async () => {
    if (!userId) return;
    setLoading(true);

    try {
      const updatedProfile = {
        id: userId,
        username: name,
        user_email: email,
        phone_number: phoneNumber,
        profile_image: newImageBase64 || currentImage,
      };

      await supabase.from("users").upsert(updatedProfile);
      alert("Profile updated successfully!");
      onClose();
    } catch (err: any) {
      console.error("Save failed:", err);
      alert(err.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} className="relative z-50">
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" aria-hidden="true" />

      {/* Modal */}
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="mx-auto max-w-md w-full bg-white rounded-2xl p-6 shadow-xl flex flex-col gap-4 transition-all">
          <Dialog.Title className="text-2xl font-semibold text-center text-gray-800">
            Edit Profile
          </Dialog.Title>

          {/* Profile Image */}
          <div className="relative flex justify-center">
            <img
              src={currentImage || "/profile-placeholder.png"}
              alt="Profile"
              className="w-32 h-32 rounded-full object-cover border-2 border-gray-300 shadow-sm"
            />
            <label className="absolute bottom-2 right-[calc(50%-4rem)] bg-blue-600 text-white p-2 rounded-full cursor-pointer hover:bg-blue-700 transition">
              <Camera size={18} />
              <input
                type="file"
                accept="image/*"
                onChange={(e) =>
                  e.target.files && handleImageChange(e.target.files[0])
                }
                className="hidden"
              />
            </label>
          </div>

          {/* Name */}
          <label className="flex flex-col text-sm font-medium text-gray-700">
            Name
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </label>

          {/* Email */}
          <label className="flex flex-col text-sm font-medium text-gray-700">
            Email (cannot edit)
            <input
              type="text"
              value={email}
              disabled
              className="mt-1 p-2 border rounded-lg bg-gray-100 text-gray-500"
            />
          </label>

          {/* Phone */}
          <label className="flex flex-col text-sm font-medium text-gray-700">
            Phone Number
            <input
              type="text"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="mt-1 p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </label>

          {/* Buttons */}
          <div className="flex justify-end gap-2 mt-6">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg border hover:bg-gray-100 transition"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={loading}
              className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
            >
              {loading && <Loader2 size={18} className="animate-spin" />}
              {loading ? "Saving..." : "Save"}
            </button>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}
