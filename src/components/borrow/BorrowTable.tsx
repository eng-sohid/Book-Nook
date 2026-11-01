"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import {
  RotateCcw,
  BookOpen,
  CalendarDays,
  Clock,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";

import { authClient, getJWTToken } from "@/lib/auth-client";

interface Borrow {
  _id: string;
  bookId: string;
  bookTitle: string;
  bookImage: string;
  userEmail: string;
  borrowDate: string;
  returnDate: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function BorrowTable() {
  const { data: session, isPending } = authClient.useSession();

  const [borrows, setBorrows] = useState<Borrow[]>([]);
  const [loading, setLoading] = useState(true);
  const [returningId, setReturningId] = useState<string | null>(null);

  // Fetch Borrowed Books
  const fetchBorrows = useCallback(async () => {
    try {
      const token = await getJWTToken();

      if (!token) {
        throw new Error("Authentication token not found. Please login again.");
      }

      const response = await fetch(`${API_URL}/borrows`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to load borrowed books");
      }

      setBorrows(Array.isArray(data) ? data : []);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Something went wrong",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;

    const loadBorrows = async () => {
      if (isPending) return;

      if (!session?.user?.email) {
        setLoading(false);
        setBorrows([]);
        return;
      }

      try {
        const token = await getJWTToken();

        if (!token) {
          throw new Error(
            "Authentication token not found. Please login again.",
          );
        }

        const response = await fetch(`${API_URL}/borrows`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to load borrowed books");
        }

        if (!cancelled) {
          setBorrows(Array.isArray(data) ? data : []);
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

    void loadBorrows();

    return () => {
      cancelled = true;
    };
  }, [session?.user?.email, isPending]);

  // Return Book
  const handleReturn = async (borrow: Borrow) => {
    setReturningId(borrow._id);

    try {
      const token = await getJWTToken();

      if (!token) {
        throw new Error("Authentication token not found. Please login again.");
      }

      const response = await fetch(`${API_URL}/borrows/${borrow._id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to return book");
      }

      setBorrows((previous) =>
        previous.filter((item) => item._id !== borrow._id),
      );

      toast.success("Book returned successfully!");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Something went wrong",
      );
    } finally {
      setReturningId(null);
    }
  };

  // Loading State
  if (isPending || (session?.user?.email && loading)) {
    return (
      <div className="flex min-h-[300px] flex-col items-center justify-center rounded-3xl border border-[#e9e4da] bg-white">
        <div className="relative flex h-14 w-14 items-center justify-center">
          <div className="absolute inset-0 animate-spin rounded-full border-[3px] border-[#e8e2d5] border-t-[#183f32]" />
          <BookOpen size={22} className="text-[#183f32]" />
        </div>

        <p className="mt-5 text-sm font-medium text-[#77796f]">
          Loading your borrowed books...
        </p>
      </div>
    );
  }

  // Empty State
  if (!session?.user?.email || borrows.length === 0) {
    return (
      <div className="relative overflow-hidden rounded-[28px] border border-[#e9e4da] bg-white px-5 py-20 text-center shadow-[0_15px_50px_rgba(24,63,50,0.04)]">
        <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-[#b58749]/[0.07] blur-3xl" />

        <div className="relative mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-[#183f32] text-[#e5c995] shadow-lg shadow-[#183f32]/15">
          <BookOpen size={36} strokeWidth={1.5} />
        </div>

        <div className="mt-7 flex items-center justify-center gap-2 text-[10px] font-bold tracking-[2px] text-[#b58749]">
          <Sparkles size={13} />
          YOUR LIBRARY
        </div>

        <h2 className="mt-3 font-serif text-2xl font-bold text-[#183f32] sm:text-3xl">
          No Borrowed Books Yet
        </h2>

        <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-[#77796f]">
          Your reading journey is waiting to begin. Explore our collection and
          find your next favorite book.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-[24px] border border-[#e9e4da] bg-white shadow-[0_15px_50px_rgba(24,63,50,0.05)]">
      {/* Table Header */}
      <div className="flex flex-col justify-between gap-3 border-b border-[#e9e4da] px-5 py-5 sm:flex-row sm:items-center sm:px-7">
        <div>
          <h2 className="font-serif text-xl font-bold text-[#183f32]">
            Your Borrowed Collection
          </h2>

          <p className="mt-1 text-xs text-[#858276]">
            Manage and track your borrowed books.
          </p>
        </div>

        <div className="inline-flex w-fit items-center gap-2 rounded-full border border-[#b58749]/25 bg-[#b58749]/10 px-4 py-2 text-xs font-bold text-[#986d32]">
          <BookOpen size={14} />
          {borrows.length} {borrows.length === 1 ? "Book" : "Books"}
        </div>
      </div>

      {/* Responsive Table */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[750px] text-left">
          <thead className="bg-[#183f32] text-[11px] font-bold uppercase tracking-[1px] text-[#e5c995]">
            <tr>
              <th className="px-6 py-5">Book Details</th>
              <th className="px-6 py-5">Borrow Date</th>
              <th className="px-6 py-5">Return Date</th>
              <th className="px-6 py-5">Action</th>
            </tr>
          </thead>

          <tbody>
            {borrows.map((borrow) => (
              <tr
                key={borrow._id}
                className="border-b border-[#eeeae1] transition-colors last:border-0 hover:bg-[#faf9f6]/80"
              >
                {/* Book */}
                <td className="px-6 py-5">
                  <div className="flex items-center gap-4">
                    {borrow.bookImage?.trim() ? (
                      <Image
                        src={borrow.bookImage.trim()}
                        alt={borrow.bookTitle || "Book"}
                        width={52}
                        height={70}
                        unoptimized
                        className="h-[70px] w-[52px] rounded-lg object-cover shadow-md"
                      />
                    ) : (
                      <div className="flex h-[70px] w-[52px] items-center justify-center rounded-lg bg-[#183f32] text-[#e5c995]">
                        <BookOpen size={21} />
                      </div>
                    )}

                    <div className="max-w-[220px]">
                      <p className="font-serif font-bold text-[#183f32]">
                        {borrow.bookTitle || "Untitled Book"}
                      </p>

                      <span className="mt-2 inline-flex items-center gap-1.5 text-[10px] font-semibold text-emerald-700">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                        Currently Borrowed
                      </span>
                    </div>
                  </div>
                </td>

                {/* Borrow Date */}
                <td className="px-6 py-5">
                  <div className="flex items-center gap-2 text-sm text-[#59675d]">
                    <CalendarDays
                      size={15}
                      className="shrink-0 text-[#b58749]"
                    />
                    {new Date(borrow.borrowDate).toLocaleDateString()}
                  </div>
                </td>

                {/* Return Date */}
                <td className="px-6 py-5">
                  <div className="flex items-center gap-2 text-sm text-[#59675d]">
                    <Clock size={15} className="shrink-0 text-[#b58749]" />
                    {new Date(borrow.returnDate).toLocaleDateString()}
                  </div>
                </td>

                {/* Action */}
                <td className="px-6 py-5">
                  <button
                    type="button"
                    onClick={() => handleReturn(borrow)}
                    disabled={returningId === borrow._id}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#183f32] px-4 py-2.5 text-xs font-bold text-white transition-all hover:-translate-y-0.5 hover:bg-[#245c47] disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <RotateCcw
                      size={14}
                      className={
                        returningId === borrow._id ? "animate-spin" : ""
                      }
                    />

                    {returningId === borrow._id
                      ? "Returning..."
                      : "Return Book"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Bottom Note */}
      <div className="flex items-center gap-2 border-t border-[#e9e4da] bg-[#faf9f6] px-6 py-4 text-[11px] text-[#858276]">
        <Sparkles size={13} className="text-[#b58749]" />
        Please return your borrowed books on or before the return date.
      </div>
    </div>
  );
}
