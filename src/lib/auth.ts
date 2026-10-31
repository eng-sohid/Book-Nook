import { betterAuth } from "better-auth";
import { mongodbAdapter } from "@better-auth/mongo-adapter";
import { jwt } from "better-auth/plugins";
import { clientPromise } from "../lib/mangodb";

const client = await clientPromise;
const db = client.db("booknook");

export const auth = betterAuth({
  baseURL: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",

  database: mongodbAdapter(db, {
    client,
  }),

  emailAndPassword: {
    enabled: true,
    minPasswordLength: 6,
    requireEmailVerification: false,
  },

  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    },
  },

  trustedOrigins: ["http://localhost:3000"],

  plugins: [jwt()],
});
