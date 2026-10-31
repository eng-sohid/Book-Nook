"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const categories = ["Fiction", "Science", "History", "Kids", "Others"];

export default function BookForm() {
  const router = useRouter();
  const { data: session } = authClient.useSession();

  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    author: "",
    category: "",
    image: "",
    description: "",
    totalCopies: "1",
  });

  const handleChange = (
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

    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/books`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          title: formData.title.trim(),
          author: formData.author.trim(),
          image: formData.image.trim(),
          description: formData.description.trim(),
          totalCopies: Number(formData.totalCopies),
          addedByName: session.user.name,
          addedByEmail: session.user.email,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to add book");
      }

      toast.success("Book added successfully!");

      setFormData({
        title: "",
        author: "",
        category: "",
        image: "",
        description: "",
        totalCopies: "1",
      });

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
    <form
      onSubmit={handleSubmit}
      className="space-y-6 rounded-2xl border border-[#eae7df] bg-white p-6 shadow-sm md:p-8"
    >
      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-semibold text-[#183f32]">
            Your Name
          </label>
          <input
            value={session?.user?.name || ""}
            readOnly
            className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-600 outline-none"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-[#183f32]">
            Your Email
          </label>
          <input
            value={session?.user?.email || ""}
            readOnly
            className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-600 outline-none"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-[#183f32]">
            Book Title *
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Enter book title"
            required
            className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-[#183f32]"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-[#183f32]">
            Author Name *
          </label>
          <input
            type="text"
            name="author"
            value={formData.author}
            onChange={handleChange}
            placeholder="Enter author name"
            required
            className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-[#183f32]"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-[#183f32]">
            Category *
          </label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
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
            onChange={handleChange}
            min="1"
            required
            className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#183f32]"
          />
        </div>

        <div className="md:col-span-2">
          <label className="mb-2 block text-sm font-semibold text-[#183f32]">
            Book Image URL *
          </label>
          <input
            type="url"
            name="image"
            value={formData.image}
            onChange={handleChange}
            placeholder="https://example.com/book-image.jpg"
            required
            className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#183f32]"
          />
        </div>

        <div className="md:col-span-2">
          <label className="mb-2 block text-sm font-semibold text-[#183f32]">
            Book Description *
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Write a short description about this book..."
            rows={5}
            required
            className="w-full resize-none rounded-lg border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#183f32]"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={loading || !session?.user}
        className="w-full rounded-lg bg-[#183f32] px-6 py-3.5 text-sm font-bold text-white transition hover:bg-[#245c47] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? "Adding Book..." : "Add Book"}
      </button>
    </form>
  );
}
