"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  BookOpen,
  Menu,
  X,
  UserRound,
  ChevronDown,
  LogOut,
  ArrowUpRight,
  Sparkles,
} from "lucide-react";

import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";

const publicLinks = [
  { name: "Home", href: "/" },
  { name: "All Books", href: "/books" },
];

const privateLinks = [
  { name: "Add Book", href: "/add-book" },
  { name: "My Books", href: "/my-books" },
  { name: "My Borrows", href: "/my-borrows" },
];

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const [imageError, setImageError] = useState(false);

  const { data: session, isPending } = authClient.useSession();

  const isLoggedIn = !!session?.user;
  const user = session?.user;

  const links = isLoggedIn ? [...publicLinks, ...privateLinks] : publicLinks;

  const userInitial = user?.name?.charAt(0)?.toUpperCase() || "U";

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  const handleLogout = async () => {
    setLoggingOut(true);

    try {
      const { error } = await authClient.signOut();

      if (error) {
        toast.error(error.message || "Logout failed");
        return;
      }

      toast.success("Logged out successfully!");

      setAccountOpen(false);
      setMobileOpen(false);

      router.push("/");
      router.refresh();
    } catch {
      toast.error("Something went wrong");
    } finally {
      setLoggingOut(false);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#e8e2d5] bg-[#faf9f6]/95 shadow-[0_4px_25px_rgba(24,63,50,0.035)] backdrop-blur-xl">
      <nav className="mx-auto flex h-[82px] max-w-[1440px] items-center justify-between px-5 md:px-8 lg:px-12">
        {/* Logo */}
        <Link
          href="/"
          onClick={() => setMobileOpen(false)}
          className="group flex shrink-0 items-center gap-3"
        >
          <div className="relative flex h-11 w-11 items-center justify-center overflow-hidden rounded-[14px] bg-[#183f32] text-[#e6bc79] shadow-[0_6px_18px_rgba(24,63,50,0.18)] transition-all duration-500 group-hover:-rotate-6 group-hover:rounded-xl">
            <BookOpen size={25} strokeWidth={1.7} />

            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
          </div>

          <div>
            <h1 className="font-serif text-[23px] font-bold leading-none tracking-[-0.8px] text-[#183f32]">
              BookNook<span className="text-[#b58749]">.</span>
            </h1>

            <p className="mt-1.5 text-[9px] font-semibold tracking-[2.7px] text-[#8a887e]">
              YOUR LITTLE LIBRARY
            </p>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-1 rounded-full border border-[#e9e4d9] bg-white/65 p-1.5 shadow-sm lg:flex">
          {links.map((link) => {
            const active = isActive(link.href);

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`relative rounded-full px-4 py-2.5 text-[13px] font-semibold transition-all duration-300 ${
                  active
                    ? "bg-[#183f32] text-white shadow-[0_4px_12px_rgba(24,63,50,0.16)]"
                    : "text-[#656b63] hover:bg-[#f1efe7] hover:text-[#183f32]"
                }`}
              >
                {link.name}

                {active && (
                  <span className="absolute -bottom-[5px] left-1/2 h-[2px] w-5 -translate-x-1/2 rounded-full bg-[#c69a5c]" />
                )}
              </Link>
            );
          })}
        </div>

        {/* Right Side */}
        <div className="hidden items-center gap-3 lg:flex">
          {isPending ? (
            <div className="h-10 w-28 animate-pulse rounded-full bg-[#eae7de]" />
          ) : isLoggedIn ? (
            <div className="relative">
              <button
                type="button"
                onClick={() => setAccountOpen(!accountOpen)}
                aria-expanded={accountOpen}
                className={`flex items-center gap-2.5 rounded-full border px-3 py-2 transition-all duration-300 ${
                  accountOpen
                    ? "border-[#b58749]/50 bg-white shadow-md"
                    : "border-[#e7e2d8] bg-white/70 hover:border-[#b58749]/50 hover:bg-white"
                }`}
              >
                {user?.image && !imageError ? (
                  <img
                    src={user.image}
                    alt={user.name || "User"}
                    onError={() => setImageError(true)}
                    className="h-8 w-8 rounded-full border border-[#e8e2d5] object-cover"
                  />
                ) : (
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#183f32] text-xs font-bold text-white">
                    {userInitial}
                  </div>
                )}

                <span className="max-w-28 truncate text-[13px] font-semibold text-[#183f32]">
                  {user?.name || "My Account"}
                </span>

                <ChevronDown
                  size={15}
                  className={`text-[#8b806b] transition-transform duration-300 ${
                    accountOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* Account Dropdown */}
              <div
                className={`absolute right-0 top-full mt-3 w-[280px] origin-top-right rounded-[20px] border border-[#e9e2d5] bg-[#fffefa] p-2 shadow-[0_20px_60px_rgba(24,63,50,0.16)] transition-all duration-200 ${
                  accountOpen
                    ? "visible translate-y-0 scale-100 opacity-100"
                    : "invisible -translate-y-2 scale-95 opacity-0"
                }`}
              >
                <div className="rounded-[14px] bg-[#f3f0e7] p-4">
                  <div className="mb-3 flex items-center gap-2">
                    <Sparkles size={13} className="text-[#b58749]" />
                    <span className="text-[9px] font-bold tracking-[2px] text-[#987344]">
                      YOUR BOOKNOOK ACCOUNT
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    {user?.image && !imageError ? (
                      <img
                        src={user.image}
                        alt={user.name || "User"}
                        onError={() => setImageError(true)}
                        className="h-11 w-11 rounded-full object-cover"
                      />
                    ) : (
                      <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#183f32] font-bold text-white">
                        {userInitial}
                      </div>
                    )}

                    <div className="min-w-0">
                      <p className="truncate text-sm font-bold text-[#183f32]">
                        {user?.name || "User"}
                      </p>

                      <p className="truncate text-xs text-[#858078]">
                        {user?.email}
                      </p>
                    </div>
                  </div>
                </div>

                <Link
                  href="/profile"
                  onClick={() => setAccountOpen(false)}
                  className="mt-2 flex items-center justify-between rounded-xl px-4 py-3 text-sm font-semibold text-[#354c40] transition-colors hover:bg-[#f3f0e7]"
                >
                  <span className="flex items-center gap-3">
                    <UserRound size={17} />
                    My Profile
                  </span>

                  <ArrowUpRight size={15} className="text-[#b58749]" />
                </Link>

                <button
                  type="button"
                  onClick={handleLogout}
                  disabled={loggingOut}
                  className="mt-1 flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-semibold text-red-600 transition-colors hover:bg-red-50 disabled:opacity-50"
                >
                  <LogOut size={17} />
                  {loggingOut ? "Logging out..." : "Logout"}
                </button>
              </div>
            </div>
          ) : (
            <>
              <Link
                href="/login"
                className="rounded-full px-5 py-3 text-[13px] font-bold text-[#183f32] transition-colors hover:bg-[#f0ede4] hover:text-[#b58749]"
              >
                Login
              </Link>

              <Link
                href="/register"
                className="group inline-flex items-center gap-2 rounded-full bg-[#183f32] px-6 py-3 text-[13px] font-bold text-white shadow-[0_6px_18px_rgba(24,63,50,0.14)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#245c47] hover:shadow-lg"
              >
                Get Started
                <ArrowUpRight
                  size={16}
                  className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                />
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          type="button"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
          aria-expanded={mobileOpen}
          className="flex h-11 w-11 items-center justify-center rounded-xl border border-[#e8e2d5] bg-white text-[#183f32] shadow-sm transition-all duration-300 hover:border-[#b58749] lg:hidden"
        >
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>

      {/* Mobile Navigation */}
      <div
        className={`grid transition-all duration-300 ease-in-out lg:hidden ${
          mobileOpen
            ? "grid-rows-[1fr] opacity-100"
            : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="overflow-hidden">
          <div className="border-t border-[#e9e2d5] bg-[#faf9f6] px-5 pb-6 pt-4 md:px-8">
            <div className="flex flex-col gap-1">
              {links.map((link) => {
                const active = isActive(link.href);

                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className={`flex items-center justify-between rounded-xl px-4 py-3.5 text-sm font-semibold transition-colors ${
                      active
                        ? "bg-[#183f32] text-white"
                        : "text-[#4c554f] hover:bg-[#f0ede4] hover:text-[#183f32]"
                    }`}
                  >
                    {link.name}

                    {active && (
                      <span className="h-1.5 w-1.5 rounded-full bg-[#e6bc79]" />
                    )}
                  </Link>
                );
              })}
            </div>

            {!isPending && (
              <div className="mt-4 border-t border-[#e8e2d5] pt-4">
                {isLoggedIn ? (
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      {user?.image && !imageError ? (
                        <img
                          src={user.image}
                          alt={user.name || "User"}
                          onError={() => setImageError(true)}
                          className="h-11 w-11 rounded-full border border-[#e8e2d5] object-cover"
                        />
                      ) : (
                        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#183f32] font-bold text-white">
                          {userInitial}
                        </div>
                      )}

                      <div className="min-w-0">
                        <p className="truncate text-sm font-bold text-[#183f32]">
                          {user?.name}
                        </p>

                        <p className="truncate text-xs text-[#858078]">
                          {user?.email}
                        </p>
                      </div>
                    </div>

                    <Link
                      href="/profile"
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center gap-2 text-sm font-semibold text-[#183f32]"
                    >
                      <UserRound size={17} />
                      My Profile
                    </Link>

                    <button
                      type="button"
                      onClick={handleLogout}
                      disabled={loggingOut}
                      className="flex items-center gap-2 text-sm font-semibold text-red-600 disabled:opacity-50"
                    >
                      <LogOut size={17} />
                      {loggingOut ? "Logging out..." : "Logout"}
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-3">
                    <Link
                      href="/login"
                      onClick={() => setMobileOpen(false)}
                      className="flex-1 rounded-xl border border-[#dcd6c9] bg-white px-4 py-3 text-center text-sm font-bold text-[#183f32]"
                    >
                      Login
                    </Link>

                    <Link
                      href="/register"
                      onClick={() => setMobileOpen(false)}
                      className="flex-1 rounded-xl bg-[#183f32] px-4 py-3 text-center text-sm font-bold text-white"
                    >
                      Register
                    </Link>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
