"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  BookOpen,
  BookPlus,
  BookMarked,
  ArrowLeft,
  Pencil,
} from "lucide-react";

import { authClient, getJWTToken } from "@/lib/auth-client";
import EditProfileModal from "@/components/profile/EditProfileModal";
import { toast } from "sonner";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface ProfileStats {
  totalBooksAdded: number;
  totalBooksBorrowed: number;
  currentlyBorrowed: number;
}

export default function UserProfilePage() {
  const { data: session, isPending } = authClient.useSession();

  const [stats, setStats] = useState<ProfileStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [editOpen, setEditOpen] = useState(false);

  const user = session?.user;

  useEffect(() => {
    if (isPending || !user?.email) return;

    let cancelled = false;

    const fetchProfile = async () => {
      try {
        const token = await getJWTToken();

        if (!token) {
          throw new Error("Please login again");
        }

        const response = await fetch(`${API_URL}/users/profile-stats`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to load profile");
        }

        if (!cancelled) {
          setStats(data);
        }
      } catch (error) {
        if (!cancelled) {
          toast.error(
            error instanceof Error ? error.message : "Something went wrong",
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchProfile();

    return () => {
      cancelled = true;
    };
  }, [isPending, user?.email]);

  if (isPending || (user?.email && loading)) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center text-[#183f32]">
        Loading profile...
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
        <BookOpen size={45} className="text-[#183f32]" />

        <h2 className="text-xl font-bold text-[#183f32]">Please Login First</h2>

        <Link
          href="/login"
          className="rounded-lg bg-[#183f32] px-5 py-2.5 text-white"
        >
          Login
        </Link>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#faf9f6] px-5 py-12">
      <div className="mx-auto max-w-5xl">
        <Link
          href="/"
          className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-[#183f32] hover:text-[#c18b45]"
        >
          <ArrowLeft size={17} />
          Back to Home
        </Link>

        <div className="overflow-hidden rounded-2xl border border-[#e8e5dc] bg-white shadow-sm">
          {/* Profile Header */}
          <div className="bg-[#183f32] px-6 py-10 text-center sm:px-10">
            {user.image ? (
              <Image
                src={user.image}
                alt={user.name || "User"}
                width={100}
                height={100}
                unoptimized
                className="mx-auto h-24 w-24 rounded-full border-4 border-white object-cover"
              />
            ) : (
              <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full border-4 border-white bg-[#c18b45] text-3xl font-bold text-white">
                {user.name?.charAt(0).toUpperCase() || "U"}
              </div>
            )}

            <h1 className="mt-4 text-2xl font-bold text-white">
              {user.name || "User"}
            </h1>

            <p className="mt-1 text-sm text-gray-200">{user.email}</p>

            <p className="mt-3 text-xs tracking-widest text-[#e4c18e]">
              BOOKNOOK MEMBER
            </p>
          </div>

          {/* Statistics */}
          <div className="grid grid-cols-1 gap-4 p-6 sm:grid-cols-3 sm:p-8">
            <StatCard
              icon={<BookPlus size={25} />}
              title="Books Added"
              value={stats?.totalBooksAdded ?? 0}
            />

            <StatCard
              icon={<BookOpen size={25} />}
              title="Total Borrowed"
              value={stats?.totalBooksBorrowed ?? 0}
            />

            <StatCard
              icon={<BookMarked size={25} />}
              title="Currently Borrowed"
              value={stats?.currentlyBorrowed ?? 0}
            />
          </div>

          {/* Account Information */}
          <div className="border-t border-[#e8e5dc] px-6 py-7 sm:px-8">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-lg font-bold text-[#183f32]">
                Account Information
              </h2>

              <button
                onClick={() => setEditOpen(true)}
                className="flex items-center gap-2 rounded-lg bg-[#183f32] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#245c47]"
              >
                <Pencil size={15} />
                Edit Profile
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <p className="text-xs font-medium text-gray-500">Full Name</p>

                <p className="mt-1 font-semibold text-[#183f32]">
                  {user.name || "Not provided"}
                </p>
              </div>

              <div>
                <p className="text-xs font-medium text-gray-500">
                  Email Address
                </p>

                <p className="mt-1 font-semibold text-[#183f32]">
                  {user.email}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      <EditProfileModal
        isOpen={editOpen}
        onClose={() => setEditOpen(false)}
        user={{
          name: user.name,
          image: user.image,
        }}
      />
    </main>
  );
}

function StatCard({
  icon,
  title,
  value,
}: {
  icon: React.ReactNode;
  title: string;
  value: number;
}) {
  return (
    <div className="rounded-xl border border-[#e8e5dc] bg-[#faf9f6] p-5">
      <div className="mb-3 text-[#c18b45]">{icon}</div>

      <p className="text-sm text-gray-500">{title}</p>

      <p className="mt-1 text-3xl font-bold text-[#183f32]">{value}</p>
    </div>
  );
}
