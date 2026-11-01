"use client";

import { Suspense, useCallback, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowUpRight,
  BookOpen,
  CheckCircle2,
  Library,
  ShieldCheck,
  Sparkles,
  UserRound,
} from "lucide-react";

import BorrowModal from "@/components/borrow/BorrowModal";
import { authClient, getJWTToken } from "@/lib/auth-client";
import { toast } from "sonner";

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

  // Initial Book Fetch
  useEffect(() => {
    if (!id) return;

    queueMicrotask(() => void fetchBook());
  }, [id, fetchBook]);

  // Check Borrow Status
  useEffect(() => {
    let cancelled = false;

    const checkStatus = async () => {
      // Wait until authentication status is resolved
      if (isPending) return;

      try {
        if (!session?.user?.email) {
          if (!cancelled) {
            setHasBorrowed(false);
            setCheckingBorrow(false);
          }
          return;
        }

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
          throw new Error(data.message || "Failed to check borrow status");
        }

        const borrows: Borrow[] = Array.isArray(data) ? data : [];

        const alreadyBorrowed = borrows.some(
          (borrow) => borrow.bookId === id && borrow.status === "borrowed",
        );

        if (!cancelled) {
          setHasBorrowed(alreadyBorrowed);
        }
      } catch (error) {
        if (!cancelled) {
          setHasBorrowed(false);

          toast.error(
            error instanceof Error
              ? error.message
              : "Failed to check borrow status",
          );
        }
      } finally {
        if (!cancelled) {
          setCheckingBorrow(false);
        }
      }
    };

    void checkStatus();

    return () => {
      cancelled = true;
    };
  }, [id, session?.user?.email, isPending]);

  // Loading State
  if (loading || isPending || checkingBorrow) {
    return (
      <div className="flex min-h-[75vh] items-center justify-center bg-[#faf9f6]">
        <div className="flex flex-col items-center gap-4">
          <div className="relative flex h-14 w-14 items-center justify-center">
            <div className="absolute inset-0 animate-spin rounded-full border-[3px] border-[#e8e2d5] border-t-[#183f32]" />
            <BookOpen size={22} className="text-[#183f32]" />
          </div>

          <p className="text-sm font-medium tracking-wide text-[#77796f]">
            Preparing your reading experience...
          </p>
        </div>
      </div>
    );
  }

  // Book Not Found
  if (!book) {
    return (
      <main className="flex min-h-[75vh] flex-col items-center justify-center bg-[#faf9f6] px-5 text-center">
        <div className="flex h-24 w-24 items-center justify-center rounded-full bg-[#183f32]/10">
          <BookOpen size={42} className="text-[#183f32]" />
        </div>

        <h1 className="mt-6 font-serif text-3xl font-bold text-[#183f32]">
          Book Not Found
        </h1>

        <p className="mt-3 max-w-sm text-sm leading-7 text-[#77796f]">
          Sorry, we could not find the book you are looking for.
        </p>

        <Link
          href="/books"
          className="mt-7 inline-flex items-center gap-2 rounded-full bg-[#183f32] px-7 py-3.5 text-sm font-semibold text-white transition-all hover:bg-[#245c47]"
        >
          <ArrowLeft size={17} />
          Back to All Books
        </Link>
      </main>
    );
  }

  const isUnavailable = book.availableCopies <= 0;
  const borrowDisabled = isUnavailable || hasBorrowed;

  return (
    <main className="min-h-screen overflow-hidden bg-[#faf9f6]">
      {/* Decorative Background */}
      <div className="pointer-events-none absolute left-0 top-40 -z-0 h-72 w-72 rounded-full bg-[#183f32]/[0.035] blur-[100px]" />
      <div className="pointer-events-none absolute right-0 top-[500px] -z-0 h-72 w-72 rounded-full bg-[#b58749]/[0.07] blur-[100px]" />

      <div className="relative z-10 mx-auto max-w-7xl px-5 py-10 md:px-8 md:py-14 lg:px-12">
        {/* Breadcrumb */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-9 flex flex-wrap items-center justify-between gap-4"
        >
          <Link
            href="/books"
            className="group inline-flex items-center gap-2.5 text-sm font-semibold text-[#59675d] transition-colors hover:text-[#b58749]"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-full border border-[#e6e1d6] bg-white transition-all group-hover:border-[#b58749] group-hover:bg-[#183f32] group-hover:text-white">
              <ArrowLeft size={16} />
            </span>
            Back to All Books
          </Link>

          <div className="flex items-center gap-2 text-[10px] font-bold tracking-[2px] text-[#a09b8e]">
            <span>BOOKNOOK</span>
            <span className="text-[#b58749]">/</span>
            <span className="text-[#183f32]">BOOK DETAILS</span>
          </div>
        </motion.div>

        {/* Main Book Section */}
        <div className="grid items-start gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          {/* Book Cover */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="relative"
          >
            <div className="relative overflow-hidden rounded-[30px] border border-[#e9e4da] bg-[#f1eee5] p-6 shadow-[0_20px_70px_rgba(24,63,50,0.07)] sm:p-10">
              <div className="absolute left-0 top-0 h-40 w-40 rounded-full bg-[#b58749]/10 blur-[70px]" />
              <div className="absolute bottom-0 right-0 h-40 w-40 rounded-full bg-[#183f32]/10 blur-[70px]" />

              <div className="relative flex min-h-[430px] items-center justify-center sm:min-h-[540px]">
                {book.image ? (
                  <motion.div
                    whileHover={{
                      rotateY: -5,
                      rotateX: 2,
                      scale: 1.025,
                    }}
                    transition={{ duration: 0.4 }}
                    className="relative"
                    style={{ perspective: "1000px" }}
                  >
                    <div className="absolute -right-3 top-2 h-[98%] w-3 rounded-r-md bg-[#d2c9b6] shadow-md" />

                    <div className="absolute -right-1.5 top-1 h-[99%] w-2 rounded-r-md bg-[#e8e0d1]" />

                    <Image
                      src={book.image}
                      alt={book.title}
                      width={420}
                      height={580}
                      unoptimized
                      priority
                      className="relative z-10 max-h-[510px] w-auto max-w-full rounded-sm object-contain shadow-[12px_15px_30px_rgba(0,0,0,0.22)]"
                    />
                  </motion.div>
                ) : (
                  <div className="flex h-[400px] w-[280px] flex-col items-center justify-center rounded-xl border border-[#d9d1c1] bg-[#183f32] text-center text-[#e5c995] shadow-2xl">
                    <BookOpen size={70} strokeWidth={1.2} />
                    <p className="mt-5 font-serif text-2xl font-bold">
                      BookNook
                    </p>
                    <p className="mt-2 text-[10px] tracking-[3px]">
                      YOUR LITTLE LIBRARY
                    </p>
                  </div>
                )}
              </div>

              {/* Edition Label */}
              <div className="relative mt-5 flex items-center justify-center gap-2 text-[10px] font-bold tracking-[3px] text-[#8b806d]">
                <Sparkles size={13} className="text-[#b58749]" />
                BOOKNOOK COLLECTION
                <Sparkles size={13} className="text-[#b58749]" />
              </div>
            </div>

            {/* Bottom Decorative Label */}
            <div className="mt-5 flex items-center justify-center gap-3 text-xs text-[#858276]">
              <ShieldCheck size={16} className="text-[#b58749]" />
              <span>Discover. Read. Experience.</span>
            </div>
          </motion.div>

          {/* Book Information */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.15, ease: "easeOut" }}
            className="flex flex-col py-2 lg:py-8"
          >
            {/* Category and Availability */}
            <div className="flex flex-wrap items-center gap-3">
              <span className="rounded-full border border-[#b58749]/25 bg-[#b58749]/10 px-4 py-2 text-[11px] font-bold uppercase tracking-[1.5px] text-[#986d32]">
                {book.category}
              </span>

              <span
                className={`inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-[11px] font-bold ${
                  isUnavailable
                    ? "bg-red-50 text-red-600"
                    : "bg-emerald-50 text-emerald-700"
                }`}
              >
                <span
                  className={`h-1.5 w-1.5 rounded-full ${
                    isUnavailable ? "bg-red-500" : "bg-emerald-500"
                  }`}
                />
                {isUnavailable ? "Currently Unavailable" : "Available Now"}
              </span>
            </div>

            {/* Title */}
            <div className="mt-7">
              <p className="mb-3 text-[10px] font-bold tracking-[3px] text-[#b58749]">
                A BOOK WORTH DISCOVERING
              </p>

              <h1 className="font-serif text-4xl font-bold leading-[1.15] tracking-tight text-[#183f32] sm:text-5xl lg:text-[54px]">
                {book.title}
              </h1>
            </div>

            {/* Author */}
            <div className="mt-6 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#183f32] text-[#e5c995]">
                <UserRound size={20} />
              </div>

              <div>
                <p className="text-[10px] font-bold uppercase tracking-[1.5px] text-[#a09b8e]">
                  Written By
                </p>
                <p className="mt-0.5 font-semibold text-[#46574b]">
                  {book.author}
                </p>
              </div>
            </div>

            {/* Divider */}
            <div className="my-8 h-px w-full bg-gradient-to-r from-[#b58749]/60 via-[#e9e4da] to-transparent" />

            {/* Copies Information */}
            <div>
              <div className="mb-4 flex items-center justify-between">
                <h2 className="font-serif text-xl font-bold text-[#183f32]">
                  Library Availability
                </h2>
                <Library size={19} className="text-[#b58749]" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="group rounded-2xl border border-[#e9e4da] bg-white p-5 transition-all duration-300 hover:-translate-y-1 hover:border-[#b58749]/50 hover:shadow-lg">
                  <p className="text-[10px] font-bold uppercase tracking-[1.5px] text-[#999487]">
                    Total Copies
                  </p>
                  <p className="mt-3 font-serif text-4xl font-bold text-[#183f32]">
                    {book.totalCopies}
                  </p>
                  <p className="mt-1 text-xs text-[#8a887e]">
                    In our collection
                  </p>
                </div>

                <div className="group rounded-2xl border border-[#b58749]/25 bg-[#f8f4eb] p-5 transition-all duration-300 hover:-translate-y-1 hover:border-[#b58749]/60 hover:shadow-lg">
                  <p className="text-[10px] font-bold uppercase tracking-[1.5px] text-[#987344]">
                    Available Copies
                  </p>
                  <p className="mt-3 font-serif text-4xl font-bold text-[#183f32]">
                    {book.availableCopies}
                  </p>
                  <p className="mt-1 text-xs text-[#8a887e]">Ready to borrow</p>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="mt-8">
              <div className="flex items-center gap-2">
                <span className="h-5 w-1 rounded-full bg-[#b58749]" />
                <h2 className="font-serif text-xl font-bold text-[#183f32]">
                  About This Book
                </h2>
              </div>

              <p className="mt-4 whitespace-pre-line text-[14px] leading-8 text-[#73756c]">
                {book.description || "No description available."}
              </p>
            </div>

            {/* Borrow Button */}
            <div className="mt-9">
              <button
                type="button"
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
                className={`group flex w-full items-center justify-center gap-3 rounded-2xl px-6 py-4 text-sm font-bold transition-all duration-300 ${
                  borrowDisabled
                    ? "cursor-not-allowed bg-gray-300 text-gray-600"
                    : "bg-[#183f32] text-white shadow-[0_10px_25px_rgba(24,63,50,0.18)] hover:-translate-y-1 hover:bg-[#245c47] hover:shadow-[0_15px_30px_rgba(24,63,50,0.22)]"
                }`}
              >
                {hasBorrowed ? (
                  <>
                    <CheckCircle2 size={19} />
                    Already Borrowed
                  </>
                ) : isUnavailable ? (
                  <>
                    <BookOpen size={19} />
                    Currently Unavailable
                  </>
                ) : (
                  <>
                    <BookOpen size={19} />
                    Borrow This Book
                    <ArrowUpRight
                      size={18}
                      className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1"
                    />
                  </>
                )}
              </button>

              {hasBorrowed && (
                <p className="mt-4 flex items-center justify-center gap-2 text-center text-xs font-medium text-emerald-700">
                  <CheckCircle2 size={15} />
                  You have already borrowed this book. Please return it before
                  borrowing again.
                </p>
              )}

              {!session?.user && !isUnavailable && (
                <p className="mt-4 text-center text-xs text-[#969184]">
                  Please login to borrow this book from our library.
                </p>
              )}
            </div>

            {/* Small Trust Information */}
            <div className="mt-7 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 border-t border-[#e9e4da] pt-6 text-[11px] font-medium text-[#858276]">
              <span className="flex items-center gap-2">
                <ShieldCheck size={15} className="text-[#b58749]" />
                Easy Borrowing
              </span>

              <span className="flex items-center gap-2">
                <Library size={15} className="text-[#b58749]" />
                Library Collection
              </span>
            </div>
          </motion.div>
        </div>

        {/* Bottom Back Link */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-16 border-t border-[#e9e4da] pt-8"
        >
          <Link
            href="/books"
            className="group inline-flex items-center gap-2 text-sm font-bold text-[#183f32] transition-colors hover:text-[#b58749]"
          >
            <ArrowLeft
              size={17}
              className="transition-transform group-hover:-translate-x-1"
            />
            Explore More Books
          </Link>
        </motion.div>
      </div>

      {/* Borrow Modal */}
      <BorrowModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        book={book}
        onBorrowSuccess={async () => {
          await fetchBook();
          // Refresh borrow status after successful borrowing
          const token = await getJWTToken();

          if (token) {
            try {
              const response = await fetch(`${API_URL}/borrows`, {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              });

              const data = await response.json();

              if (!response.ok) {
                throw new Error(
                  data.message || "Failed to refresh borrow status",
                );
              }

              const borrows: Borrow[] = Array.isArray(data) ? data : [];

              setHasBorrowed(
                borrows.some(
                  (borrow) =>
                    borrow.bookId === id && borrow.status === "borrowed",
                ),
              );
            } catch (error) {
              toast.error(
                error instanceof Error
                  ? error.message
                  : "Failed to refresh borrow status",
              );
            }
          }
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
        <div className="flex min-h-[75vh] items-center justify-center bg-[#faf9f6]">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#183f32] border-t-transparent" />
        </div>
      }
    >
      <BookDetailsContent />
    </Suspense>
  );
}
