"use client";

import { Suspense, useCallback, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, BookOpen, UserRound } from "lucide-react";
import { toast } from "sonner";

import BorrowModal from "@/components/borrow/BorrowModal";
import { authClient, getJWTToken } from "@/lib/auth-client";

interface Book {
  _id: string;
  title: string;
  author: string;
  category: string;
  image: string;
  description: string;
  totalCopies: number;
  availableCopies: number;
  createdAt: string;
}

interface Borrow {
  bookId: string;
  status: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL;

function BookDetailsContent() {
  const params = useParams<{ id: string }>();
  const id = params.id;

  const { data: session, isPending } = authClient.useSession();

  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [hasBorrowed, setHasBorrowed] = useState(false);
  const [checkingBorrow, setCheckingBorrow] = useState(true);

  // Fetch Book Details
  const fetchBook = useCallback(async () => {
    try {
      const response = await fetch(`${API_URL}/books/${id}`);

      if (!response.ok) {
        throw new Error("Book not found");
      }

      const data = await response.json();

      setBook({
        ...data,
        image: typeof data.image === "string" ? data.image.trim() : "",
      });
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to load book",
      );
      setBook(null);
    } finally {
      setLoading(false);
    }
  }, [id]);

  // Check whether current user has borrowed this book
  const checkBorrowStatus = useCallback(async () => {
    if (isPending) return;

    if (!session?.user?.email) {
      setHasBorrowed(false);
      setCheckingBorrow(false);
      return;
    }

    try {
      setCheckingBorrow(true);

      // Get JWT Token
      const token = await getJWTToken();

      if (!token) {
        throw new Error("Authentication token not found. Please login again.");
      }

      // Fetch current user's borrow records
      const response = await fetch(`${API_URL}/borrows`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to check borrow status");
      }

      const borrows: Borrow[] = Array.isArray(data) ? data : [];

      const alreadyBorrowed = borrows.some(
        (borrow) => borrow.bookId === id && borrow.status === "borrowed",
      );

      setHasBorrowed(alreadyBorrowed);
    } catch (error) {
      setHasBorrowed(false);

      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to check borrow status",
      );
    } finally {
      setCheckingBorrow(false);
    }
  }, [id, session?.user?.email, isPending]);

  // Initial Book Fetch
  useEffect(() => {
    if (!id) return;
    void Promise.resolve().then(() => {
      fetchBook();
    });
  }, [id, fetchBook]);

  // Initial Borrow Status Check
  useEffect(() => {
    let cancelled = false;

    const runCheck = async () => {
      await Promise.resolve();

      if (!cancelled) {
        await checkBorrowStatus();
      }
    };

    void runCheck();

    return () => {
      cancelled = true;
    };
  }, [checkBorrowStatus]);

  // Loading State
  if (loading || isPending || checkingBorrow) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center bg-[#faf9f6]">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#183f32] border-t-transparent" />
      </div>
    );
  }

  // Book Not Found
  if (!book) {
    return (
      <main className="flex min-h-[70vh] flex-col items-center justify-center bg-[#faf9f6] px-5 text-center">
        <BookOpen size={50} className="mb-4 text-[#c18b45]" />

        <h1 className="text-2xl font-bold text-[#183f32]">Book Not Found</h1>

        <Link
          href="/books"
          className="mt-5 rounded-lg bg-[#183f32] px-5 py-3 text-white"
        >
          Back to All Books
        </Link>
      </main>
    );
  }

  const isUnavailable = book.availableCopies <= 0;
  const borrowDisabled = isUnavailable || hasBorrowed;

  return (
    <main className="min-h-screen bg-[#faf9f6] px-5 py-12">
      <div className="mx-auto max-w-6xl">
        <Link
          href="/books"
          className="mb-8 inline-flex items-center gap-2 font-medium text-[#183f32] hover:text-[#c18b45]"
        >
          <ArrowLeft size={18} />
          Back to All Books
        </Link>

        <div className="grid gap-10 rounded-3xl border border-[#e8e5dc] bg-white p-6 shadow-sm md:grid-cols-2 md:p-10">
          {/* Book Image */}
          <div className="relative flex min-h-[350px] items-center justify-center overflow-hidden rounded-2xl bg-[#f3f0e8] p-5">
            {book.image ? (
              <Image
                src={book.image.trim()}
                alt={book.title}
                width={400}
                height={550}
                unoptimized
                className="max-h-[480px] w-auto rounded-xl object-contain"
              />
            ) : (
              <BookOpen size={80} className="text-[#183f32]" />
            )}
          </div>

          {/* Book Information */}
          <div className="flex flex-col justify-center">
            <span className="w-fit rounded-full bg-[#f3eadb] px-4 py-1.5 text-sm font-semibold text-[#986d32]">
              {book.category}
            </span>

            <h1 className="mt-5 text-3xl font-bold leading-tight text-[#183f32] md:text-4xl">
              {book.title}
            </h1>

            <p className="mt-4 flex items-center gap-2 text-gray-600">
              <UserRound size={18} />
              By {book.author}
            </p>

            {/* Copies Information */}
            <div className="mt-6 grid grid-cols-2 gap-4">
              <div className="rounded-xl bg-[#faf9f6] p-4">
                <p className="text-sm text-gray-500">Total Copies</p>
                <p className="mt-1 text-2xl font-bold text-[#183f32]">
                  {book.totalCopies}
                </p>
              </div>

              <div className="rounded-xl bg-[#faf9f6] p-4">
                <p className="text-sm text-gray-500">Available Copies</p>
                <p className="mt-1 text-2xl font-bold text-[#183f32]">
                  {book.availableCopies}
                </p>
              </div>
            </div>

            {/* Description */}
            <div className="mt-7">
              <h2 className="text-lg font-bold text-[#183f32]">
                About This Book
              </h2>

              <p className="mt-2 whitespace-pre-line leading-7 text-gray-600">
                {book.description || "No description available."}
              </p>
            </div>

            {/* Borrow Button */}
            <button
              onClick={() => {
                if (!session?.user) {
                  toast.error("Please login to borrow this book");
                  return;
                }

                if (hasBorrowed) {
                  toast.info("You have already borrowed this book");
                  return;
                }

                if (isUnavailable) {
                  toast.error("No copies available");
                  return;
                }

                setModalOpen(true);
              }}
              disabled={borrowDisabled}
              className={`mt-8 w-full rounded-xl px-6 py-3.5 font-semibold text-white transition disabled:cursor-not-allowed ${
                hasBorrowed
                  ? "bg-gray-400"
                  : isUnavailable
                    ? "bg-gray-400"
                    : "bg-[#183f32] hover:bg-[#245c47]"
              }`}
            >
              {hasBorrowed
                ? "Already Borrowed ✓"
                : isUnavailable
                  ? "Currently Unavailable"
                  : "Borrow This Book"}
            </button>

            {hasBorrowed && (
              <p className="mt-3 text-center text-sm font-medium text-green-700">
                You have already borrowed this book. Please return it before
                borrowing again.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Borrow Modal */}
      <BorrowModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        book={book}
        onBorrowSuccess={async () => {
          await fetchBook();
          await checkBorrowStatus();
        }}
      />
    </main>
  );
}

// Dynamic Route with Suspense
export default function BookDetailsPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[70vh] items-center justify-center bg-[#faf9f6]">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#183f32] border-t-transparent" />
        </div>
      }
    >
      <BookDetailsContent />
    </Suspense>
  );
}
