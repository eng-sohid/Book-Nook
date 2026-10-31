import { createAuthClient } from "better-auth/react";
import { jwtClient } from "better-auth/client/plugins";

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",

  plugins: [jwtClient()],
});

export const { signIn, signUp, signOut, useSession } = authClient;
export async function getJWTToken() {
  const { data, error } = await authClient.token();

  if (error) {
    console.error("JWT Error:", error);
    return null;
  }

  return data?.token ?? null;
}
