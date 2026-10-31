"use client";

import { useEffect, useState, type FormEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";

import { authClient } from "@/lib/auth-client";
import { getAuthHeaders } from "@/lib/auth-api";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const categories = ["Fiction", "Science", "History", "Kids", "Others"];

interface Book {
  _id: string;
  title: string;
  author: string;
  category: string;
  image: string;
  description: string;
  totalCopies: number;
  availableCopies: number;
  addedByName: string;
  addedByEmail: string;
  createdAt: string;
}

export default function MyBooksPage() {
  const { data: session, isPending } = authClient.useSession();

  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const [deletingBook, setDeletingBook] = useState<Book | null>(null);

  const [formData, setFormData] = useState({
    title: "",
    author: "",
    category: "",
    image: "",
    description: "",
    totalCopies: "1",
  });

  const userEmail = session?.user?.email;

  // Fetch user's books
  const fetchMyBooks = async (): Promise<Book[]> => {
    if (!API_URL || !userEmail) return [];

    const response = await fetch(`${API_URL}/books`);

    if (!response.ok) {
      throw new Error("Failed to fetch books");
    }

    const allBooks: Book[] = await response.json();

    return allBooks.filter(
      (book) => book.addedByEmail?.toLowerCase() === userEmail.toLowerCase(),
    );
  };

  useEffect(() => {
    if (isPending || !userEmail) return;

    let ignore = false;

    const loadBooks = async () => {
      try {
        const myBooks = await fetchMyBooks();

        if (!ignore) {
          setBooks(myBooks);
        }
      } catch (error) {
        console.error(error);

        if (!ignore) {
          toast.error("Failed to load your books");
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    };

    loadBooks();

    return () => {
      ignore = true;
    };
  }, [userEmail, isPending]);

  // Load books after authentication is ready
  useEffect(() => {
    if (isPending || !userEmail) return;

    fetchMyBooks();
  }, [userEmail, isPending]);

  // Open edit modal
  const openEditModal = (book: Book) => {
    setEditingBook(book);

    setFormData({
      title: book.title,
      author: book.author,
      category: book.category,
      image: book.image,
      description: book.description,
      totalCopies: String(book.totalCopies),
    });
  };

  // Close edit modal
  const closeEditModal = () => {
    setEditingBook(null);
  };

  // Handle form changes
  const handleFormChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Update book
  const handleUpdate = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!API_URL || !userEmail || !editingBook) return;

    setSaving(true);

    try {
      const headers = await getAuthHeaders();

      const response = await fetch(`${API_URL}/books/${editingBook._id}`, {
        method: "PATCH",
        headers,
        body: JSON.stringify({
          ...formData,
          title: formData.title.trim(),
          author: formData.author.trim(),
          image: formData.image.trim(),
          description: formData.description.trim(),
          totalCopies: Number(formData.totalCopies),
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to update book");
      }

      toast.success("Book updated successfully!");

      closeEditModal();

      // Updated books fetch করে state update
      const updatedBooks = await fetchMyBooks();
      setBooks(updatedBooks);
    } catch (error) {
      console.error(error);

      toast.error(
        error instanceof Error ? error.message : "Something went wrong",
      );
    } finally {
      setSaving(false);
    }
  };

  // Delete book
  const handleDelete = async () => {
    if (!API_URL || !userEmail || !deletingBook) return;

    setDeleting(true);

    try {
      const headers = await getAuthHeaders();

      const response = await fetch(`${API_URL}/books/${deletingBook._id}`, {
        method: "DELETE",
        headers,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to delete book");
      }

      setBooks((prev) => prev.filter((book) => book._id !== deletingBook._id));

      toast.success("Book deleted successfully!");

      setDeletingBook(null);
    } catch (error) {
      console.error(error);

      toast.error(
        error instanceof Error ? error.message : "Something went wrong",
      );
    } finally {
      setDeleting(false);
    }
  };

  // Loading state
  if (isPending || (userEmail && loading)) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#faf9f6]">
        <p className="font-medium text-[#183f32]">Loading your books...</p>
      </main>
    );
  }

  // Login required
  if (!userEmail) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#faf9f6] px-5">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-[#183f32]">Please Login</h2>

          <p className="mt-2 text-gray-600">Login to manage your books.</p>

          <Link
            href="/login"
            className="mt-5 inline-block rounded-lg bg-[#183f32] px-6 py-3 text-white"
          >
            Login
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#faf9f6] px-5 py-16">
      <div className="mx-auto max-w-7xl">
        {/* PAGE HEADER */}
        <div className="mb-10 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-3xl font-bold text-[#183f32]">My Books</h1>

            <p className="mt-2 text-gray-600">
              Manage the books you have added to BookNook.
            </p>
          </div>

          <Link
            href="/add-book"
            className="rounded-lg bg-[#183f32] px-5 py-3 text-center text-sm font-semibold text-white transition hover:bg-[#245c47]"
          >
            + Add New Book
          </Link>
        </div>

        {/* BOOK LIST */}
        {books.length === 0 ? (
          <div className="rounded-2xl border border-[#eae7df] bg-white px-6 py-16 text-center">
            <h2 className="text-xl font-bold text-[#183f32]">No Books Found</h2>

            <p className="mt-2 text-gray-600">
              You haven&apos;t added any books yet.
            </p>

            <Link
              href="/add-book"
              className="mt-6 inline-block rounded-lg bg-[#183f32] px-6 py-3 text-sm font-semibold text-white hover:bg-[#245c47]"
            >
              Add Your First Book
            </Link>
          </div>
        ) : (
          <>
            <p className="mb-5 text-sm font-medium text-gray-600">
              Total Books: {books.length}
            </p>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {books.map((book) => (
                <div
                  key={book._id}
                  className="overflow-hidden rounded-2xl border border-[#eae7df] bg-white shadow-sm"
                >
                  <div className="relative h-64 w-full bg-gray-100">
                    {book.image?.trim() ? (
                      <Image
                        src={book.image.trim()}
                        alt={book.title}
                        fill
                        unoptimized
                        className="object-contain p-4"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-gray-400">
                        No Image
                      </div>
                    )}
                  </div>

                  <div className="p-5">
                    <span className="rounded-full bg-[#f3eee5] px-3 py-1 text-xs font-semibold text-[#8b6537]">
                      {book.category}
                    </span>

                    <h2 className="mt-3 text-xl font-bold text-[#183f32]">
                      {book.title}
                    </h2>

                    <p className="mt-1 text-sm text-gray-600">
                      By {book.author}
                    </p>

                    <div className="mt-4 flex justify-between border-t border-gray-100 pt-4 text-sm">
                      <span className="text-gray-600">
                        Total: {book.totalCopies}
                      </span>

                      <span className="font-semibold text-[#183f32]">
                        Available: {book.availableCopies}
                      </span>
                    </div>

                    <div className="mt-5 grid grid-cols-2 gap-3">
                      <button
                        onClick={() => openEditModal(book)}
                        className="rounded-lg bg-[#183f32] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#245c47]"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() => setDeletingBook(book)}
                        className="rounded-lg border border-red-200 px-4 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-50"
                      >
                        Delete
                      </button>
                    </div>

                    <Link
                      href={`/books/${book._id}`}
                      className="mt-3 block text-center text-sm font-medium text-[#183f32] underline"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* EDIT MODAL */}
      {editingBook && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/50 p-4">
          <div className="my-auto w-full max-w-2xl rounded-2xl bg-white p-6 shadow-xl md:p-8">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-[#183f32]">Edit Book</h2>

              <button
                onClick={closeEditModal}
                className="text-2xl text-gray-500 hover:text-red-500"
                aria-label="Close edit modal"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleUpdate} className="space-y-5">
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-[#183f32]">
                    Book Title *
                  </label>

                  <input
                    name="title"
                    value={formData.title}
                    onChange={handleFormChange}
                    required
                    className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#183f32]"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-[#183f32]">
                    Author *
                  </label>

                  <input
                    name="author"
                    value={formData.author}
                    onChange={handleFormChange}
                    required
                    className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#183f32]"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-[#183f32]">
                    Category *
                  </label>

                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleFormChange}
                    required
                    className="w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-[#183f32]"
                  >
                    <option value="">Select category</option>

                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-[#183f32]">
                    Total Copies *
                  </label>

                  <input
                    type="number"
                    name="totalCopies"
                    value={formData.totalCopies}
                    onChange={handleFormChange}
                    min="1"
                    required
                    className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#183f32]"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="mb-2 block text-sm font-semibold text-[#183f32]">
                    Image URL *
                  </label>

                  <input
                    type="url"
                    name="image"
                    value={formData.image}
                    onChange={handleFormChange}
                    required
                    className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#183f32]"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="mb-2 block text-sm font-semibold text-[#183f32]">
                    Description *
                  </label>

                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleFormChange}
                    rows={4}
                    required
                    className="w-full resize-none rounded-lg border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#183f32]"
                  />
                </div>
              </div>

              <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={closeEditModal}
                  disabled={saving}
                  className="rounded-lg border border-gray-300 px-5 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-lg bg-[#183f32] px-6 py-3 text-sm font-semibold text-white hover:bg-[#245c47] disabled:opacity-60"
                >
                  {saving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {deletingBook && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-7 shadow-xl">
            <h2 className="text-xl font-bold text-[#183f32]">Delete Book?</h2>

            <p className="mt-3 text-sm leading-6 text-gray-600">
              Are you sure you want to delete{" "}
              <span className="font-semibold text-[#183f32]">
                {deletingBook.title}
              </span>
              ? This action cannot be undone.
            </p>

            <div className="mt-7 flex justify-end gap-3">
              <button
                onClick={() => setDeletingBook(null)}
                disabled={deleting}
                className="rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>

              <button
                onClick={handleDelete}
                disabled={deleting}
                className="rounded-lg bg-red-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-60"
              >
                {deleting ? "Deleting..." : "Yes, Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
