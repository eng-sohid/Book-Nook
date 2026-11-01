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
  Mail,
  LockKeyhole,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";
import { toast } from "sonner";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setLoading(true);

    try {
      const { error } = await authClient.signIn.email({
        email,
        password,
        callbackURL: "/",
      });

      if (error) {
        toast.error(error.message || "Invalid email or password");
        return;
      }

      toast.success("Login successful!");

      router.push("/");
      router.refresh();
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setGoogleLoading(true);

    try {
      await authClient.signIn.social({
        provider: "google",
        callbackURL: "/",
      });
    } catch {
      toast.error("Google login failed");
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
              WELCOME BACK
            </div>

            <h2 className="max-w-md text-4xl font-bold leading-tight xl:text-5xl">
              Every book has a story. Continue yours.
            </h2>

            <p className="mt-6 max-w-sm text-sm leading-7 text-white/65">
              Sign in to explore your library, manage your borrowed books and
              continue your reading journey.
            </p>

            <div className="mt-10 space-y-5">
              {[
                "Access your personal library",
                "Manage your borrowed books",
                "Discover your next favourite story",
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

        {/* Login Form */}
        <div className="flex flex-col justify-center px-6 py-12 sm:px-10 lg:px-12">
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

          <div className="mb-9">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#f3eee5] text-[#b58749]">
              <LockKeyhole size={23} />
            </div>

            <p className="mb-2 text-xs font-bold tracking-[0.2em] text-[#b58749]">
              YOUR LIBRARY IS WAITING
            </p>

            <h1 className="text-3xl font-bold tracking-tight text-[#183f32] sm:text-4xl">
              Welcome Back
            </h1>

            <p className="mt-3 text-sm leading-6 text-gray-500">
              Sign in to continue your BookNook journey.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
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
              <div className="mb-2 flex items-center justify-between">
                <label className="block text-sm font-semibold text-[#183f32]">
                  Password
                </label>
              </div>

              <div className="relative">
                <LockKeyhole
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-[#b58749]"
                />

                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  autoComplete="current-password"
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
                  Signing In...
                </>
              ) : (
                <>
                  Sign In
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="my-7 flex items-center gap-4">
            <div className="h-px flex-1 bg-[#eae7df]" />
            <span className="text-[10px] font-semibold tracking-[0.15em] text-gray-400">
              OR CONTINUE WITH
            </span>
            <div className="h-px flex-1 bg-[#eae7df]" />
          </div>

          {/* Google */}
          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={loading || googleLoading}
            className="flex w-full items-center justify-center gap-3 rounded-xl border border-[#eae7df] bg-white py-3.5 text-sm font-semibold text-[#183f32] transition hover:border-[#d9b779] hover:bg-[#faf9f6] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {googleLoading ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <svg viewBox="0 0 48 48" className="h-5 w-5">
                <path
                  fill="#EA4335"
                  d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5Z"
                />
                <path
                  fill="#4285F4"
                  d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.73 7.18l7.3 5.66c4.26-3.93 6.72-9.72 6.72-17.31Z"
                />
                <path
                  fill="#FBBC05"
                  d="M10.53 28.59a14.4 14.4 0 0 1 0-9.18l-7.98-6.19a24 24 0 0 0 0 21.56l7.98-6.19Z"
                />
                <path
                  fill="#34A853"
                  d="M24 48c6.48 0 11.93-2.13 15.91-5.81l-7.3-5.66c-2.02 1.36-4.6 2.17-8.61 2.17-6.26 0-11.57-4.22-13.47-9.92l-7.98 6.19C6.51 42.62 14.62 48 24 48Z"
                />
              </svg>
            )}
            Continue with Google
          </button>

          {/* Register Link */}
          <p className="mt-9 text-center text-sm text-gray-500">
            Don&apos;t have an account?{" "}
            <Link
              href="/register"
              className="font-bold text-[#b58749] transition hover:text-[#183f32] hover:underline"
            >
              Create Account
            </Link>
          </p>

          <div className="mt-7 flex items-center justify-center gap-2 text-xs text-gray-400">
            <ShieldCheck size={14} className="text-[#b58749]" />
            Secure authentication powered by BookNook.
          </div>
        </div>
      </motion.div>
    </main>
  );
}
