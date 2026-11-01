"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  BookOpen,
  BookPlus,
  BookMarked,
  ArrowLeft,
  Pencil,
  Mail,
  UserRound,
  Sparkles,
  Library,
  CalendarDays,
  ShieldCheck,
  LoaderCircle,
  ArrowRight,
} from "lucide-react";
import { toast } from "sonner";

import { authClient, getJWTToken } from "@/lib/auth-client";
import EditProfileModal from "@/components/profile/EditProfileModal";

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
    if (isPending) return;

    if (!user?.email) {
      return;
    }

    let cancelled = false;

    const fetchProfile = async () => {
      try {
        if (!API_URL) {
          throw new Error("API URL is not configured");
        }

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
        console.error(error);

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

    void fetchProfile();

    return () => {
      cancelled = true;
    };
  }, [isPending, user?.email]);

  // Loading
  if (isPending || (user?.email && loading)) {
    return (
      <main className="min-h-screen bg-[#faf9f6] px-5 py-16">
        <div className="mx-auto max-w-5xl">
          <div className="h-10 w-40 animate-pulse rounded-lg bg-[#eae7df]" />

          <div className="mt-8 overflow-hidden rounded-3xl border border-[#eae7df] bg-white">
            <div className="h-64 animate-pulse bg-[#183f32]/20" />

            <div className="grid gap-4 p-7 sm:grid-cols-3">
              {Array.from({ length: 3 }).map((_, index) => (
                <div
                  key={index}
                  className="h-28 animate-pulse rounded-2xl bg-[#eeece5]"
                />
              ))}
            </div>

            <div className="space-y-4 p-7">
              <div className="h-5 w-48 animate-pulse rounded bg-[#eeece5]" />
              <div className="h-12 animate-pulse rounded-xl bg-[#eeece5]" />
              <div className="h-12 animate-pulse rounded-xl bg-[#eeece5]" />
            </div>
          </div>
        </div>
      </main>
    );
  }

  // Login required
  if (!user) {
    return (
      <main className="flex min-h-[70vh] items-center justify-center bg-[#faf9f6] px-5">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md rounded-3xl border border-[#eae7df] bg-white p-9 text-center shadow-xl shadow-[#183f32]/5"
        >
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-[#f3eee5] text-[#b58749]">
            <BookOpen size={38} />
          </div>

          <h2 className="mt-6 text-2xl font-bold text-[#183f32]">
            Please Login First
          </h2>

          <p className="mt-3 text-sm leading-7 text-gray-500">
            Login to view your profile and manage your BookNook account.
          </p>

          <Link
            href="/login"
            className="mt-7 inline-flex items-center justify-center gap-2 rounded-xl bg-[#183f32] px-7 py-3.5 text-sm font-semibold text-white transition hover:bg-[#245c47]"
          >
            Login to Continue
            <ArrowRight size={17} />
          </Link>
        </motion.div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#faf9f6] px-5 py-12 md:py-16">
      <div className="mx-auto max-w-5xl">
        {/* Back Navigation */}
        <motion.div
          initial={{ opacity: 0, x: -15 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <Link
            href="/"
            className="mb-8 inline-flex items-center gap-2 text-sm font-semibold text-[#183f32] transition hover:text-[#b58749]"
          >
            <ArrowLeft size={17} />
            Back to Home
          </Link>
        </motion.div>

        {/* Profile Card */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="overflow-hidden rounded-3xl border border-[#eae7df] bg-white shadow-[0_15px_50px_rgba(24,63,50,0.07)]"
        >
          {/* Profile Header */}
          <div className="relative overflow-hidden bg-[#183f32] px-6 py-12 text-center sm:px-10 md:py-16">
            {/* Decorative Circles */}
            <div className="absolute -right-20 -top-24 h-72 w-72 rounded-full border border-white/10" />
            <div className="absolute -right-10 -top-14 h-52 w-52 rounded-full border border-white/10" />
            <div className="absolute -bottom-28 -left-20 h-64 w-64 rounded-full border border-white/10" />

            <div className="relative z-10">
              {/* Member Badge */}
              <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-semibold tracking-wider text-[#e5c995] backdrop-blur">
                <Sparkles size={14} />
                BOOKNOOK MEMBER
              </div>

              {/* Avatar */}
              <div className="relative mx-auto h-28 w-28">
                {user.image ? (
                  <Image
                    src={user.image}
                    alt={user.name || "User"}
                    width={112}
                    height={112}
                    unoptimized
                    className="h-28 w-28 rounded-full border-4 border-[#d9b779] object-cover shadow-xl"
                  />
                ) : (
                  <div className="flex h-28 w-28 items-center justify-center rounded-full border-4 border-[#d9b779] bg-[#b58749] text-4xl font-bold text-white shadow-xl">
                    {user.name?.charAt(0).toUpperCase() || "U"}
                  </div>
                )}

                <div className="absolute bottom-1 right-1 flex h-7 w-7 items-center justify-center rounded-full border-2 border-[#183f32] bg-[#d9b779] text-[#183f32]">
                  <ShieldCheck size={15} />
                </div>
              </div>

              {/* User Name */}
              <h1 className="mt-5 text-3xl font-bold tracking-tight text-white md:text-4xl">
                {user.name || "BookNook User"}
              </h1>

              <p className="mt-2 flex items-center justify-center gap-2 text-sm text-white/65">
                <Mail size={15} />
                {user.email}
              </p>

              <p className="mt-5 text-xs font-medium tracking-[0.25em] text-[#e5c995]">
                YOUR READING JOURNEY STARTS HERE
              </p>
            </div>
          </div>

          {/* Statistics Section */}
          <div className="p-6 sm:p-8">
            <div className="mb-6">
              <div className="flex items-center gap-2">
                <Library size={19} className="text-[#b58749]" />
                <h2 className="text-lg font-bold text-[#183f32]">
                  Reading Overview
                </h2>
              </div>

              <p className="mt-1 text-sm text-gray-500">
                Your BookNook activity at a glance.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <StatCard
                icon={<BookPlus size={24} />}
                title="Books Added"
                value={stats?.totalBooksAdded ?? 0}
                description="Books shared by you"
                delay={0}
              />

              <StatCard
                icon={<BookOpen size={24} />}
                title="Total Borrowed"
                value={stats?.totalBooksBorrowed ?? 0}
                description="Total borrowing records"
                delay={0.08}
              />

              <StatCard
                icon={<BookMarked size={24} />}
                title="Currently Borrowed"
                value={stats?.currentlyBorrowed ?? 0}
                description="Active borrowed books"
                delay={0.16}
              />
            </div>
          </div>

          {/* Account Information */}
          <div className="border-t border-[#eae7df] px-6 py-8 sm:px-8">
            <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
              <div>
                <div className="flex items-center gap-2">
                  <UserRound size={19} className="text-[#b58749]" />
                  <h2 className="text-lg font-bold text-[#183f32]">
                    Account Information
                  </h2>
                </div>

                <p className="mt-1 text-sm text-gray-500">
                  Manage your personal account details.
                </p>
              </div>

              <button
                onClick={() => setEditOpen(true)}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#183f32] px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-[#183f32]/10 transition hover:-translate-y-0.5 hover:bg-[#245c47]"
              >
                <Pencil size={15} />
                Edit Profile
              </button>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {/* Name */}
              <div className="rounded-2xl border border-[#eae7df] bg-[#faf9f6] p-5">
                <div className="flex items-center gap-2 text-gray-400">
                  <UserRound size={16} />
                  <p className="text-xs font-medium">Full Name</p>
                </div>

                <p className="mt-3 break-words font-semibold text-[#183f32]">
                  {user.name || "Not provided"}
                </p>
              </div>

              {/* Email */}
              <div className="rounded-2xl border border-[#eae7df] bg-[#faf9f6] p-5">
                <div className="flex items-center gap-2 text-gray-400">
                  <Mail size={16} />
                  <p className="text-xs font-medium">Email Address</p>
                </div>

                <p className="mt-3 break-all font-semibold text-[#183f32]">
                  {user.email}
                </p>
              </div>
            </div>
          </div>

          {/* Footer Note */}
          <div className="flex items-center justify-center gap-2 border-t border-[#eae7df] bg-[#faf9f6] px-5 py-5 text-center">
            <Sparkles size={15} className="shrink-0 text-[#b58749]" />
            <p className="text-xs text-gray-500">
              Thank you for being part of the BookNook community.
            </p>
          </div>
        </motion.div>
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

// Statistics Card
function StatCard({
  icon,
  title,
  value,
  description,
  delay,
}: {
  icon: React.ReactNode;
  title: string;
  value: number;
  description: string;
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className="group rounded-2xl border border-[#eae7df] bg-[#faf9f6] p-5 transition-all duration-300 hover:-translate-y-1 hover:border-[#d9c7a8] hover:bg-white hover:shadow-lg hover:shadow-[#183f32]/5"
    >
      <div className="flex items-center justify-between">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#f3eee5] text-[#b58749] transition group-hover:bg-[#183f32] group-hover:text-[#e5c995]">
          {icon}
        </div>

        <Sparkles
          size={16}
          className="text-[#d9c7a8] transition group-hover:text-[#b58749]"
        />
      </div>

      <p className="mt-5 text-sm font-medium text-gray-500">{title}</p>

      <p className="mt-1 text-3xl font-bold tracking-tight text-[#183f32]">
        {value}
      </p>

      <p className="mt-2 text-xs text-gray-400">{description}</p>
    </motion.div>
  );
}
