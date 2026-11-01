"use client";

import Link from "next/link";
import { ArrowDown, ArrowRight, BookOpen, Sparkles } from "lucide-react";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, EffectFade } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/effect-fade";

const slides = [
  {
    tag: "A NEW WORLD BETWEEN PAGES",
    title: "Stories That",
    highlight: "Shape Your World.",
    description:
      "Every book opens a new door. Explore timeless classics, discover fresh ideas, and find stories worth remembering.",
    image:
      "https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=1400&q=90",
    button: "Explore Collection",
    number: "01",
    category: "THE ART OF READING",
  },
  {
    tag: "EXPLORE. DISCOVER. GROW.",
    title: "Find Your Next",
    highlight: "Great Adventure.",
    description:
      "From unforgettable fiction to inspiring knowledge, your next favorite read is waiting to be discovered.",
    image:
      "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=1400&q=90",
    button: "Discover Books",
    number: "02",
    category: "ENDLESS POSSIBILITIES",
  },
  {
    tag: "A LITTLE ESCAPE EVERY DAY",
    title: "Get Lost In",
    highlight: "Beautiful Stories.",
    description:
      "Slow down, turn a page, and let your imagination travel beyond the ordinary. Your reading journey starts here.",
    image:
      "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=1400&q=90",
    button: "Find Your Book",
    number: "03",
    category: "YOUR QUIET CORNER",
  },
  {
    tag: "KNOWLEDGE NEVER ENDS",
    title: "Read More.",
    highlight: "Become More.",
    description:
      "Build new perspectives, learn something meaningful, and make every reading moment count.",
    image:
      "https://images.unsplash.com/photo-1506880018603-83d5b814b5a6?w=1400&q=90",
    button: "Browse Library",
    number: "04",
    category: "A JOURNEY OF KNOWLEDGE",
  },
  {
    tag: "YOUR STORY STARTS HERE",
    title: "One Page.",
    highlight: "Endless Worlds.",
    description:
      "A wonderful story can change an ordinary day. Find the book that speaks to you at BookNook.",
    image:
      "https://images.unsplash.com/photo-1519682337058-a94d519337bc?w=1400&q=90",
    button: "Start Exploring",
    number: "05",
    category: "BOOKS FOR EVERY MOOD",
  },
];

export default function HeroSlider() {
  return (
    <section className="relative overflow-hidden bg-[#f5f4ef] px-4 pb-10 pt-5 md:px-8 md:pb-14 md:pt-8">
      {/* Background decoration */}
      <div className="pointer-events-none absolute -left-40 top-20 h-80 w-80 rounded-full bg-[#d5b985]/10 blur-[100px]" />

      <div className="relative mx-auto max-w-[1400px]">
        <Swiper
          modules={[Autoplay, Pagination, EffectFade]}
          effect="fade"
          fadeEffect={{ crossFade: true }}
          loop={true}
          speed={700}
          autoplay={{
            delay: 5000,
            disableOnInteraction: false,
            pauseOnMouseEnter: false,
            waitForTransition: true,
          }}
          pagination={{ clickable: true }}
          className="booknook-editorial-slider"
        >
          {slides.map((slide) => (
            <SwiperSlide key={slide.number}>
              <div className="editorial-slide relative grid min-h-[590px] overflow-hidden rounded-[24px] bg-[#17382d] text-white shadow-[0_30px_80px_-25px_rgba(23,56,45,0.35)] md:min-h-[610px] md:grid-cols-[1.02fr_0.98fr] md:rounded-[32px]">
                {/* Left content */}
                <div className="relative z-20 flex flex-col justify-center px-7 pb-24 pt-16 md:px-12 md:py-20 lg:px-[76px]">
                  {/* Decorative circles */}
                  <div className="pointer-events-none absolute -left-24 top-1/2 h-72 w-72 -translate-y-1/2 rounded-full border border-white/[0.07]" />

                  <div className="pointer-events-none absolute -left-16 top-1/2 h-56 w-56 -translate-y-1/2 rounded-full border border-white/[0.06]" />

                  <div className="hero-content relative">
                    {/* Tag */}
                    <div className="hero-tag mb-8 inline-flex items-center gap-2.5 rounded-full border border-[#d5b985]/30 bg-[#d5b985]/10 px-4 py-2.5">
                      <Sparkles size={13} className="text-[#e5c995]" />

                      <span className="text-[9px] font-bold tracking-[2px] text-[#e5c995] md:text-[10px]">
                        {slide.tag}
                      </span>
                    </div>

                    <p className="hero-small mb-4 text-[10px] font-semibold tracking-[3px] text-white/45">
                      BOOKNOOK — YOUR LITTLE LIBRARY
                    </p>

                    {/* Heading */}
                    <h1 className="hero-title max-w-[650px] text-[44px] font-medium leading-[1.1] tracking-[-2px] sm:text-[54px] md:text-[58px] lg:text-[70px]">
                      {slide.title}
                      <br />
                      <span className="font-semibold text-[#d9bd87]">
                        {slide.highlight}
                      </span>
                    </h1>

                    {/* Description */}
                    <p className="hero-description mt-7 max-w-[430px] text-[13px] leading-7 text-white/65 md:text-[14px] md:leading-8">
                      {slide.description}
                    </p>

                    {/* Buttons */}
                    <div className="hero-button mt-9 flex flex-wrap items-center gap-5">
                      <Link
                        href="/books"
                        className="group inline-flex items-center gap-3 rounded-full bg-[#d9bd87] px-6 py-4 text-[12px] font-bold text-[#17382d] shadow-lg shadow-black/10 transition-all duration-300 hover:-translate-y-1 hover:bg-[#f0dfbb] hover:shadow-xl active:scale-95"
                      >
                        <BookOpen size={17} />

                        {slide.button}

                        <ArrowRight
                          size={16}
                          className="transition-transform duration-300 group-hover:translate-x-1"
                        />
                      </Link>

                      <Link
                        href="/books"
                        className="group inline-flex items-center gap-2 text-[10px] font-semibold tracking-[1.8px] text-white/55 transition hover:text-[#e5c995]"
                      >
                        VIEW ALL BOOKS
                        <ArrowDown
                          size={13}
                          className="transition-transform group-hover:translate-y-1"
                        />
                      </Link>
                    </div>
                  </div>

                  {/* Bottom category */}
                  <div className="absolute bottom-8 left-7 flex items-center gap-3 md:bottom-10 md:left-12 lg:left-[76px]">
                    <span className="h-px w-8 bg-[#d9bd87]" />

                    <span className="text-[9px] font-medium tracking-[2px] text-white/40">
                      {slide.category}
                    </span>
                  </div>
                </div>

                {/* Right image section */}
                <div className="hero-visual relative min-h-[330px] overflow-hidden md:min-h-full">
                  <div
                    className="hero-image absolute inset-0 bg-cover bg-center"
                    style={{
                      backgroundImage: `url("${slide.image}")`,
                    }}
                  />

                  {/* Image overlays */}
                  <div className="absolute inset-0 bg-gradient-to-r from-[#17382d]/30 via-transparent to-transparent" />

                  <div className="absolute inset-0 bg-gradient-to-t from-[#17382d]/65 via-transparent to-[#17382d]/10" />

                  {/* Gold frame */}
                  <div className="pointer-events-none absolute inset-5 rounded-[18px] border border-[#e5c995]/25 md:inset-8 md:rounded-[22px]" />

                  {/* Floating book card */}
                  <div className="hero-floating absolute bottom-12 left-7 right-7 z-10 flex items-center gap-4 rounded-2xl border border-white/20 bg-[#17382d]/65 p-4 shadow-2xl backdrop-blur-xl sm:left-auto sm:right-12 sm:max-w-[280px] md:bottom-16 md:right-12">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#d9bd87] text-[#17382d]">
                      <BookOpen size={23} />
                    </div>

                    <div>
                      <p className="text-[9px] font-semibold tracking-[2px] text-[#d9bd87]">
                        YOUR NEXT CHAPTER
                      </p>

                      <p className="mt-1 text-sm font-semibold text-white">
                        Starts with a book.
                      </p>
                    </div>
                  </div>

                  {/* Slide number */}
                  <div className="absolute right-10 top-10 z-10 hidden text-right md:block">
                    <p className="text-[10px] tracking-[3px] text-white/60">
                      COLLECTION
                    </p>

                    <p className="mt-1 text-5xl font-light tracking-tighter text-white/80">
                      {slide.number}
                    </p>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="hero-progress absolute bottom-0 left-0 z-30 h-[3px] w-full bg-white/10">
                  <div className="hero-progress-fill h-full bg-[#d9bd87]" />
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Bottom slider label */}
        <div className="mt-5 flex items-center justify-between px-1">
          <p className="text-[9px] font-semibold tracking-[2.5px] text-[#8b8b7e]">
            A WORLD OF BOOKS, JUST FOR YOU
          </p>

          <p className="text-[9px] font-semibold tracking-[2px] text-[#8b8b7e]">
            BOOKNOOK / 2026
          </p>
        </div>
      </div>

      <style jsx global>{`
        .booknook-editorial-slider {
          overflow: hidden;
          border-radius: 24px;
        }

        @media (min-width: 768px) {
          .booknook-editorial-slider {
            border-radius: 32px;
          }
        }

        .hero-image {
          transform: scale(1.08);
          transition: transform 3.7s cubic-bezier(0.2, 0.7, 0.2, 1);
        }

        .swiper-slide-active .hero-image {
          transform: scale(1);
        }

        .hero-tag,
        .hero-small,
        .hero-title,
        .hero-description,
        .hero-button {
          opacity: 0;
          transform: translateY(25px);
        }

        .swiper-slide-active .hero-tag {
          animation: editorialReveal 0.7s 0.1s forwards;
        }

        .swiper-slide-active .hero-small {
          animation: editorialReveal 0.7s 0.2s forwards;
        }

        .swiper-slide-active .hero-title {
          animation: editorialReveal 0.7s 0.3s forwards;
        }

        .swiper-slide-active .hero-description {
          animation: editorialReveal 0.7s 0.4s forwards;
        }

        .swiper-slide-active .hero-button {
          animation: editorialReveal 0.7s 0.5s forwards;
        }

        .hero-floating {
          opacity: 0;
          transform: translateY(20px);
        }

        .swiper-slide-active .hero-floating {
          animation: editorialReveal 0.7s 0.4s forwards;
        }

        .hero-progress-fill {
          width: 0;
        }

        .swiper-slide-active .hero-progress-fill {
          animation: editorialProgress 3s linear forwards;
        }

        .booknook-editorial-slider .swiper-pagination {
          bottom: 30px !important;
          left: 7px !important;
          width: auto !important;
          text-align: left;
          z-index: 40;
        }

        .booknook-editorial-slider .swiper-pagination-bullet {
          width: 19px;
          height: 4px;
          margin: 0 4px !important;
          border-radius: 10px;
          background: #fff;
          opacity: 0.3;
          transition: all 0.4s ease;
        }

        .booknook-editorial-slider .swiper-pagination-bullet-active {
          width: 38px;
          background: #d9bd87;
          opacity: 1;
        }

        @keyframes editorialReveal {
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes editorialProgress {
          to {
            width: 100%;
          }
        }

        @media (max-width: 767px) {
          .booknook-editorial-slider .swiper-pagination {
            bottom: 18px !important;
            left: 20px !important;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .hero-image,
          .hero-tag,
          .hero-small,
          .hero-title,
          .hero-description,
          .hero-button,
          .hero-floating,
          .hero-progress-fill {
            animation: none !important;
            transition: none !important;
            opacity: 1;
            transform: none;
          }
        }
      `}</style>
    </section>
  );
}
