import { authClient } from "@/lib/auth-client";

export async function getAuthHeaders() {
  const { data, error } = await authClient.token();

  if (error || !data?.token) {
    throw new Error("Authentication required. Please login again.");
  }

  return {
    Authorization: `Bearer ${data.token}`,
    "Content-Type": "application/json",
  };
}
