"use client";

import { useState } from "react";
import { X, Save, Pencil } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: {
    name?: string | null;
    image?: string | null;
  };
}

export default function EditProfileModal({
  isOpen,
  onClose,
  user,
}: EditProfileModalProps) {
  const [name, setName] = useState(user.name || "");
  const [image, setImage] = useState(user.image || "");
  const [saving, setSaving] = useState(false);

  if (!isOpen) return null;

  const handleUpdate = async () => {
    if (!name.trim()) {
      toast.error("Name is required");
      return;
    }

    setSaving(true);

    try {
      const { error } = await authClient.updateUser({
        name: name.trim(),
        image: image.trim() || null,
      });

      if (error) {
        throw new Error(error.message || "Profile update failed");
      }

      toast.success("Profile updated successfully!");
      onClose();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Something went wrong",
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-[#183f32]">Edit Profile</h2>
            <p className="mt-1 text-sm text-gray-500">
              Update your personal information
            </p>
          </div>

          <button
            onClick={onClose}
            disabled={saving}
            className="rounded-lg p-2 text-gray-500 transition hover:bg-gray-100"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        <div className="space-y-5">
          <div>
            <label className="mb-2 block text-sm font-semibold text-[#183f32]">
              Full Name
            </label>

            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              className="w-full rounded-lg border border-[#e8e5dc] px-4 py-3 text-sm outline-none focus:border-[#183f32]"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-[#183f32]">
              Profile Image URL
            </label>

            <input
              type="url"
              value={image}
              onChange={(e) => setImage(e.target.value)}
              placeholder="https://example.com/image.jpg"
              className="w-full rounded-lg border border-[#e8e5dc] px-4 py-3 text-sm outline-none focus:border-[#183f32]"
            />
          </div>

          {image.trim() && (
            <div className="flex items-center gap-3 rounded-lg bg-[#faf9f6] p-3">
              <img
                src={image}
                alt="Profile preview"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
                className="h-14 w-14 rounded-full border border-[#e8e5dc] object-cover"
              />

              <p className="text-sm text-gray-500">Profile image preview</p>
            </div>
          )}
        </div>

        <button
          onClick={handleUpdate}
          disabled={saving}
          className="mt-7 flex w-full items-center justify-center gap-2 rounded-lg bg-[#183f32] px-5 py-3 font-semibold text-white transition hover:bg-[#245c47] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {saving ? (
            "Saving..."
          ) : (
            <>
              <Save size={17} />
              Save Changes
            </>
          )}
        </button>
      </div>
    </div>
  );
}
