"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { BookOpen, Search, X, Sparkles, ArrowUpRight } from "lucide-react";
import { getBooks } from "@/lib/api";
import { toast } from "@/lib/toast";

interface Book {
  _id: string;
  title: string;
  author: string;
  category: string;
  image: string;
  description?: string;
  totalCopies?: number;
  availableCopies?: number;
}

const categories = [
  "All Books",
  "Fiction",
  "Science",
  "History",
  "Kids",
  "Others",
];

const mainCategories = ["fiction", "science", "history", "kids"];

//toast massege
toast.error("Failed to load books.");

async function fetchBooks(): Promise<Book[]> {
  const data = await getBooks();
  return Array.isArray(data) ? data : [];
}

function BooksList() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const categoryFromUrl = searchParams.get("category");

  const selectedCategory =
    categories.find(
      (category) =>
        category.toLowerCase() === categoryFromUrl?.trim().toLowerCase(),
    ) || "All Books";

  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  // Fetch Books
  useEffect(() => {
    let cancelled = false;

    async function loadBooks() {
      try {
        const data = await fetchBooks();

        if (!cancelled) {
          setBooks(data);
        }
      } catch (error) {
        console.error("Failed to fetch books:", error);
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void loadBooks();

    return () => {
      cancelled = true;
    };
  }, []);

  // Category Filter
  const handleCategoryChange = (category: string) => {
    if (category === "All Books") {
      router.push("/books");
    } else {
      router.push(`/books?category=${encodeURIComponent(category)}`);
    }
  };

  // Search and Category Filtering
  const filteredBooks = useMemo(() => {
    return books.filter((book) => {
      const category = book.category?.trim().toLowerCase() || "";
      const searchText = search.trim().toLowerCase();

      const matchesSearch =
        book.title.toLowerCase().includes(searchText) ||
        book.author.toLowerCase().includes(searchText);

      let matchesCategory = true;

      if (selectedCategory === "Others") {
        matchesCategory = !mainCategories.includes(category);
      } else if (selectedCategory !== "All Books") {
        matchesCategory = category === selectedCategory.toLowerCase();
      }

      return matchesSearch && matchesCategory;
    });
  }, [books, search, selectedCategory]);

  // Loading State
  if (loading) {
    return (
      <div className="grid grid-cols-2 gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 lg:gap-8">
        {Array.from({ length: 8 }).map((_, index) => (
          <div key={index} className="animate-pulse">
            <div className="h-[250px] rounded-xl bg-[#e9e5da] sm:h-[340px]" />
            <div className="mt-4 h-4 w-3/4 rounded bg-[#e9e5da]" />
            <div className="mt-3 h-3 w-1/2 rounded bg-[#e9e5da]" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <>
      {/* Search Bar */}
      <div className="mx-auto mb-9 max-w-2xl">
        <div className="group flex items-center gap-3 rounded-2xl border border-[#e8e2d5] bg-white px-5 py-4 shadow-[0_8px_30px_rgba(24,63,50,0.04)] transition-all duration-300 focus-within:border-[#183f32] focus-within:shadow-[0_8px_30px_rgba(24,63,50,0.10)]">
          <Search size={20} className="shrink-0 text-[#a58b60]" />

          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by book name or author..."
            className="w-full bg-transparent text-sm text-[#183f32] outline-none placeholder:text-gray-400"
          />

          {search && (
            <button
              onClick={() => setSearch("")}
              aria-label="Clear search"
              className="text-gray-400 transition hover:text-[#183f32]"
            >
              <X size={18} />
            </button>
          )}
        </div>
      </div>

      {/* Category Filter */}
      <div className="mb-12 flex flex-wrap justify-center gap-2.5 sm:gap-3">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => handleCategoryChange(category)}
            className={`rounded-full border px-5 py-2.5 text-xs font-bold transition-all duration-300 ${
              selectedCategory === category
                ? "border-[#183f32] bg-[#183f32] text-white shadow-lg shadow-[#183f32]/15"
                : "border-[#e8e2d5] bg-white text-[#183f32] hover:border-[#b58749] hover:bg-[#fffaf0]"
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Books Count */}
      <div className="mb-8 flex flex-wrap items-center justify-between gap-3 border-b border-[#e9e4da] pb-5">
        <div>
          <p className="mb-1 text-[10px] font-bold uppercase tracking-[3px] text-[#b58749]">
            BOOKNOOK LIBRARY
          </p>

          <h2 className="font-serif text-xl font-bold text-[#183f32] sm:text-2xl">
            {selectedCategory === "All Books"
              ? "Our Collection"
              : `${selectedCategory} Books`}
            <span className="text-[#b58749]">.</span>
          </h2>
        </div>

        <div className="rounded-full border border-[#e8e2d5] bg-white px-4 py-2">
          <p className="text-xs font-semibold text-[#183f32]">
            <span className="text-[#b58749]">{filteredBooks.length}</span> Books
            Found
          </p>
        </div>
      </div>

      {/* Books Collection */}
      {filteredBooks.length === 0 ? (
        <div className="rounded-3xl border border-[#e9e4da] bg-white px-5 py-20 text-center shadow-sm">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-[#f6f0e3]">
            <BookOpen className="text-[#b58749]" size={30} />
          </div>

          <h3 className="font-serif text-2xl font-bold text-[#183f32]">
            No Books Found
          </h3>

          <p className="mt-3 text-sm text-gray-500">
            Try another search or category to discover more books.
          </p>

          <button
            onClick={() => {
              setSearch("");
              router.push("/books");
            }}
            className="mt-6 rounded-xl bg-[#183f32] px-6 py-3 text-xs font-bold text-white transition hover:bg-[#102b23]"
          >
            Explore All Books
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-2 sm:gap-x-7 md:grid-cols-3 lg:grid-cols-4 lg:gap-x-8 lg:gap-y-14">
          {filteredBooks.map((book, index) => (
            <motion.article
              key={book._id}
              initial={{ opacity: 0, y: 35 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.5,
                delay: Math.min(index * 0.06, 0.4),
              }}
              className="group min-w-0"
            >
              <Link
                href={`/books/${book._id}`}
                aria-label={`View details of ${book.title}`}
                className="block outline-none"
              >
                {/* 3D Book Scene */}
                <div className="relative flex h-[250px] items-center justify-center [perspective:1000px] sm:h-[340px]">
                  {/* Book Shadow */}
                  <div className="absolute bottom-5 left-1/2 h-6 w-[65%] -translate-x-1/2 rounded-full bg-[#183f32]/20 blur-xl transition-all duration-500 group-hover:w-[80%] group-hover:bg-[#183f32]/30" />

                  {/* Book */}
                  <motion.div
                    whileHover={{
                      y: -9,
                      rotateY: -7,
                      rotateZ: -1,
                      scale: 1.025,
                    }}
                    transition={{
                      type: "spring",
                      stiffness: 180,
                      damping: 18,
                    }}
                    className="relative z-10 h-[205px] w-[140px] [transform-style:preserve-3d] sm:h-[280px] sm:w-[190px]"
                  >
                    {/* Page Edge */}
                    <div className="absolute -right-[9px] top-[5px] h-[calc(100%-10px)] w-[11px] overflow-hidden rounded-r-sm border-y border-r border-[#c9bfa9] bg-[#eee5d4] shadow-[3px_3px_7px_rgba(0,0,0,0.12)] sm:-right-[12px] sm:w-[14px]">
                      <div className="absolute inset-0 bg-[repeating-linear-gradient(to_bottom,#d7ccb7_0px,#fffaf0_2px,#d7ccb7_3px)]" />
                    </div>

                    {/* Book Spine */}
                    <div className="absolute -left-[9px] top-0 h-full w-[12px] rounded-l-sm bg-[#102b23] shadow-[-4px_4px_10px_rgba(0,0,0,0.18)] sm:-left-[12px] sm:w-[16px]" />

                    {/* Front Cover */}
                    <div className="relative h-full w-full overflow-hidden rounded-[2px_5px_5px_2px] border border-white/20 bg-[#183f32] shadow-[7px_10px_20px_rgba(0,0,0,0.24)]">
                      <img
                        src={book.image}
                        alt={book.title}
                        className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />

                      {/* Dark Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-[#102b23]/90 via-[#102b23]/15 to-black/10" />

                      {/* Premium Border */}
                      <div className="pointer-events-none absolute inset-[5px] border border-white/25 sm:inset-[8px]" />

                      <div className="pointer-events-none absolute inset-[10px] border border-[#e5c995]/60 sm:inset-[15px]" />

                      {/* Cover Content */}
                      <div className="absolute inset-0 flex flex-col items-center justify-between px-3 py-4 text-center sm:px-5 sm:py-6">
                        <div>
                          <p className="text-[6px] font-bold tracking-[2px] text-[#f1d8a9] sm:text-[9px] sm:tracking-[3px]">
                            BOOKNOOK EDITION
                          </p>

                          <div className="mx-auto mt-2 h-px w-8 bg-[#e5c995] sm:w-12" />
                        </div>

                        <div className="flex w-full flex-col items-center">
                          <Sparkles
                            size={17}
                            className="mb-2 text-[#f1d8a9] sm:mb-4 sm:size-6"
                          />

                          <h3 className="line-clamp-3 font-serif text-sm font-bold leading-tight text-white drop-shadow-lg sm:text-2xl">
                            {book.title}
                          </h3>

                          <div className="mt-2 h-px w-8 bg-[#e5c995] sm:mt-4 sm:w-14" />

                          <p className="mt-2 line-clamp-1 text-[8px] text-white/85 sm:mt-4 sm:text-xs">
                            {book.author}
                          </p>
                        </div>

                        <div>
                          <span className="inline-block max-w-full truncate rounded-full border border-[#e5c995]/60 px-2 py-1 text-[6px] font-bold uppercase tracking-wider text-[#f1d8a9] sm:px-3 sm:py-1.5 sm:text-[8px] sm:tracking-[2px]">
                            {book.category}
                          </span>

                          <p className="mt-2 text-[5px] font-bold tracking-[2px] text-white/70 sm:mt-3 sm:text-[8px] sm:tracking-[3px]">
                            A STORY TO REMEMBER
                          </p>
                        </div>
                      </div>

                      {/* Shine */}
                      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent opacity-60" />
                    </div>
                  </motion.div>

                  {/* Premium Badge */}
                  <div className="absolute right-[5%] top-3 z-20 flex rotate-6 items-center gap-1 rounded-full border border-[#d6c19a] bg-[#fffaf0] px-2 py-1.5 text-[7px] font-bold tracking-wider text-[#183f32] shadow-lg transition-transform duration-500 group-hover:rotate-0 sm:right-[8%] sm:top-5 sm:px-3 sm:py-2 sm:text-[9px]">
                    <Sparkles size={10} className="text-[#b58749] sm:size-3" />
                    PREMIUM
                  </div>

                  {/* Hover Details */}
                  <div className="absolute bottom-1 left-1/2 z-20 flex -translate-x-1/2 translate-y-3 items-center gap-1 whitespace-nowrap rounded-full bg-[#183f32] px-3 py-2 text-[8px] font-bold text-white opacity-0 shadow-lg transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 sm:px-4 sm:py-2.5 sm:text-[10px]">
                    View Book Details
                    <ArrowUpRight size={13} />
                  </div>
                </div>

                {/* Book Information */}
                <div className="mt-3 px-1 text-center sm:mt-5">
                  <p className="mb-1.5 text-[8px] font-bold uppercase tracking-[2px] text-[#b58749] sm:mb-2 sm:text-[9px] sm:tracking-[3px]">
                    {book.category}
                  </p>

                  <h3 className="line-clamp-2 min-h-[36px] font-serif text-sm font-bold leading-snug text-[#183f32] transition-colors duration-300 group-hover:text-[#a8793f] sm:min-h-0 sm:text-lg">
                    {book.title}
                  </h3>

                  <p className="mt-1.5 line-clamp-1 text-[10px] text-[#858078] sm:mt-2 sm:text-xs">
                    By {book.author}
                  </p>

                  <div className="mt-2 flex items-center justify-center gap-1.5 text-[9px] font-medium text-[#858078] sm:mt-3 sm:text-[10px]">
                    Available Copies:
                    <span className="font-bold text-[#183f32]">
                      {book.availableCopies ?? "N/A"}
                    </span>
                  </div>

                  {/* Gold Divider */}
                  <div className="mx-auto mt-4 h-px w-10 bg-[#d9b779] transition-all duration-300 group-hover:w-20 sm:mt-5" />
                </div>
              </Link>
            </motion.article>
          ))}
        </div>
      )}
    </>
  );
}

function BooksFallback() {
  return (
    <div className="grid grid-cols-2 gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 lg:gap-8">
      {Array.from({ length: 8 }).map((_, index) => (
        <div key={index} className="animate-pulse">
          <div className="h-[250px] rounded-xl bg-[#e9e5da] sm:h-[340px]" />
          <div className="mt-4 h-4 w-3/4 rounded bg-[#e9e5da]" />
          <div className="mt-3 h-3 w-1/2 rounded bg-[#e9e5da]" />
        </div>
      ))}
    </div>
  );
}

export default function BooksPage() {
  return (
    <main className="min-h-screen bg-[#faf9f6] px-5 py-16 md:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Page Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12 text-center"
        >
          <p className="mb-3 text-[10px] font-bold tracking-[4px] text-[#b58749] sm:text-xs">
            EXPLORE OUR COLLECTION
          </p>

          <h1 className="font-serif text-3xl font-bold text-[#183f32] sm:text-4xl md:text-5xl">
            All Books<span className="text-[#c18b45]">.</span>
          </h1>

          <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-gray-500">
            Explore our collection and discover your next favorite book.
          </p>

          <div className="mx-auto mt-6 flex items-center justify-center gap-2">
            <div className="h-px w-10 bg-[#d9b779]" />
            <BookOpen size={17} className="text-[#b58749]" />
            <div className="h-px w-10 bg-[#d9b779]" />
          </div>
        </motion.div>

        <Suspense fallback={<BooksFallback />}>
          <BooksList />
        </Suspense>
      </div>
    </main>
  );
}
