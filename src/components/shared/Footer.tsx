import Link from "next/link";
import {
  BookOpen,
  Mail,
  MapPin,
  ArrowRight,
  Globe,
  Users,
  BookMarked,
} from "lucide-react";

const quickLinks = [
  { name: "Home", href: "/" },
  { name: "All Books", href: "/books" },
  { name: "Add Book", href: "/add-book" },
  { name: "My Books", href: "/my-books" },
  { name: "My Borrows", href: "/my-borrows" },
];

export default function Footer() {
  const year = 2026;

  return (
    <footer className="bg-[#122e25] px-5 pt-16 text-white md:px-10 lg:px-16">
      <div className="mx-auto grid max-w-7xl gap-12 pb-12 md:grid-cols-2 lg:grid-cols-4">
        {/* Brand */}
        <div>
          <Link href="/" className="mb-5 inline-flex items-center gap-2">
            <BookOpen size={30} className="text-[#e6bc79]" />
            <span className="text-2xl font-bold">
              Book<span className="text-[#e6bc79]">Nook.</span>
            </span>
          </Link>

          <p className="max-w-xs text-sm leading-7 text-gray-300">
            Discover your next favorite book. Explore, borrow, and enjoy reading
            with BookNook.
          </p>

          <div className="mt-6 flex gap-3">
            {[Globe, Users, BookMarked].map((Icon, index) => (
              <div
                key={index}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 transition-colors hover:border-[#e6bc79] hover:bg-[#e6bc79] hover:text-[#122e25]"
              >
                <Icon size={18} />
              </div>
            ))}
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="mb-6 text-lg font-semibold">Quick Links</h3>

          <ul className="space-y-4">
            {quickLinks.map((link) => (
              <li key={link.name}>
                <Link
                  href={link.href}
                  className="text-sm text-gray-300 transition-colors hover:text-[#e6bc79]"
                >
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Explore */}
        <div>
          <h3 className="mb-6 text-lg font-semibold">Explore</h3>

          <ul className="space-y-4 text-sm text-gray-300">
            <li>
              <Link href="/books" className="hover:text-[#e6bc79]">
                Browse Collection
              </Link>
            </li>
            <li>
              <Link href="/register" className="hover:text-[#e6bc79]">
                Create Account
              </Link>
            </li>
            <li>
              <Link href="/login" className="hover:text-[#e6bc79]">
                Sign In
              </Link>
            </li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="mb-6 text-lg font-semibold">Get in Touch</h3>

          <div className="space-y-5 text-sm text-gray-300">
            <p className="flex items-start gap-3">
              <Mail size={18} className="mt-0.5 shrink-0 text-[#e6bc79]" />
              hello@booknook.com
            </p>

            <p className="flex items-start gap-3">
              <MapPin size={18} className="mt-0.5 shrink-0 text-[#e6bc79]" />
              Your Digital Library
            </p>
          </div>

          <Link
            href="/books"
            className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[#e6bc79] hover:text-white"
          >
            Explore Books <ArrowRight size={16} />
          </Link>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/15 py-6">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 text-center text-xs text-gray-400 md:flex-row">
          <p>© {year} BookNook. All rights reserved.</p>

          <p>Made with care for book lovers.</p>
        </div>
      </div>
    </footer>
  );
}
