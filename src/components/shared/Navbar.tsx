"use client";

import Link from "next/link";
import { useState } from "react";
import { BookOpen, Menu, X, UserRound, ChevronDown } from "lucide-react";

import { Button, Dropdown } from "@heroui/react";

const publicLinks = [
  { name: "Home", href: "/" },
  { name: "All Books", href: "/main/books" },
];

const privateLinks = [
  { name: "Add Book", href: "/main/add-book" },
  { name: "My Books", href: "/main/my-books" },
  { name: "My Borrows", href: "/main/my-borrows" },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  // Authentication যুক্ত হলে এখানে
  // logged-in user অনুযায়ী menu পরিবর্তন হবে।
  const isLoggedIn = false;

  const links = isLoggedIn ? [...publicLinks, ...privateLinks] : publicLinks;

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
          {isLoggedIn ? (
            <Dropdown>
              <Dropdown.Trigger>
                <Button variant="outline" className="gap-2">
                  <UserRound size={17} />
                  My Account
                  <ChevronDown size={15} />
                </Button>
              </Dropdown.Trigger>

              <Dropdown.Popover>
                <Dropdown.Menu>
                  <Dropdown.Item id="profile">My Profile</Dropdown.Item>
                  <Dropdown.Item id="logout">Logout</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown.Popover>
            </Dropdown>
          ) : (
            <>
              <Link href="/auth/login" className="font-semibold text-[#183f32]">
                Login
              </Link>

              <Link
                href="/auth/register"
                className="bg-[#183f32] px-5 font-semibold text-white hover:bg-[#245c47]"
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

            {!isLoggedIn && (
              <div className="flex gap-3 pt-2">
                <Link
                  href="/auth/login"
                  className="flex-1 rounded-xl border border-[#d6d3ca] px-4 py-2 text-center"
                  onClick={() => setMobileOpen(false)}
                >
                  Login
                </Link>

                <Link
                  href="/auth/register"
                  className="flex-1 rounded-xl bg-[#183f32] px-4 py-2 text-center text-white"
                  onClick={() => setMobileOpen(false)}
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
