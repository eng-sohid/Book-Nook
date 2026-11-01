"use client";

import Link from "next/link";
import { Suspense, useEffect, useMemo, useState } from "react";
import { BookOpen, Search, X } from "lucide-react";
import { getBooks } from "@/lib/api";

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

async function fetchBooks(): Promise<Book[]> {
  const data = await getBooks();
  return Array.isArray(data) ? data : [];
}

function BooksList() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Books");

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

  if (loading) {
    return (
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 lg:gap-6">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="h-80 animate-pulse rounded-2xl bg-white"
          />
        ))}
      </div>
    );
  }

  return (
    <>
      {/* Search Bar */}
      <div className="mx-auto mb-8 max-w-2xl">
        <div className="flex items-center gap-3 rounded-xl border border-[#eae7df] bg-white px-4 py-3 shadow-sm focus-within:border-[#183f32]">
          <Search size={20} className="shrink-0 text-gray-400" />

          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by book name or author..."
            className="w-full bg-transparent text-sm text-gray-700 outline-none placeholder:text-gray-400"
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
      <div className="mb-9 flex flex-wrap justify-center gap-3">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`rounded-full border px-5 py-2.5 text-xs font-bold transition ${
              selectedCategory === category
                ? "border-[#183f32] bg-[#183f32] text-white"
                : "border-[#eae7df] bg-white text-[#183f32] hover:border-[#183f32]"
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Books Count */}
      <div className="mb-7 flex items-center justify-between">
        <h2 className="text-lg font-bold text-[#183f32]">Our Collection</h2>

        <p className="text-sm text-gray-500">
          {filteredBooks.length} Books Found
        </p>
      </div>

      {/* Books */}
      {filteredBooks.length === 0 ? (
        <div className="rounded-xl bg-white px-5 py-16 text-center">
          <BookOpen className="mx-auto mb-4 text-[#b58749]" size={40} />

          <h3 className="text-xl font-bold text-[#183f32]">No Books Found</h3>

          <p className="mt-2 text-sm text-gray-500">
            Try another search or category.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 lg:gap-6">
          {filteredBooks.map((book) => (
            <article
              key={book._id}
              className="group overflow-hidden rounded-2xl border border-[#eae7df] bg-white transition duration-300 hover:-translate-y-2 hover:shadow-xl"
            >
              <div className="h-48 overflow-hidden bg-[#eeece5] sm:h-64">
                <img
                  src={book.image}
                  alt={book.title}
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                />
              </div>

              <div className="p-4 sm:p-5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#b58749]">
                  {book.category}
                </span>

                <h3 className="mt-2 line-clamp-1 text-sm font-bold text-[#183f32] sm:text-base">
                  {book.title}
                </h3>

                <p className="mt-2 line-clamp-1 text-xs text-gray-500">
                  By {book.author}
                </p>

                <p className="mt-2 text-xs text-gray-500">
                  Available Copies: {book.availableCopies ?? "N/A"}
                </p>

                <Link
                  href={`/books/${book._id}`}
                  className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-lg border border-[#183f32] py-2.5 text-xs font-bold text-[#183f32] transition hover:bg-[#183f32] hover:text-white"
                >
                  <BookOpen size={15} />
                  View Details
                </Link>
              </div>
            </article>
          ))}
        </div>
      )}
    </>
  );
}

function BooksFallback() {
  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 lg:gap-6">
      {Array.from({ length: 4 }).map((_, index) => (
        <div key={index} className="h-80 animate-pulse rounded-2xl bg-white" />
      ))}
    </div>
  );
}

export default function BooksPage() {
  return (
    <main className="min-h-screen bg-[#faf9f6] px-5 py-16 md:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 text-center">
          <p className="mb-3 text-xs font-bold tracking-[3px] text-[#b58749]">
            EXPLORE OUR COLLECTION
          </p>

          <h1 className="text-3xl font-bold text-[#183f32] md:text-5xl">
            All Books<span className="text-[#c18b45]">.</span>
          </h1>

          <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-gray-500">
            Explore our collection and discover your next favorite book.
          </p>
        </div>

        <Suspense fallback={<BooksFallback />}>
          <BooksList />
        </Suspense>
      </div>
    </main>
  );
}
