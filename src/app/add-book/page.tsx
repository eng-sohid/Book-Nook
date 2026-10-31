import BookForm from "@/components/books/BookForm";

export default function AddBookPage() {
  return (
    <main className="min-h-screen bg-[#faf9f6] px-5 py-12">
      <div className="mx-auto max-w-3xl">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-[#183f32]">Add a New Book</h1>

          <p className="mt-2 text-gray-600">
            Share your favorite book with our library community.
          </p>
        </div>

        <BookForm />
      </div>
    </main>
  );
}
