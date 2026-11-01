import BorrowTable from "@/components/borrow/BorrowTable";
import { toast } from "@/lib/toast";
import { BookOpen, Sparkles } from "lucide-react";

toast.success("Book returned successfully!");
toast.error("Failed to return the book.");

export default function MyBorrowsPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#faf9f6] px-5 py-16 md:py-20">
      {/* Background Decoration */}
      <div className="pointer-events-none absolute -left-32 top-20 h-80 w-80 rounded-full bg-[#183f32]/[0.05] blur-[100px]" />
      <div className="pointer-events-none absolute -right-32 bottom-20 h-80 w-80 rounded-full bg-[#b58749]/[0.08] blur-[100px]" />

      <div className="relative mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-10">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#b58749]/25 bg-[#b58749]/10 px-4 py-2 text-[11px] font-bold tracking-[2px] text-[#986d32]">
            <Sparkles size={14} />
            YOUR READING JOURNEY
          </div>

          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
            <div>
              <h1 className="font-serif text-4xl font-bold tracking-tight text-[#183f32] sm:text-5xl">
                My Borrows
              </h1>

              <p className="mt-3 max-w-xl text-sm leading-7 text-[#77796f] sm:text-base">
                Keep track of your borrowed books and manage your reading
                journey. Return your books on time and discover more stories.
              </p>
            </div>

            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#183f32] text-[#e5c995] shadow-lg shadow-[#183f32]/15">
              <BookOpen size={27} strokeWidth={1.6} />
            </div>
          </div>
        </div>

        {/* Borrow Table */}
        <BorrowTable />
      </div>
    </main>
  );
}
