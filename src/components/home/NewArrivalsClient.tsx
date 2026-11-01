"use client";

import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, ArrowUpRight, Sparkles } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperType } from "swiper";

import "swiper/css";

interface Book {
  _id: string;
  title: string;
  author: string;
  category: string;
  image: string;
}

interface NewArrivalsClientProps {
  books: Book[];
}

export default function NewArrivalsClient({ books }: NewArrivalsClientProps) {
  const [swiper, setSwiper] = useState<SwiperType | null>(null);
  const [progress, setProgress] = useState(0);

  return (
    <div className="relative">
      {/* Books Slider */}
      <Swiper
        onSwiper={(instance) => {
          setSwiper(instance);
          setProgress(instance.progress);
        }}
        onProgress={(instance) => {
          setProgress(instance.progress);
        }}
        onSlideChange={(instance) => {
          setProgress(instance.progress);
        }}
        slidesPerView={1}
        slidesPerGroup={1}
        spaceBetween={25}
        grabCursor={true}
        speed={750}
        breakpoints={{
          640: {
            slidesPerView: 2,
            slidesPerGroup: 2,
            spaceBetween: 35,
          },
        }}
        className="!overflow-visible"
      >
        {books.map((book, index) => (
          <SwiperSlide key={book._id} className="!h-auto">
            <motion.div
              initial={{ opacity: 0, y: 35 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.1 }}
              transition={{
                duration: 0.65,
                delay: index * 0.07,
              }}
              className="group flex h-full flex-col items-center"
            >
              <Link
                href={`/books/${book._id}`}
                aria-label={`View details of ${book.title}`}
                className="flex w-full flex-col items-center outline-none"
              >
                {/* 3D Book Scene */}
                <div className="relative flex h-[390px] w-full items-center justify-center [perspective:1200px] sm:h-[430px]">
                  {/* Book Shadow */}
                  <div className="absolute bottom-8 left-1/2 h-8 w-[185px] -translate-x-1/2 rounded-[50%] bg-[#183f32]/20 blur-xl transition-all duration-500 group-hover:w-[220px]" />

                  {/* Book */}
                  <motion.div
                    whileHover={{
                      y: -12,
                      rotateY: -8,
                      rotateZ: -1.5,
                      scale: 1.035,
                    }}
                    transition={{
                      type: "spring",
                      stiffness: 180,
                      damping: 18,
                    }}
                    className="relative z-10 h-[315px] w-[220px] [transform-style:preserve-3d] sm:h-[345px] sm:w-[240px]"
                  >
                    {/* Page Edge */}
                    <div className="absolute -right-[14px] top-[7px] h-[calc(100%-14px)] w-[16px] overflow-hidden rounded-r-sm border-y border-r border-[#c9bfa9] bg-[#e9dfca] shadow-[3px_4px_7px_rgba(0,0,0,0.13)]">
                      <div className="absolute inset-0 bg-[repeating-linear-gradient(to_bottom,#d7ccb7_0px,#f8f2e6_2px,#d7ccb7_3px)]" />
                    </div>

                    {/* Spine */}
                    <div className="absolute -left-[13px] top-0 h-full w-[18px] rounded-l-sm bg-[#17382d] shadow-[-5px_5px_12px_rgba(0,0,0,0.17)]" />

                    {/* Front Cover */}
                    <div className="relative h-full w-full overflow-hidden rounded-[3px_7px_7px_3px] border border-white/15 bg-[#183f32] shadow-[8px_12px_25px_rgba(0,0,0,0.23)]">
                      <img
                        src={book.image}
                        alt={book.title}
                        className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />

                      <div className="absolute inset-0 bg-gradient-to-t from-[#102b23]/90 via-[#102b23]/20 to-[#102b23]/10" />

                      <div className="pointer-events-none absolute inset-[7px] border border-white/20" />

                      <div className="pointer-events-none absolute inset-[15px] border border-[#e5c995]/50" />

                      {/* Cover Text */}
                      <div className="absolute inset-0 flex flex-col items-center justify-between px-6 py-7 text-center">
                        <div className="flex flex-col items-center">
                          <span className="text-[9px] font-bold tracking-[3px] text-[#f1d8a9]">
                            BOOKNOOK EDITION
                          </span>
                          <div className="mt-3 h-px w-12 bg-[#e5c995]/70" />
                        </div>

                        <div className="flex max-w-full flex-col items-center">
                          <Sparkles size={22} className="mb-4 text-[#f1d8a9]" />

                          <h3 className="line-clamp-3 font-serif text-2xl font-bold leading-tight text-white drop-shadow-lg sm:text-[27px]">
                            {book.title}
                          </h3>

                          <div className="mt-4 h-px w-14 bg-[#e5c995]" />

                          <p className="mt-4 line-clamp-1 text-xs font-medium text-white/85">
                            {book.author}
                          </p>
                        </div>

                        <div className="flex flex-col items-center">
                          <span className="rounded-full border border-[#e5c995]/60 px-3 py-1.5 text-[8px] font-bold uppercase tracking-[2px] text-[#f1d8a9]">
                            {book.category}
                          </span>

                          <p className="mt-4 text-[8px] font-bold tracking-[3px] text-white/70">
                            A STORY TO REMEMBER
                          </p>
                        </div>
                      </div>

                      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent opacity-60" />
                    </div>
                  </motion.div>

                  {/* New Badge */}
                  <div className="absolute right-[8%] top-7 z-20 flex rotate-6 items-center gap-1.5 rounded-full border border-[#d6c19a] bg-[#fffaf0] px-3 py-2 text-[9px] font-bold tracking-wider text-[#183f32] shadow-lg transition-transform duration-500 group-hover:rotate-0">
                    <Sparkles size={12} className="text-[#b58749]" />
                    NEW
                  </div>

                  {/* Hover Hint */}
                  <div className="absolute bottom-1 left-1/2 z-20 flex -translate-x-1/2 translate-y-3 items-center gap-2 whitespace-nowrap rounded-full bg-[#183f32] px-4 py-2.5 text-[10px] font-bold text-white opacity-0 shadow-lg transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                    View Book Details
                    <ArrowUpRight size={14} />
                  </div>
                </div>

                {/* Book Information */}
                <div className="mt-4 w-full max-w-[290px] pb-4 text-center">
                  <p className="mb-2 text-[9px] font-bold uppercase tracking-[3px] text-[#b58749]">
                    {book.category}
                  </p>

                  <h3 className="line-clamp-1 font-serif text-xl font-bold text-[#183f32] transition-colors duration-300 group-hover:text-[#a8793f]">
                    {book.title}
                  </h3>

                  <p className="mt-2 text-sm text-[#858078]">
                    By {book.author}
                  </p>

                  <div className="mx-auto mt-4 flex items-center justify-center gap-2 text-[10px] font-bold tracking-[1.5px] text-[#183f32]/60 transition-colors group-hover:text-[#b58749]">
                    DISCOVER THIS BOOK
                    <ArrowUpRight size={13} />
                  </div>
                </div>
              </Link>
            </motion.div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Slider Navigation */}
      <div className="mt-10 flex items-center justify-between gap-6">
        {/* Progress */}
        <div className="h-[3px] max-w-[230px] flex-1 overflow-hidden rounded-full bg-[#183f32]/10 sm:max-w-[350px]">
          <div
            className="h-full rounded-full bg-[#b58749] transition-transform duration-500"
            style={{
              width: `${Math.max(progress * 100, 0)}%`,
            }}
          />
        </div>

        {/* Navigation Buttons */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => swiper?.slidePrev()}
            disabled={!swiper || swiper.isBeginning}
            aria-label="Previous books"
            className="flex h-11 w-11 items-center justify-center rounded-full border border-[#183f32]/10 bg-white text-[#183f32] shadow-sm transition-all duration-300 hover:border-[#183f32] hover:bg-[#183f32] hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
          >
            <ArrowLeft size={18} />
          </button>

          <button
            type="button"
            onClick={() => swiper?.slideNext()}
            disabled={!swiper || swiper.isEnd}
            aria-label="Next books"
            className="flex h-11 w-11 items-center justify-center rounded-full border border-[#183f32]/10 bg-white text-[#183f32] shadow-sm transition-all duration-300 hover:border-[#183f32] hover:bg-[#183f32] hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
          >
            <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
