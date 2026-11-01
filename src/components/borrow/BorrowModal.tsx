"use client";

import { useState } from "react";
import Image from "next/image";
import { X, BookOpen } from "lucide-react";
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
  onBorrowSuccess?: () => void;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function BorrowModal({
  isOpen,
  onClose,
  book,
  onBorrowSuccess,
}: BorrowModalProps) {
  const { data: session } = authClient.useSession();

  const [borrowDate, setBorrowDate] = useState(
    new Date().toISOString().split("T")[0],
  );

  const [returnDate, setReturnDate] = useState("");
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleBorrow = async () => {
    if (!session?.user) {
      toast.error("Please login first");
      return;
    }

    if (!borrowDate || !returnDate) {
      toast.error("Please select both dates");
      return;
    }

    if (new Date(returnDate) <= new Date(borrowDate)) {
      toast.error("Return date must be after borrow date");
      return;
    }

    if (book.availableCopies <= 0) {
      toast.error("No copies available");
      return;
    }

    setLoading(true);

    try {
      // Get JWT token
      const token = await getJWTToken();

      if (!token) {
        throw new Error("Authentication token not found. Please login again.");
      }

      // Send borrow request with JWT
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

      onBorrowSuccess?.();
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
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 px-4 py-6">
      <div className="relative max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-[#faf9f6] p-6 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full p-2 text-gray-500 hover:bg-gray-200"
          aria-label="Close modal"
        >
          <X size={20} />
        </button>

        <div className="mb-6">
          <h2 className="text-2xl font-bold text-[#183f32]">
            Borrow This Book
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Confirm your information and borrowing dates.
          </p>
        </div>

        <div className="mb-6 flex items-center gap-4 rounded-xl border border-[#e8e5dc] bg-white p-4">
          {book.image ? (
            <Image
              src={book.image}
              alt={book.title}
              width={70}
              height={95}
              unoptimized
              className="h-24 w-16 rounded-lg object-cover"
            />
          ) : (
            <div className="flex h-24 w-16 items-center justify-center rounded-lg bg-gray-100">
              <BookOpen size={25} />
            </div>
          )}

          <div>
            <h3 className="font-bold text-[#183f32]">{book.title}</h3>

            <p className="mt-1 text-sm text-gray-500">
              Available Copies: {book.availableCopies}
            </p>
          </div>
        </div>

        <div className="mb-5 space-y-3 rounded-xl bg-white p-4">
          <div>
            <label className="text-sm font-semibold text-gray-600">
              Your Name
            </label>

            <input
              value={session?.user?.name || ""}
              readOnly
              className="mt-1 w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm outline-none"
            />
          </div>

          <div>
            <label className="text-sm font-semibold text-gray-600">
              Your Email
            </label>

            <input
              value={session?.user?.email || ""}
              readOnly
              className="mt-1 w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm outline-none"
            />
          </div>
        </div>

        <div className="mb-6 grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-semibold text-[#183f32]">
              Borrow Date
            </label>

            <input
              type="date"
              value={borrowDate}
              min={borrowDate}
              onChange={(event) => setBorrowDate(event.target.value)}
              className="w-full rounded-lg border border-[#e8e5dc] bg-white px-3 py-2 outline-none focus:border-[#183f32]"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-[#183f32]">
              Return Date
            </label>

            <input
              type="date"
              value={returnDate}
              min={borrowDate}
              onChange={(event) => setReturnDate(event.target.value)}
              className="w-full rounded-lg border border-[#e8e5dc] bg-white px-3 py-2 outline-none focus:border-[#183f32]"
            />
          </div>
        </div>

        <button
          onClick={handleBorrow}
          disabled={loading || !session?.user || book.availableCopies <= 0}
          className="w-full rounded-xl bg-[#183f32] px-5 py-3 font-semibold text-white transition hover:bg-[#245c47] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? "Processing..." : "Confirm Borrow"}
        </button>
      </div>
    </div>
  );
}
