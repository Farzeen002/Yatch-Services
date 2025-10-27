"use client";

import { Dialog } from "@headlessui/react";
import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";

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
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [currentImage, setCurrentImage] = useState("/profile-placeholder.png");
  const [loading, setLoading] = useState(false);

  // ✅ Fetch user profile when modal opens
  useEffect(() => {
    if (!open) return;

    const fetchUser = async () => {
      const { data: authData, error: authError } = await supabase.auth.getUser();
      if (authError || !authData.user) return;

      const user = authData.user;
      setUserId(user.id);
      setEmail(user.email || "");

      // Fetch user profile from DB
      const { data: profile, error: profileError } = await supabase
        .from("users")
        .select("username, phone_number, profile_image")
        .eq("id", user.id)
        .single();

      let avatarUrl = "/profile-placeholder.png";

      // ✅ Determine the best avatar source
      if (profile?.profile_image && profile.profile_image.startsWith("http")) {
        avatarUrl = profile.profile_image;
      } else if (user.user_metadata?.avatar_url) {
        avatarUrl = user.user_metadata.avatar_url;
      } else if (user.user_metadata?.picture) {
        avatarUrl = user.user_metadata.picture;
      } else if (
        profile?.profile_image &&
        profile.profile_image.startsWith("data:image")
      ) {
        avatarUrl = profile.profile_image; // base64 fallback
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

      console.log("Profile fetched:", { user, profile, avatarUrl }); // 🔍 Debug info
    };

    fetchUser();
  }, [open]);

  // ✅ Handle image selection and preview
  const handleImageChange = (file: File) => {
    setProfileImage(file);
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) setCurrentImage(e.target.result as string);
    };
    reader.readAsDataURL(file);
  };

  // ✅ Save profile changes
  const handleSave = async () => {
    if (!userId) return;
    setLoading(true);

    try {
      let imageBase64 = currentImage;

      await supabase
        .from("users")
        .upsert({
          id: userId,
          username: name,
          user_email: email,
          phone_number: phoneNumber,
          profile_image: imageBase64,
        });

      alert("Profile updated successfully!");
      onClose();
    } catch (err: any) {
      alert(err.message || "Failed to update profile");
    }

    setLoading(false);
  };

  return (
    <Dialog open={open} onClose={onClose} className="relative z-50">
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />

      {/* Modal Content */}
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="mx-auto max-w-md w-full bg-white rounded-xl p-6 shadow-lg flex flex-col gap-4">
          <Dialog.Title className="text-xl font-bold text-center">
            Edit Profile
          </Dialog.Title>

          {/* Profile Image Section */}
          <div className="flex flex-col items-center">
            <img
              src={
                currentImage && currentImage.startsWith("http")
                  ? currentImage
                  : "/profile-placeholder.png"
              }
              alt="Profile"
              className="w-32 h-32 rounded-full object-cover mb-4 border"
            />
            <input
              type="file"
              accept="image/*"
              onChange={(e) =>
                e.target.files && handleImageChange(e.target.files[0])
              }
              className="mt-2 text-sm"
            />
          </div>

          {/* Name */}
          <label className="flex flex-col">
            Name
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 p-2 border rounded"
            />
          </label>

          {/* Email */}
          <label className="flex flex-col">
            Email (cannot edit)
            <input
              type="text"
              value={email}
              disabled
              className="mt-1 p-2 border rounded bg-gray-100 text-gray-600"
            />
          </label>

          {/* Phone */}
          <label className="flex flex-col">
            Phone Number
            <input
              type="text"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="mt-1 p-2 border rounded"
            />
          </label>

          {/* Buttons */}
          <div className="flex justify-end gap-2 mt-4">
            <button
              onClick={onClose}
              className="px-4 py-2 border rounded hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? "Saving..." : "Save"}
            </button>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}
