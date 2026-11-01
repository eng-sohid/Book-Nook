"use client";

import { useState, type ChangeEvent, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { motion } from "framer-motion";
import {
  BookOpen,
  UserRound,
  Mail,
  Library,
  Image as ImageIcon,
  FileText,
  Hash,
  Plus,
  LoaderCircle,
  Sparkles,
} from "lucide-react";

import { authClient } from "@/lib/auth-client";
import { getAuthHeaders } from "@/lib/auth-api";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const categories = ["Fiction", "Science", "History", "Kids", "Others"];

const initialFormData = {
  title: "",
  author: "",
  category: "",
  image: "",
  description: "",
  totalCopies: "1",
};

const inputClass =
  "w-full rounded-xl border border-[#eae7df] bg-[#fcfbf9] px-4 py-3.5 text-sm text-[#183f32] outline-none transition-all duration-200 placeholder:text-gray-400 hover:border-[#d9c7a8] focus:border-[#183f32] focus:bg-white focus:ring-4 focus:ring-[#183f32]/5";

const labelClass =
  "mb-2.5 flex items-center gap-2 text-sm font-semibold text-[#183f32]";

export default function BookForm() {
  const router = useRouter();
  const { data: session } = authClient.useSession();

  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState(initialFormData);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!API_URL) {
      toast.error("API URL is not configured");
      return;
    }

    if (!session?.user) {
      toast.error("Please login before adding a book");
      return;
    }

    if (Number(formData.totalCopies) < 1) {
      toast.error("Total copies must be at least 1");
      return;
    }

    setLoading(true);

    try {
      const headers = await getAuthHeaders();

      const response = await fetch(`${API_URL}/books`, {
        method: "POST",
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
        throw new Error(result.message || "Failed to add book");
      }

      toast.success("Book added successfully!");

      setFormData(initialFormData);

      router.push("/my-books");
      router.refresh();
    } catch (error) {
      console.error(error);

      toast.error(
        error instanceof Error ? error.message : "Something went wrong",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: 25 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      onSubmit={handleSubmit}
      className="overflow-hidden rounded-3xl border border-[#eae7df] bg-white shadow-[0_15px_50px_rgba(24,63,50,0.07)]"
    >
      {/* Form Header */}
      <div className="relative overflow-hidden bg-[#183f32] px-6 py-7 text-white md:px-9">
        <div className="absolute -right-10 -top-16 h-48 w-48 rounded-full border border-white/10" />
        <div className="absolute -right-2 -top-8 h-32 w-32 rounded-full border border-white/10" />

        <div className="relative flex items-center gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#b58749] text-white shadow-lg shadow-black/10">
            <BookOpen size={24} />
          </div>

          <div>
            <h2 className="text-xl font-bold md:text-2xl">Book Information</h2>
            <p className="mt-1 text-sm text-white/65">
              Fill in the details to add your book.
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-8 p-6 md:p-9">
        {/* Personal Information */}
        <section>
          <div className="mb-5 flex items-center gap-2">
            <UserRound size={18} className="text-[#b58749]" />
            <h3 className="font-bold text-[#183f32]">Owner Information</h3>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <label className={labelClass}>
                <UserRound size={15} />
                Your Name
              </label>

              <input
                value={session?.user?.name || ""}
                readOnly
                placeholder="Your name"
                className={`${inputClass} cursor-not-allowed bg-gray-50 text-gray-500`}
              />
            </div>

            <div>
              <label className={labelClass}>
                <Mail size={15} />
                Your Email
              </label>

              <input
                value={session?.user?.email || ""}
                readOnly
                placeholder="Your email"
                className={`${inputClass} cursor-not-allowed bg-gray-50 text-gray-500`}
              />
            </div>
          </div>
        </section>

        <div className="h-px bg-[#f0eee8]" />

        {/* Book Information */}
        <section>
          <div className="mb-5 flex items-center gap-2">
            <BookOpen size={18} className="text-[#b58749]" />
            <h3 className="font-bold text-[#183f32]">Book Details</h3>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            {/* Title */}
            <div>
              <label className={labelClass}>
                <BookOpen size={15} />
                Book Title <span className="text-red-500">*</span>
              </label>

              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Enter book title"
                required
                className={inputClass}
              />
            </div>

            {/* Author */}
            <div>
              <label className={labelClass}>
                <UserRound size={15} />
                Author Name <span className="text-red-500">*</span>
              </label>

              <input
                type="text"
                name="author"
                value={formData.author}
                onChange={handleChange}
                placeholder="Enter author name"
                required
                className={inputClass}
              />
            </div>

            {/* Category */}
            <div>
              <label className={labelClass}>
                <Library size={15} />
                Category <span className="text-red-500">*</span>
              </label>

              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                className={`${inputClass} cursor-pointer`}
              >
                <option value="">Select category</option>

                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            {/* Copies */}
            <div>
              <label className={labelClass}>
                <Hash size={15} />
                Total Copies <span className="text-red-500">*</span>
              </label>

              <input
                type="number"
                name="totalCopies"
                value={formData.totalCopies}
                onChange={handleChange}
                min="1"
                required
                className={inputClass}
              />
            </div>

            {/* Image URL */}
            <div className="md:col-span-2">
              <label className={labelClass}>
                <ImageIcon size={15} />
                Book Image URL <span className="text-red-500">*</span>
              </label>

              <input
                type="url"
                name="image"
                value={formData.image}
                onChange={handleChange}
                placeholder="https://example.com/book-image.jpg"
                required
                className={inputClass}
              />

              <p className="mt-2 text-xs text-gray-400">
                Add a valid image URL for your book cover.
              </p>
            </div>

            {/* Description */}
            <div className="md:col-span-2">
              <label className={labelClass}>
                <FileText size={15} />
                Book Description <span className="text-red-500">*</span>
              </label>

              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Write a short description about this book..."
                rows={6}
                required
                className={`${inputClass} resize-none leading-7`}
              />

              <p className="mt-2 text-right text-xs text-gray-400">
                {formData.description.length} characters
              </p>
            </div>
          </div>
        </section>

        {/* Information Note */}
        <div className="flex items-start gap-3 rounded-2xl border border-[#e9e4da] bg-[#faf9f6] p-4">
          <Sparkles size={19} className="mt-0.5 shrink-0 text-[#b58749]" />

          <p className="text-xs leading-6 text-gray-500">
            Please make sure all book information is correct before submitting.
            Your contribution helps other readers discover great books.
          </p>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading || !session?.user}
          className="group flex w-full items-center justify-center gap-3 rounded-xl bg-[#183f32] px-6 py-4 text-sm font-bold text-white shadow-lg shadow-[#183f32]/10 transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#245c47] hover:shadow-xl hover:shadow-[#183f32]/15 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
        >
          {loading ? (
            <>
              <LoaderCircle size={19} className="animate-spin" />
              Adding Your Book...
            </>
          ) : (
            <>
              <Plus
                size={19}
                className="transition-transform duration-300 group-hover:rotate-90"
              />
              Add Book to Library
            </>
          )}
        </button>

        {!session?.user && (
          <p className="text-center text-xs text-red-500">
            Please login to add a book to the library.
          </p>
        )}
      </div>
    </motion.form>
  );
}
