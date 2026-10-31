"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { RotateCcw, BookOpen } from "lucide-react";
import { toast } from "sonner";

import { authClient } from "@/lib/auth-client";

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

  useEffect(() => {
    if (isPending) return;

    if (!session?.user?.email) {
      return;
    }

    const fetchBorrows = async () => {
      try {
        const response = await fetch(
          `${API_URL}/borrows?userEmail=${encodeURIComponent(
            session.user.email,
          )}`,
        );

        if (!response.ok) {
          throw new Error("Failed to load borrowed books");
        }

        const data = await response.json();
        setBorrows(Array.isArray(data) ? data : []);
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : "Something went wrong",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchBorrows();
  }, [session, isPending]);

  const handleReturn = async (borrow: Borrow) => {
    setReturningId(borrow._id);

    try {
      const response = await fetch(`${API_URL}/borrows/${borrow._id}`, {
        method: "DELETE",
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

  if (isPending || (!!session?.user?.email && loading)) {
    return (
      <div className="py-16 text-center text-[#183f32]">
        Loading borrowed books...
      </div>
    );
  }

  if (!session?.user?.email || borrows.length === 0) {
    return (
      <div className="rounded-2xl border border-[#e8e5dc] bg-white px-5 py-16 text-center">
        <BookOpen className="mx-auto mb-4 text-[#c18b45]" size={42} />

        <h2 className="text-xl font-bold text-[#183f32]">No Borrowed Books</h2>

        <p className="mt-2 text-gray-500">
          You have not borrowed any books yet.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-[#e8e5dc] bg-white">
      <table className="w-full min-w-[750px] text-left">
        <thead className="bg-[#183f32] text-white">
          <tr>
            <th className="px-5 py-4">Book</th>
            <th className="px-5 py-4">Borrow Date</th>
            <th className="px-5 py-4">Return Date</th>
            <th className="px-5 py-4">Action</th>
          </tr>
        </thead>

        <tbody>
          {borrows.map((borrow) => (
            <tr key={borrow._id} className="border-b border-[#eeeae1]">
              <td className="px-5 py-4">
                <div className="flex items-center gap-3">
                  {borrow.bookImage?.trim() ? (
                    <Image
                      src={borrow.bookImage.trim()}
                      alt={borrow.bookTitle || "Book"}
                      width={48}
                      height={64}
                      unoptimized
                      className="h-16 w-12 rounded-md object-cover"
                    />
                  ) : (
                    <div className="flex h-16 w-12 items-center justify-center rounded-md bg-[#f3f0e8]">
                      <BookOpen size={20} />
                    </div>
                  )}

                  <span className="font-semibold text-[#183f32]">
                    {borrow.bookTitle}
                  </span>
                </div>
              </td>

              <td className="px-5 py-4 text-sm text-gray-600">
                {new Date(borrow.borrowDate).toLocaleDateString()}
              </td>

              <td className="px-5 py-4 text-sm text-gray-600">
                {new Date(borrow.returnDate).toLocaleDateString()}
              </td>

              <td className="px-5 py-4">
                <button
                  onClick={() => handleReturn(borrow)}
                  disabled={returningId === borrow._id}
                  className="flex items-center gap-2 rounded-lg bg-[#183f32] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#245c47] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <RotateCcw size={15} />

                  {returningId === borrow._id ? "Returning..." : "Return"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
