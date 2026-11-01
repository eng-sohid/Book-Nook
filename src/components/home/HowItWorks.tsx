"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Search,
  BookPlus,
  BookCheck,
  ArrowRight,
  Library,
  Sparkles,
} from "lucide-react";

const steps = [
  {
    number: "01",
    title: "Explore Books",
    description:
      "Browse our collection and discover books from different categories.",
    icon: Search,
    label: "DISCOVER",
    color: "#315d43",
    softColor: "bg-[#e2ecdf]",
  },
  {
    number: "02",
    title: "Borrow a Book",
    description:
      "Choose your favorite book and borrow it for a specific period.",
    icon: BookPlus,
    label: "BORROW",
    color: "#a47743",
    softColor: "bg-[#f1e6d5]",
  },
  {
    number: "03",
    title: "Enjoy & Return",
    description: "Enjoy reading your book and return it before the due date.",
    icon: BookCheck,
    label: "EXPERIENCE",
    color: "#526d91",
    softColor: "bg-[#e3eaf2]",
  },
  {
    number: "04",
    title: "Add a Book",
    description:
      "Admins can add new books and keep the library collection updated.",
    icon: Library,
    label: "CONTRIBUTE",
    color: "#98627b",
    softColor: "bg-[#f0e3e9]",
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.18,
    },
  },
};

const itemVariants = {
  hidden: {
    opacity: 0,
    y: 35,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.65,
      ease: "easeOut" as const,
    },
  },
};

export default function HowItWorks() {
  return (
    <section className="relative overflow-hidden bg-[#f4f2eb] px-5 py-24 md:px-8 md:py-28">
      {/* Background */}
      <div className="pointer-events-none absolute -left-40 top-20 h-80 w-80 rounded-full bg-[#dce9dc]/70 blur-[100px]" />
      <div className="pointer-events-none absolute -right-40 bottom-10 h-96 w-96 rounded-full bg-[#f0e2cf]/70 blur-[110px]" />

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

            <p className="text-[10px] font-bold tracking-[4px] text-[#b58749] sm:text-xs">
              YOUR READING JOURNEY
            </p>

            <span className="h-px w-10 bg-[#b58749]" />
          </div>

          <h2 className="text-3xl font-semibold tracking-tight text-[#183f32] sm:text-4xl md:text-5xl">
            How BookNook Works
            <span className="text-[#c18b45]">.</span>
          </h2>

          <p className="mx-auto mt-5 max-w-lg text-sm leading-7 text-gray-500 md:text-base">
            From discovering your next favorite story to growing our collection,
            your journey starts here.
          </p>
        </motion.div>

        {/* Journey Timeline */}
        <div className="relative">
          {/* Connecting Line */}
          <div className="pointer-events-none absolute bottom-16 left-[27px] top-16 w-px bg-gradient-to-b from-[#315d43]/40 via-[#b58749]/40 to-[#98627b]/40 md:bottom-auto md:left-0 md:right-0 md:top-[48px] md:h-px md:w-full" />

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.15 }}
            className="grid gap-12 md:grid-cols-4 md:gap-6"
          >
            {steps.map((step, index) => {
              const Icon = step.icon;

              return (
                <motion.div
                  key={step.number}
                  variants={itemVariants}
                  className="group relative"
                >
                  {/* Timeline Number and Icon */}
                  <div className="relative z-10 flex items-center gap-5 md:mb-10 md:flex-col md:items-start">
                    <motion.div
                      whileHover={{
                        scale: 1.12,
                        rotate: -8,
                      }}
                      transition={{ duration: 0.3 }}
                      className={`relative flex h-[58px] w-[58px] shrink-0 items-center justify-center rounded-full border-[5px] border-[#f4f2eb] ${step.softColor} shadow-[0_5px_20px_rgba(30,50,35,0.08)] transition-shadow duration-300 group-hover:shadow-[0_8px_25px_rgba(30,50,35,0.15)] md:h-[76px] md:w-[76px]`}
                      style={{ color: step.color }}
                    >
                      <Icon size={27} strokeWidth={1.6} />

                      <span
                        className="absolute -right-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full border-2 border-[#f4f2eb] text-[9px] font-bold text-white"
                        style={{ backgroundColor: step.color }}
                      >
                        {index + 1}
                      </span>
                    </motion.div>

                    <div className="flex items-center gap-3 md:mt-1">
                      <span
                        className="text-4xl font-semibold tracking-tighter opacity-15 md:text-5xl"
                        style={{ color: step.color }}
                      >
                        {step.number}
                      </span>

                      <span
                        className="text-[9px] font-bold tracking-[2.5px]"
                        style={{ color: step.color }}
                      >
                        {step.label}
                      </span>
                    </div>
                  </div>

                  {/* Journey Content */}
                  <div className="ml-[78px] border-b border-[#183f32]/10 pb-7 md:ml-0 md:border-b-0 md:pb-0">
                    <h3 className="text-xl font-semibold tracking-tight text-[#183f32] transition-colors duration-300 group-hover:text-[#a47743] sm:text-2xl">
                      {step.title}
                    </h3>

                    <p className="mt-3 max-w-[260px] text-sm leading-7 text-[#70766e]">
                      {step.description}
                    </p>

                    <motion.div
                      initial={{ width: 28 }}
                      whileInView={{ width: 55 }}
                      viewport={{ once: true }}
                      transition={{
                        duration: 0.6,
                        delay: index * 0.12,
                      }}
                      className="mt-6 h-[2px] rounded-full"
                      style={{ backgroundColor: step.color }}
                    />
                  </div>

                  {/* Decorative Sparkle */}
                  <Sparkles
                    size={15}
                    className="pointer-events-none absolute right-4 top-2 opacity-0 transition-all duration-500 group-hover:-translate-y-2 group-hover:opacity-40"
                    style={{ color: step.color }}
                  />
                </motion.div>
              );
            })}
          </motion.div>
        </div>

        {/* Bottom Message */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="mt-20 flex flex-col items-center justify-between gap-6 rounded-[28px] border border-[#e5e1d6] bg-white/60 p-7 shadow-sm backdrop-blur-sm sm:flex-row sm:px-10"
        >
          <div>
            <p className="font-serif text-2xl font-semibold text-[#183f32] sm:text-3xl">
              Ready for your next chapter?
            </p>

            <p className="mt-2 text-sm text-gray-500">
              Your next favorite book is waiting for you.
            </p>
          </div>

          <Link
            href="/books"
            className="group inline-flex shrink-0 items-center gap-3 rounded-full bg-[#183f32] px-7 py-4 text-sm font-semibold text-white shadow-lg shadow-[#183f32]/10 transition-all duration-300 hover:-translate-y-1 hover:bg-[#245743] hover:shadow-xl"
          >
            Start Exploring
            <ArrowRight
              size={17}
              className="transition-transform duration-300 group-hover:translate-x-1"
            />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
