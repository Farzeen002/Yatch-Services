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

  // Fetch user when modal opens
  useEffect(() => {
    if (!open) return;

    const fetchUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (error || !data.user) return;

      const user = data.user;
      setUserId(user.id);
      setEmail(user.email || "");

      const { data: profile, error: profileError } = await supabase
        .from("users")
        .select("username, phone_number, profile_image")
        .eq("id", user.id)
        .single();

      if (profileError) return console.error(profileError.message);

      if (profile) {
        setName(profile.username || "");
        setPhoneNumber(profile.phone_number || "");
        setCurrentImage(profile.profile_image || "/profile-placeholder.png");
      }
    };

    fetchUser();
  }, [open, supabase]);

  const handleImageChange = (file: File) => {
    setProfileImage(file);
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) setCurrentImage(e.target.result as string);
    };
    reader.readAsDataURL(file); // Convert image to Base64
  };

  const handleSave = async () => {
    if (!userId) return;
    setLoading(true);

    try {
      let imageBase64 = currentImage;

      if (profileImage) {
        // currentImage is already a Base64 string
        imageBase64 = currentImage;
      }

      await supabase
        .from("users")
        .update({
          username: name,
          phone_number: phoneNumber,
          profile_image: imageBase64,
        })
        .eq("id", userId);

      alert("Profile updated successfully!");
      onClose();
    } catch (err: any) {
      alert(err.message || "Failed to update profile");
    }

    setLoading(false);
  };

  return (
    <Dialog open={open} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="mx-auto max-w-md w-full bg-white rounded-xl p-6 shadow-lg flex flex-col gap-4">
          <Dialog.Title className="text-xl font-bold">Edit Profile</Dialog.Title>

          <div className="flex flex-col items-center">
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
