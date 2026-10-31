"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  BookOpen,
  Menu,
  X,
  UserRound,
  ChevronDown,
  LogOut,
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

  const [mobileOpen, setMobileOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const { data: session, isPending } = authClient.useSession();

  const isLoggedIn = !!session?.user;
  const user = session?.user;

  const links = isLoggedIn ? [...publicLinks, ...privateLinks] : publicLinks;

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
    <header className="sticky top-0 z-50 w-full border-b border-[#e8e5dc] bg-[#faf9f6]/95 backdrop-blur-md">
      <nav className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#183f32] text-white">
            <BookOpen size={23} />
          </div>

          <div>
            <h1 className="text-xl font-bold tracking-tight text-[#183f32]">
              BookNook<span className="text-[#c18b45]">.</span>
            </h1>

            <p className="text-[10px] tracking-[2px] text-gray-500">
              YOUR LITTLE LIBRARY
            </p>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-8 md:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-[#4c554f] transition hover:text-[#183f32]"
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* Right Side */}
        <div className="hidden items-center gap-3 md:flex">
          {isPending ? (
            <div className="h-9 w-24 animate-pulse rounded-lg bg-gray-200" />
          ) : isLoggedIn ? (
            <div className="relative">
              <button
                onClick={() => setAccountOpen(!accountOpen)}
                className="flex items-center gap-2 rounded-xl border border-[#e8e5dc] px-3 py-2 text-sm font-semibold text-[#183f32] transition hover:bg-white"
              >
                {user?.image ? (
                  <img
                    src={user.image}
                    alt={user.name || "User"}
                    className="h-7 w-7 rounded-full object-cover"
                  />
                ) : (
                  <UserRound size={19} />
                )}

                <span className="max-w-28 truncate">
                  {user?.name || "My Account"}
                </span>

                <ChevronDown size={15} />
              </button>

              {accountOpen && (
                <div className="absolute right-0 top-full mt-2 w-52 rounded-xl border border-[#e8e5dc] bg-white p-2 shadow-lg">
                  <div className="border-b border-gray-100 px-3 py-2">
                    <p className="truncate text-sm font-semibold text-[#183f32]">
                      {user?.name}
                    </p>

                    <p className="truncate text-xs text-gray-500">
                      {user?.email}
                    </p>
                  </div>

                  <button
                    onClick={handleLogout}
                    disabled={loggingOut}
                    className="mt-2 flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm font-medium text-red-600 transition hover:bg-red-50 disabled:opacity-50"
                  >
                    <LogOut size={16} />
                    {loggingOut ? "Logging out..." : "Logout"}
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link
                href="/login"
                className="font-semibold text-[#183f32] transition hover:text-[#b58749]"
              >
                Login
              </Link>

              <Link
                href="/register"
                className="rounded-lg bg-[#183f32] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#245c47]"
              >
                Register
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="rounded-lg p-2 text-[#183f32] md:hidden"
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={25} /> : <Menu size={25} />}
        </button>
      </nav>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="border-t border-[#e8e5dc] bg-[#faf9f6] px-5 py-5 md:hidden">
          <div className="flex flex-col gap-4">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="font-medium text-[#183f32]"
              >
                {link.name}
              </Link>
            ))}

            {!isPending && (
              <>
                {isLoggedIn ? (
                  <>
                    <div className="border-t border-[#e8e5dc] pt-4">
                      <p className="font-semibold text-[#183f32]">
                        {user?.name}
                      </p>

                      <p className="mt-1 text-xs text-gray-500">
                        {user?.email}
                      </p>
                    </div>

                    <button
                      onClick={handleLogout}
                      disabled={loggingOut}
                      className="flex items-center gap-2 text-left font-semibold text-red-600 disabled:opacity-50"
                    >
                      <LogOut size={17} />
                      {loggingOut ? "Logging out..." : "Logout"}
                    </button>
                  </>
                ) : (
                  <div className="flex gap-3 border-t border-[#e8e5dc] pt-4">
                    <Link
                      href="/login"
                      className="flex-1 rounded-xl border border-[#d6d3ca] px-4 py-2 text-center"
                      onClick={() => setMobileOpen(false)}
                    >
                      Login
                    </Link>

                    <Link
                      href="/register"
                      className="flex-1 rounded-xl bg-[#183f32] px-4 py-2 text-center text-white"
                      onClick={() => setMobileOpen(false)}
                    >
                      Register
                    </Link>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
