"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { authClient } from "@/lib/auth-client";

import {
  BookOpen,
  Eye,
  EyeOff,
  Loader2,
  UserRound,
  Mail,
  LockKeyhole,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";
import { toast } from "sonner";

export default function RegisterPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#faf9f6] px-4 py-12 sm:px-6">
      {/* Background Decorations */}
      <div className="pointer-events-none absolute -left-32 top-10 h-80 w-80 rounded-full bg-[#183f32]/5 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -right-20 h-96 w-96 rounded-full bg-[#b58749]/10 blur-3xl" />

      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 grid w-full max-w-5xl overflow-hidden rounded-[28px] border border-[#eae7df] bg-white shadow-[0_25px_80px_rgba(24,63,50,0.10)] lg:grid-cols-2"
      >
        {/* Left Panel */}
        <div className="relative hidden overflow-hidden bg-[#183f32] p-10 text-white lg:flex lg:flex-col lg:justify-between">
          <div className="absolute -right-24 -top-20 h-80 w-80 rounded-full border border-white/10" />
          <div className="absolute -right-12 -top-8 h-56 w-56 rounded-full border border-white/10" />
          <div className="absolute -bottom-28 -left-20 h-72 w-72 rounded-full border border-white/10" />

          <div className="relative z-10">
            <Link href="/" className="inline-flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#d9b779] text-[#183f32]">
                <BookOpen size={25} />
              </div>
              <span className="text-2xl font-bold tracking-tight">
                BookNook<span className="text-[#e5c995]">.</span>
              </span>
            </Link>
          </div>

          <div className="relative z-10 my-12">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-semibold text-[#e5c995]">
              <Sparkles size={14} />
              YOUR NEXT CHAPTER STARTS HERE
            </div>

            <h2 className="max-w-md text-4xl font-bold leading-tight xl:text-5xl">
              Discover a world of stories.
            </h2>

            <p className="mt-6 max-w-sm text-sm leading-7 text-white/65">
              Create your BookNook account and become part of a community where
              every book opens a new possibility.
            </p>

            <div className="mt-10 space-y-5">
              {[
                "Explore a growing book collection",
                "Borrow books and track your reading",
                "Share your favourite books with others",
              ].map((item) => (
                <div key={item} className="flex items-center gap-3">
                  <CheckCircle2 size={19} className="shrink-0 text-[#e5c995]" />
                  <span className="text-sm text-white/80">{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="relative z-10 border-t border-white/10 pt-6 text-xs text-white/45">
            © 2026 BookNook. Your reading community.
          </div>
        </div>

        {/* Register Form */}
        <div className="px-6 py-10 sm:px-10 sm:py-12 lg:px-12">
          <div className="mb-8 lg:hidden">
            <Link href="/" className="inline-flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#183f32] text-[#e5c995]">
                <BookOpen size={23} />
              </div>
              <span className="text-2xl font-bold text-[#183f32]">
                BookNook<span className="text-[#b58749]">.</span>
              </span>
            </Link>
          </div>

          <div className="mb-8">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#f3eee5] text-[#b58749]">
              <Sparkles size={23} />
            </div>

            <p className="mb-2 text-xs font-bold tracking-[0.2em] text-[#b58749]">
              JOIN OUR COMMUNITY
            </p>

            <h1 className="text-3xl font-bold tracking-tight text-[#183f32] sm:text-4xl">
              Create Account
            </h1>

            <p className="mt-3 text-sm leading-6 text-gray-500">
              Start your reading journey with BookNook.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-[#183f32]">
                Full Name
              </label>

              <div className="relative">
                <UserRound
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-[#b58749]"
                />

                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your full name"
                  required
                  autoComplete="name"
                  className="w-full rounded-xl border border-[#eae7df] bg-[#faf9f6] py-3.5 pl-11 pr-4 text-sm text-[#183f32] outline-none transition placeholder:text-gray-400 focus:border-[#b58749] focus:bg-white focus:ring-4 focus:ring-[#b58749]/10"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-[#183f32]">
                Email Address
              </label>

              <div className="relative">
                <Mail
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-[#b58749]"
                />

                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  autoComplete="email"
                  className="w-full rounded-xl border border-[#eae7df] bg-[#faf9f6] py-3.5 pl-11 pr-4 text-sm text-[#183f32] outline-none transition placeholder:text-gray-400 focus:border-[#b58749] focus:bg-white focus:ring-4 focus:ring-[#b58749]/10"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-[#183f32]">
                Password
              </label>

              <div className="relative">
                <LockKeyhole
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-[#b58749]"
                />

                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Create a password"
                  required
                  autoComplete="new-password"
                  className="w-full rounded-xl border border-[#eae7df] bg-[#faf9f6] py-3.5 pl-11 pr-12 text-sm text-[#183f32] outline-none transition placeholder:text-gray-400 focus:border-[#b58749] focus:bg-white focus:ring-4 focus:ring-[#b58749]/10"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 transition hover:text-[#183f32]"
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

              <div className="relative">
                <LockKeyhole
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-[#b58749]"
                />

                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm your password"
                  required
                  autoComplete="new-password"
                  className="w-full rounded-xl border border-[#eae7df] bg-[#faf9f6] py-3.5 pl-11 pr-12 text-sm text-[#183f32] outline-none transition placeholder:text-gray-400 focus:border-[#b58749] focus:bg-white focus:ring-4 focus:ring-[#b58749]/10"
                />

                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 transition hover:text-[#183f32]"
                  aria-label={
                    showConfirmPassword ? "Hide password" : "Show password"
                  }
                >
                  {showConfirmPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading || googleLoading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#183f32] py-4 text-sm font-bold text-white shadow-lg shadow-[#183f32]/15 transition hover:-translate-y-0.5 hover:bg-[#245c47] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Creating Account...
                </>
              ) : (
                <>
                  Create Account
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="my-6 flex items-center gap-4">
            <div className="h-px flex-1 bg-[#eae7df]" />
            <span className="text-[10px] font-semibold tracking-[0.15em] text-gray-400">
              OR CONTINUE WITH
            </span>
            <div className="h-px flex-1 bg-[#eae7df]" />
          </div>

          {/* Google */}
          <button
            type="button"
            onClick={handleGoogleRegister}
            disabled={loading || googleLoading}
            className="flex w-full items-center justify-center gap-3 rounded-xl border border-[#eae7df] bg-white py-3.5 text-sm font-semibold text-[#183f32] transition hover:border-[#d9b779] hover:bg-[#faf9f6] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {googleLoading ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <span className="text-lg font-bold">G</span>
            )}
            Continue with Google
          </button>

          {/* Login Link */}
          <p className="mt-8 text-center text-sm text-gray-500">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-bold text-[#b58749] transition hover:text-[#183f32] hover:underline"
            >
              Sign In
            </Link>
          </p>

          <div className="mt-7 flex items-center justify-center gap-2 text-xs text-gray-400">
            <ShieldCheck size={14} className="text-[#b58749]" />
            Your account is protected with secure authentication.
          </div>
        </div>
      </motion.div>
    </main>
  );
}
