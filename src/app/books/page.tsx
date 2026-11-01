import Link from "next/link";
import { Suspense } from "react";
import { BookOpen } from "lucide-react";
import { getBooks } from "@/lib/api";

export const instant = false;

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

async function BooksList() {
  const data = await getBooks();
  const books: Book[] = Array.isArray(data) ? data : [];

  return (
    <>
      <div className="mb-7 flex items-center justify-between">
        <h2 className="text-lg font-bold text-[#183f32]">Our Collection</h2>

        <p className="text-sm text-gray-500">{books.length} Books Found</p>
      </div>

      {books.length === 0 ? (
        <div className="rounded-xl bg-white px-5 py-16 text-center">
          <BookOpen className="mx-auto mb-4 text-[#b58749]" size={40} />

          <h3 className="text-xl font-bold text-[#183f32]">
            No Books Available
          </h3>

          <p className="mt-2 text-sm text-gray-500">
            There are no books in our collection yet.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 lg:gap-6">
          {books.map((book) => (
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
