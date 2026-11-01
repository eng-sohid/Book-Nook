"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  BookOpen,
  FlaskConical,
  Landmark,
  Baby,
  ArrowUpRight,
} from "lucide-react";

const categories = [
  {
    name: "Fiction",
    description: "Stories that spark imagination and take you beyond reality.",
    count: "Explore stories",
    icon: BookOpen,
    number: "01",
    cover: "from-[#315c46] to-[#183d30]",
    spine: "bg-[#163528]",
    accent: "#e5c99a",
    subtitle: "THE WORLD OF STORIES",
  },
  {
    name: "Science",
    description: "Discover new ideas and explore the wonders of knowledge.",
    count: "Explore knowledge",
    icon: FlaskConical,
    number: "02",
    cover: "from-[#526d91] to-[#304761]",
    spine: "bg-[#293e57]",
    accent: "#e3d5b2",
    subtitle: "EXPLORE THE UNKNOWN",
  },
  {
    name: "History",
    description: "Travel through time and discover stories from the past.",
    count: "Explore history",
    icon: Landmark,
    number: "03",
    cover: "from-[#a77b4c] to-[#76502f]",
    spine: "bg-[#674326]",
    accent: "#f1dfbd",
    subtitle: "STORIES FROM THE PAST",
  },
  {
    name: "Kids",
    description: "Little books, big adventures, and endless imagination.",
    count: "Explore adventures",
    icon: Baby,
    number: "04",
    cover: "from-[#a96f86] to-[#79465f]",
    spine: "bg-[#68394f]",
    accent: "#f5dfd9",
    subtitle: "LITTLE BIG ADVENTURES",
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const cardVariants = {
  hidden: {
    opacity: 0,
    y: 45,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      ease: "easeOut" as const,
    },
  },
};

export default function Categories() {
  return (
    <section className="relative overflow-hidden bg-[#f5f2e9] px-5 py-24 md:px-8 md:py-28">
      {/* Background */}
      <div className="pointer-events-none absolute -left-40 top-20 h-80 w-80 rounded-full bg-[#dce6d8]/70 blur-[100px]" />
      <div className="pointer-events-none absolute -right-40 bottom-10 h-96 w-96 rounded-full bg-[#eadcc8]/70 blur-[110px]" />

      <div className="relative mx-auto max-w-6xl">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7 }}
          className="mb-20 text-center"
        >
          <div className="mb-5 flex items-center justify-center gap-3">
            <span className="h-px w-10 bg-[#b58749]" />

            <p className="text-[10px] font-bold tracking-[4px] text-[#a77b43] sm:text-xs">
              THE BOOK COLLECTION
            </p>

            <span className="h-px w-10 bg-[#b58749]" />
          </div>

          <h2 className="text-3xl font-semibold tracking-tight text-[#183f32] sm:text-4xl md:text-5xl">
            Find Your Next Chapter
            <span className="text-[#b58749]">.</span>
          </h2>

          <p className="mx-auto mt-5 max-w-lg text-sm leading-7 text-gray-500 md:text-base">
            Every category opens a new world. Pick a collection and discover
            stories waiting to be explored.
          </p>
        </motion.div>

        {/* Book Collection */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          className="grid gap-x-12 gap-y-16 sm:grid-cols-2 lg:gap-x-16"
        >
          {categories.map((category) => {
            const Icon = category.icon;

            return (
              <motion.div
                key={category.name}
                variants={cardVariants}
                whileHover={{
                  y: -12,
                  rotate: -1,
                }}
                transition={{ duration: 0.35 }}
                className="group mx-auto w-full max-w-[460px]"
              >
                <Link
                  href={`/books?category=${encodeURIComponent(category.name)}`}
                  className="relative block"
                >
                  {/* Book Shadow */}
                  <div className="absolute -bottom-3 left-5 right-3 h-8 rounded-full bg-[#263a2e]/20 blur-xl transition-all duration-500 group-hover:scale-105 group-hover:bg-[#263a2e]/30" />

                  {/* Book Cover */}
                  <div
                    className={`relative min-h-[340px] overflow-hidden rounded-r-[18px] rounded-l-[5px] bg-gradient-to-br ${category.cover} shadow-[8px_12px_25px_rgba(30,40,30,0.18)] transition-all duration-500 group-hover:shadow-[14px_22px_40px_rgba(30,40,30,0.25)]`}
                  >
                    {/* Book Spine */}
                    <div
                      className={`absolute bottom-0 left-0 top-0 z-20 w-[15px] ${category.spine} shadow-[3px_0_7px_rgba(0,0,0,0.15)]`}
                    >
                      <div className="absolute inset-y-0 right-[3px] w-px bg-white/15" />
                    </div>

                    {/* Page Edge */}
                    <div className="absolute bottom-2 right-0 top-2 z-20 w-[7px] rounded-r-sm bg-[#e9dfc9] shadow-inner" />

                    {/* Bookmark */}
                    <div className="absolute right-9 top-0 z-20 flex h-[62px] w-8 justify-center bg-[#d9b779] shadow-md">
                      <div className="absolute -bottom-2 h-4 w-4 rotate-45 bg-[#d9b779]" />
                    </div>

                    {/* Decorative Artwork */}
                    <div className="pointer-events-none absolute inset-0 overflow-hidden">
                      <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full border border-white/10" />
                      <div className="absolute -right-8 -top-8 h-48 w-48 rounded-full border border-white/10" />
                      <div className="absolute -bottom-24 -left-10 h-64 w-64 rounded-full border border-white/10" />

                      <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-black/20" />
                    </div>

                    {/* Book Content */}
                    <div className="relative z-10 flex min-h-[340px] flex-col px-9 py-9 pl-11 sm:px-11 sm:pl-14">
                      {/* Top Label */}
                      <div className="flex items-center justify-between">
                        <span
                          className="text-[9px] font-bold tracking-[3px]"
                          style={{ color: category.accent }}
                        >
                          BOOKNOOK COLLECTION
                        </span>

                        <span
                          className="text-xs font-medium tracking-[2px]"
                          style={{ color: category.accent }}
                        >
                          {category.number}
                        </span>
                      </div>

                      {/* Icon */}
                      <motion.div
                        whileHover={{ rotate: 10, scale: 1.12 }}
                        transition={{ duration: 0.3 }}
                        className="mt-10 flex h-[66px] w-[66px] items-center justify-center rounded-full border border-white/30 bg-white/10 backdrop-blur-sm"
                        style={{ color: category.accent }}
                      >
                        <Icon size={30} strokeWidth={1.4} />
                      </motion.div>

                      {/* Title */}
                      <div className="mt-auto pt-8">
                        <p
                          className="mb-3 text-[9px] font-semibold tracking-[3px]"
                          style={{ color: category.accent }}
                        >
                          {category.subtitle}
                        </p>

                        <h3
                          className="font-serif text-4xl font-semibold tracking-wide sm:text-5xl"
                          style={{ color: "#fffaf0" }}
                        >
                          {category.name}
                        </h3>

                        <div
                          className="mt-5 h-px w-16"
                          style={{ backgroundColor: category.accent }}
                        />

                        <p className="mt-5 max-w-sm text-xs leading-7 text-white/75 sm:text-sm">
                          {category.description}
                        </p>
                      </div>

                      {/* Bottom Label */}
                      <div className="mt-7 flex items-center justify-between border-t border-white/20 pt-5">
                        <span
                          className="text-[9px] font-bold tracking-[2px]"
                          style={{ color: category.accent }}
                        >
                          {category.count.toUpperCase()}
                        </span>

                        <span className="flex h-9 w-9 items-center justify-center rounded-full border border-white/40 text-white transition-all duration-300 group-hover:border-white group-hover:bg-white group-hover:text-[#183f32]">
                          <ArrowUpRight size={18} />
                        </span>
                      </div>
                    </div>

                    {/* Cover Shine */}
                    <div className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-tr from-transparent via-white/[0.04] to-white/[0.12] opacity-60 transition-opacity duration-500 group-hover:opacity-100" />
                  </div>
                </Link>

                {/* Book Base */}
                <div className="mx-3 mt-[3px] h-[5px] rounded-b-md bg-[#d9d0bd] shadow-sm" />
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
