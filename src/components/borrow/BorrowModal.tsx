"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  BookOpen,
  CalendarDays,
  UserRound,
  Mail,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";

import { authClient, getJWTToken } from "@/lib/auth-client";

interface BorrowModalProps {
  isOpen: boolean;
  onClose: () => void;
  book: {
    _id: string;
    title: string;
    image: string;
    availableCopies: number;
  };
  onBorrowSuccess?: () => void | Promise<void>;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL;

function getLocalDate() {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export default function BorrowModal({
  isOpen,
  onClose,
  book,
  onBorrowSuccess,
}: BorrowModalProps) {
  const { data: session } = authClient.useSession();

  const [borrowDate, setBorrowDate] = useState(getLocalDate);
  const [returnDate, setReturnDate] = useState("");
  const [loading, setLoading] = useState(false);

  const handleBorrow = async () => {
    if (!session?.user) {
      toast.error("Please login first");
      return;
    }

    if (!borrowDate || !returnDate) {
      toast.error("Please select both dates");
      return;
    }

    if (returnDate <= borrowDate) {
      toast.error("Return date must be after borrow date");
      return;
    }

    if (book.availableCopies <= 0) {
      toast.error("No copies available");
      return;
    }

    setLoading(true);

    try {
      const token = await getJWTToken();

      if (!token) {
        throw new Error("Authentication token not found. Please login again.");
      }

      const response = await fetch(`${API_URL}/borrows`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          bookId: book._id,
          borrowDate,
          returnDate,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to borrow book");
      }

      toast.success("Book borrowed successfully!");

      await onBorrowSuccess?.();
      onClose();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Something went wrong",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-[#102b23]/65 px-4 py-6 backdrop-blur-sm"
          onClick={(event) => {
            if (event.target === event.currentTarget && !loading) {
              onClose();
            }
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: 25, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.97 }}
            transition={{ duration: 0.25 }}
            className="relative my-auto max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-[28px] border border-[#e9e4da] bg-[#faf9f6] p-6 shadow-2xl sm:p-8"
          >
            {/* Close Button */}
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              aria-label="Close modal"
              className="absolute right-5 top-5 flex h-9 w-9 items-center justify-center rounded-full border border-[#e8e5dc] bg-white text-[#77796f] transition hover:bg-[#183f32] hover:text-white disabled:opacity-50"
            >
              <X size={18} />
            </button>

            {/* Header */}
            <div className="mb-7 pr-8">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#183f32] text-[#e5c995]">
                <BookOpen size={23} />
              </div>

              <div className="flex items-center gap-2 text-[10px] font-bold tracking-[2px] text-[#b58749]">
                <Sparkles size={13} />
                BOOKNOOK LIBRARY
              </div>

              <h2 className="mt-2 font-serif text-3xl font-bold text-[#183f32]">
                Borrow This Book
              </h2>

              <p className="mt-2 text-sm leading-6 text-[#77796f]">
                Confirm your information and choose your borrowing dates.
              </p>
            </div>

            {/* Selected Book */}
            <div className="mb-6 flex items-center gap-4 rounded-2xl border border-[#e8e5dc] bg-white p-4">
              {book.image?.trim() ? (
                <Image
                  src={book.image.trim()}
                  alt={book.title}
                  width={70}
                  height={95}
                  unoptimized
                  className="h-24 w-16 rounded-lg object-cover shadow-md"
                />
              ) : (
                <div className="flex h-24 w-16 items-center justify-center rounded-lg bg-[#183f32] text-[#e5c995]">
                  <BookOpen size={25} />
                </div>
              )}

              <div className="min-w-0">
                <p className="text-[10px] font-bold uppercase tracking-[1.5px] text-[#b58749]">
                  Selected Book
                </p>

                <h3 className="mt-2 line-clamp-2 font-serif text-lg font-bold text-[#183f32]">
                  {book.title}
                </h3>

                <p className="mt-2 text-xs text-[#77796f]">
                  Available Copies:{" "}
                  <span className="font-bold text-[#183f32]">
                    {book.availableCopies}
                  </span>
                </p>
              </div>
            </div>

            {/* User Information */}
            <div className="mb-6 space-y-4 rounded-2xl border border-[#e8e5dc] bg-white p-5">
              <div className="flex items-center gap-2">
                <UserRound size={16} className="text-[#b58749]" />
                <label className="text-xs font-bold uppercase tracking-[1px] text-[#183f32]">
                  Your Information
                </label>
              </div>

              <div>
                <label className="mb-2 block text-xs font-semibold text-[#77796f]">
                  Full Name
                </label>

                <div className="flex items-center gap-3 rounded-xl border border-[#eeeae1] bg-[#faf9f6] px-4 py-3">
                  <UserRound size={16} className="text-[#b58749]" />
                  <input
                    value={session?.user?.name || ""}
                    readOnly
                    className="w-full bg-transparent text-sm font-medium text-[#183f32] outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-xs font-semibold text-[#77796f]">
                  Email Address
                </label>

                <div className="flex items-center gap-3 rounded-xl border border-[#eeeae1] bg-[#faf9f6] px-4 py-3">
                  <Mail size={16} className="text-[#b58749]" />
                  <input
                    value={session?.user?.email || ""}
                    readOnly
                    className="w-full bg-transparent text-sm font-medium text-[#183f32] outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Borrowing Dates */}
            <div className="mb-7">
              <div className="mb-4 flex items-center gap-2">
                <CalendarDays size={17} className="text-[#b58749]" />
                <h3 className="text-sm font-bold text-[#183f32]">
                  Select Borrowing Dates
                </h3>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-xs font-semibold text-[#77796f]">
                    Borrow Date
                  </label>

                  <input
                    type="date"
                    value={borrowDate}
                    min={getLocalDate()}
                    onChange={(event) => setBorrowDate(event.target.value)}
                    className="w-full rounded-xl border border-[#e8e5dc] bg-white px-3 py-3 text-sm text-[#183f32] outline-none transition focus:border-[#b58749] focus:ring-2 focus:ring-[#b58749]/10"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-xs font-semibold text-[#77796f]">
                    Return Date
                  </label>

                  <input
                    type="date"
                    value={returnDate}
                    min={borrowDate || getLocalDate()}
                    onChange={(event) => setReturnDate(event.target.value)}
                    className="w-full rounded-xl border border-[#e8e5dc] bg-white px-3 py-3 text-sm text-[#183f32] outline-none transition focus:border-[#b58749] focus:ring-2 focus:ring-[#b58749]/10"
                  />
                </div>
              </div>
            </div>

            {/* Confirm Button */}
            <button
              type="button"
              onClick={handleBorrow}
              disabled={loading || !session?.user || book.availableCopies <= 0}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#183f32] px-5 py-4 text-sm font-bold text-white shadow-lg shadow-[#183f32]/15 transition-all hover:-translate-y-0.5 hover:bg-[#245c47] hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50"
            >
              <BookOpen size={18} />
              {loading ? "Processing..." : "Confirm Borrow"}
            </button>

            {/* Security Note */}
            <div className="mt-5 flex items-center justify-center gap-2 text-[11px] text-[#858276]">
              <ShieldCheck size={14} className="text-[#b58749]" />
              Your information is securely protected.
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
