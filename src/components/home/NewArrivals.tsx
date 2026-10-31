import Link from "next/link";
import { Suspense } from "react";
import { ArrowRight, BookOpen } from "lucide-react";
import { getBooks } from "@/lib/api";

interface Book {
  _id: string;
  title: string;
  author: string;
  category: string;
  image: string;
}

async function NewArrivalsContent() {
  const data = await getBooks();
  const books: Book[] = Array.isArray(data) ? data.slice(0, 6) : [];

  return (
    <>
      {books.length === 0 ? (
        <p className="py-10 text-center text-gray-500">
          No books available yet.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
          {books.map((book) => (
            <article
              key={book._id}
              className="group overflow-hidden rounded-2xl border border-[#eae7df] bg-white transition duration-300 hover:-translate-y-2 hover:shadow-xl"
            >
              <div className="relative h-48 overflow-hidden bg-[#eeece5] sm:h-64">
                <img
                  src={book.image}
                  alt={book.title}
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                />

                <span className="absolute left-3 top-3 rounded-full bg-[#183f32] px-3 py-1 text-[10px] font-semibold text-white">
                  NEW
                </span>
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

function NewArrivalsFallback() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
      {Array.from({ length: 3 }).map((_, index) => (
        <div
          key={index}
          className="h-80 animate-pulse rounded-2xl bg-[#eeece5]"
        />
      ))}
    </div>
  );
}

export default function NewArrivals() {
  return (
    <section className="bg-[#faf9f6] px-5 py-20 md:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 flex flex-wrap items-end justify-between gap-5">
          <div>
            <p className="mb-3 text-xs font-bold tracking-[3px] text-[#b58749]">
              FRESH FROM THE SHELF
            </p>

            <h2 className="text-3xl font-bold tracking-tight text-[#183f32] md:text-4xl">
              New Arrivals<span className="text-[#c18b45]">.</span>
            </h2>

            <p className="mt-3 max-w-lg text-sm leading-7 text-gray-500">
              Discover the latest additions to our collection and find your next
              favorite story.
            </p>
          </div>

          <Link
            href="/books"
            className="group inline-flex items-center gap-2 text-sm font-bold text-[#183f32] transition hover:text-[#b58749]"
          >
            See All Books
            <ArrowRight
              size={18}
              className="transition group-hover:translate-x-1"
            />
          </Link>
        </div>

        <Suspense fallback={<NewArrivalsFallback />}>
          <NewArrivalsContent />
        </Suspense>

        <div className="mt-12 text-center">
          <Link
            href="/books"
            className="inline-flex items-center gap-2 rounded-xl bg-[#183f32] px-7 py-3.5 text-sm font-semibold text-white transition hover:bg-[#245c47]"
          >
            Explore All Books
            <ArrowRight size={17} />
          </Link>
        </div>
      </div>
    </section>
  );
}
