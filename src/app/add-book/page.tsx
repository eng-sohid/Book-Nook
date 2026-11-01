import BookForm from "@/components/books/BookForm";
import { toast } from "@/lib/toast";
import { BookPlus, Sparkles } from "lucide-react";

//toast massege
toast.success("Book added successfully!");
toast.error("Failed to add book. Please try again.");

export default function AddBookPage() {
  return (
    <main className="min-h-screen bg-[#faf9f6] px-5 py-12 md:py-16">
      <div className="mx-auto max-w-4xl">
        {/* Page Header */}
        <div className="mb-10 text-center">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#e9e4da] bg-white px-4 py-2 text-sm font-medium text-[#183f32] shadow-sm">
            <Sparkles size={15} className="text-[#b58749]" />
            <span>Grow Our Library</span>
          </div>

          <h1 className="text-3xl font-bold tracking-tight text-[#183f32] md:text-5xl">
            Add a New Book
          </h1>

          <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-gray-500 md:text-base">
            Share your favorite book with our community and help others discover
            their next great read.
          </p>

          <div className="mx-auto mt-7 flex items-center justify-center gap-2">
            <div className="h-px w-12 bg-[#d9c7a8]" />
            <BookPlus size={19} className="text-[#b58749]" />
            <div className="h-px w-12 bg-[#d9c7a8]" />
          </div>
        </div>

        {/* Form */}
        <BookForm />

        <p className="mt-7 text-center text-xs text-gray-400">
          Every book you share makes our reading community stronger.
        </p>
      </div>
    </main>
  );
}
