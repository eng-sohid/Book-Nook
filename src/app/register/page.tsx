"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { BookOpen, Eye, EyeOff, Loader2 } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    if (!/[A-Z]/.test(password)) {
      toast.error("Password must contain an uppercase letter");
      return;
    }

    if (!/[a-z]/.test(password)) {
      toast.error("Password must contain a lowercase letter");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      const { error } = await authClient.signUp.email({
        name,
        email,
        password,
        callbackURL: "/",
      });

      if (error) {
        toast.error(error.message || "Registration failed");
        return;
      }

      toast.success("Account created successfully!");

      router.push("/");
      router.refresh();
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleRegister = async () => {
    setGoogleLoading(true);

    try {
      await authClient.signIn.social({
        provider: "google",
        callbackURL: "/",
      });
    } catch {
      toast.error("Google registration failed");
      setGoogleLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#faf9f6] px-5 py-16">
      <div className="w-full max-w-md rounded-2xl border border-[#eae7df] bg-white p-7 shadow-sm sm:p-9">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-[#183f32] text-white">
            <BookOpen size={27} />
          </div>

          <h1 className="text-3xl font-bold text-[#183f32]">Create Account</h1>

          <p className="mt-2 text-sm text-gray-500">
            Join BookNook and explore our library.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Name */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-[#183f32]">
              Full Name
            </label>

            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your full name"
              required
              className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#183f32]"
            />
          </div>

          {/* Email */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-[#183f32]">
              Email Address
            </label>

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#183f32]"
            />
          </div>

          {/* Password */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-[#183f32]">
              Password
            </label>

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Create a password"
                required
                className="w-full rounded-lg border border-gray-200 px-4 py-3 pr-12 text-sm outline-none focus:border-[#183f32]"
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            <p className="mt-2 text-xs leading-5 text-gray-400">
              Minimum 6 characters, including uppercase and lowercase letters.
            </p>
          </div>

          {/* Confirm Password */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-[#183f32]">
              Confirm Password
            </label>

            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm your password"
              required
              className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#183f32]"
            />
          </div>

          <button
            type="submit"
            disabled={loading || googleLoading}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#183f32] py-3.5 text-sm font-bold text-white transition hover:bg-[#245c47] disabled:opacity-60"
          >
            {loading && <Loader2 size={18} className="animate-spin" />}
            {loading ? "Creating Account..." : "Create Account"}
          </button>
        </form>

        <div className="my-6 flex items-center gap-3">
          <div className="h-px flex-1 bg-gray-200" />
          <span className="text-xs text-gray-400">OR CONTINUE WITH</span>
          <div className="h-px flex-1 bg-gray-200" />
        </div>

        <button
          type="button"
          onClick={handleGoogleRegister}
          disabled={loading || googleLoading}
          className="flex w-full items-center justify-center gap-3 rounded-lg border border-gray-200 py-3 text-sm font-semibold text-[#183f32] transition hover:bg-gray-50 disabled:opacity-60"
        >
          {googleLoading ? (
            <Loader2 size={18} className="animate-spin" />
          ) : (
            <span className="text-lg font-bold">G</span>
          )}
          Continue with Google
        </button>

        <p className="mt-7 text-center text-sm text-gray-500">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-bold text-[#b58749] hover:underline"
          >
            Sign In
          </Link>
        </p>
      </div>
    </main>
  );
}
