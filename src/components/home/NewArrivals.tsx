import Link from "next/link";
import { Suspense } from "react";
import { ArrowRight, BookOpen, Sparkles } from "lucide-react";
import { getBooks } from "@/lib/api";
import NewArrivalsClient from "./NewArrivalsClient";

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

  if (books.length === 0) {
    return (
      <div className="rounded-[28px] border border-[#e8e0d1] bg-white/60 px-6 py-20 text-center">
        <BookOpen size={38} className="mx-auto mb-4 text-[#b58749]" />
        <p className="text-lg font-semibold text-[#183f32]">
          No books available yet.
        </p>
        <p className="mt-2 text-sm text-[#858078]">
          New stories will appear here soon.
        </p>
      </div>
    );
  }

  return <NewArrivalsClient books={books} />;
}

function NewArrivalsFallback() {
  return (
    <div className="grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, index) => (
        <div
          key={index}
          className="h-[530px] animate-pulse rounded-[28px] bg-[#eae5d9]"
        />
      ))}
    </div>
  );
}

export default function NewArrivals() {
  return (
    <section className="relative isolate overflow-hidden bg-[#f3f0e7] px-5 py-24 md:px-8 lg:py-32">
      {/* Background decoration */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -left-40 top-20 h-[450px] w-[450px] rounded-full bg-[#d4b98c]/20 blur-[120px]" />
        <div className="absolute -right-40 bottom-0 h-[500px] w-[500px] rounded-full bg-[#a8b9a3]/20 blur-[130px]" />

        <div className="absolute right-[8%] top-20 hidden rotate-12 text-[180px] font-serif text-[#183f32]/[0.025] lg:block">
          B
        </div>

        <div className="absolute bottom-20 left-[5%] h-px w-40 bg-gradient-to-r from-transparent via-[#b58749]/40 to-transparent" />

        <div
          className="absolute inset-0 opacity-[0.13]"
          style={{
            backgroundImage:
              "radial-gradient(#a68a60 0.7px, transparent 0.7px)",
            backgroundSize: "22px 22px",
          }}
        />
      </div>

      <div className="relative mx-auto max-w-[1380px]">
        {/* Section heading */}
        <div className="mb-14 flex flex-col justify-between gap-8 lg:mb-20 lg:flex-row lg:items-end">
          <div className="max-w-2xl">
            <div className="mb-6 inline-flex items-center gap-3 rounded-full border border-[#b58749]/25 bg-white/50 px-4 py-2 backdrop-blur-sm">
              <Sparkles size={14} className="text-[#b58749]" />
              <span className="text-[10px] font-bold tracking-[3px] text-[#96703c]">
                FRESH FROM THE SHELF
              </span>
            </div>

            <h2 className="font-serif text-5xl font-bold leading-[1.08] tracking-[-2px] text-[#183f32] sm:text-6xl lg:text-7xl">
              New Arrivals
              <span className="text-[#b58749]">.</span>
            </h2>

            <p className="mt-6 max-w-xl text-sm leading-8 text-[#77766e] sm:text-base">
              Every great book opens a new world. Discover our latest
              collection, find your next favourite story, and let every page
              take you somewhere new.
            </p>
          </div>

          <Link
            href="/books"
            className="group inline-flex w-fit items-center gap-4 rounded-full border border-[#183f32]/20 bg-white/50 px-6 py-4 text-sm font-bold text-[#183f32] shadow-sm backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#183f32] hover:bg-[#183f32] hover:text-white"
          >
            Explore Collection
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#183f32]/10 transition-colors group-hover:bg-white/15">
              <ArrowRight
                size={17}
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </span>
          </Link>
        </div>

        {/* Books */}
        <Suspense fallback={<NewArrivalsFallback />}>
          <NewArrivalsContent />
        </Suspense>

        {/* Bottom CTA */}
        <div className="relative mt-20 overflow-hidden rounded-[30px] bg-[#183f32] px-7 py-12 text-center shadow-[0_25px_70px_rgba(24,63,50,0.15)] sm:px-12">
          <div className="pointer-events-none absolute -right-16 -top-24 h-64 w-64 rounded-full border border-white/[0.08]" />
          <div className="pointer-events-none absolute -right-8 -top-16 h-48 w-48 rounded-full border border-white/[0.08]" />
          <div className="pointer-events-none absolute -bottom-32 -left-16 h-64 w-64 rounded-full bg-[#b58749]/10 blur-3xl" />

          <div className="relative">
            <span className="mb-5 inline-flex items-center gap-2 text-[10px] font-bold tracking-[3px] text-[#d7bd91]">
              <Sparkles size={13} />
              YOUR NEXT CHAPTER STARTS HERE
            </span>

            <h3 className="font-serif text-3xl font-bold text-white sm:text-4xl">
              There Is Always Another Story.
            </h3>

            <p className="mx-auto mt-4 max-w-lg text-sm leading-7 text-white/60">
              Explore our complete library and find the perfect book for your
              next reading adventure.
            </p>

            <Link
              href="/books"
              className="group mt-8 inline-flex items-center gap-3 rounded-full bg-[#d7bd91] px-8 py-4 text-sm font-bold text-[#183f32] transition-all duration-300 hover:-translate-y-1 hover:bg-white hover:shadow-xl"
            >
              Explore All Books
              <ArrowRight
                size={18}
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
