const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function getBooks() {
  if (!API_URL) {
    throw new Error("NEXT_PUBLIC_API_URL is not configured");
  }

  const response = await fetch(`${API_URL}/books`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch books");
  }

  return response.json();
}
