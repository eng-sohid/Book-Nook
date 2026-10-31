const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function getBooks() {
  const response = await fetch(`${API_URL}/books`);

  if (!response.ok) {
    throw new Error("Failed to fetch books");
  }

  return response.json();
}
