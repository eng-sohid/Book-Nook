"use client";

import Link from "next/link";
import { ArrowRight, BookOpen, Sparkles } from "lucide-react";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, EffectFade } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/effect-fade";

const slides = [
  {
    tag: "YOUR NEXT CHAPTER STARTS HERE",
    title: "A World of Stories,",
    highlight: "One Book Away.",
    description:
      "Discover beautiful stories, explore new ideas, and find your next favorite book in your little corner of the library.",
    image:
      "https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=1600&q=85",
    button: "Browse Books",
    number: "01",
  },
  {
    tag: "EXPLORE. DISCOVER. READ.",
    title: "Find Stories That",
    highlight: "Stay With You.",
    description:
      "From timeless classics to exciting new discoveries, there is always something wonderful waiting for you.",
    image:
      "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=1600&q=85",
    button: "Explore Collection",
    number: "02",
  },
  {
    tag: "READ MORE. DREAM BIGGER.",
    title: "Your Little Escape",
    highlight: "Between Pages.",
    description:
      "Take a break from the everyday and step into a world of imagination, knowledge, and inspiration.",
    image:
      "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=1600&q=85",
    button: "Find Your Book",
    number: "03",
  },
  {
    tag: "WHERE EVERY BOOK HAS A STORY",
    title: "A Universe of Ideas,",
    highlight: "Waiting for You.",
    description:
      "Explore a beautiful collection of books, discover fresh perspectives, and let every page take you somewhere new.",
    image:
      "https://images.unsplash.com/photo-1506880018603-83d5b814b5a6?w=1600&q=85",
    button: "Explore Library",
    number: "04",
  },
  {
    tag: "MAKE EVERY MOMENT COUNT",
    title: "Escape Into",
    highlight: "A Good Story.",
    description:
      "Find your quiet moment, turn a page, and experience the magic of stories that stay with you forever.",
    image:
      "https://images.unsplash.com/photo-1519682337058-a94d519337bc?w=1600&q=85",
    button: "Discover Books",
    number: "05",
  },
];

export default function HeroSlider() {
  return (
    <section className="bg-[#F5F6F8] px-4 pb-12 pt-5 md:px-8 md:pt-7">
      <div className="hero-slider mx-auto max-w-7xl overflow-hidden rounded-[24px] shadow-[0_25px_80px_-25px_rgba(38,55,70,0.25)] md:rounded-[32px]">
        <Swiper
          modules={[Autoplay, Pagination, EffectFade]}
          effect="fade"
          fadeEffect={{ crossFade: true }}
          loop
          speed={1100}
          autoplay={{
            delay: 5500,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          }}
          pagination={{ clickable: true }}
          className="booknook-slider"
        >
          {slides.map((slide) => (
            <SwiperSlide key={slide.number}>
              <div className="hero-slide relative flex min-h-[540px] items-center overflow-hidden bg-[#263746] px-7 py-20 md:min-h-[600px] md:px-16 lg:px-20">
                {/* Background Image */}
                <div
                  className="hero-background absolute inset-0 bg-cover bg-center"
                  style={{
                    backgroundImage: `url("${slide.image}")`,
                  }}
                />

                {/* Slate Overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-[#202F3D]/95 via-[#263746]/80 to-[#263746]/25" />

                <div className="absolute inset-0 bg-gradient-to-t from-[#202F3D]/45 via-transparent to-transparent" />

                {/* Decorative Glow */}
                <div className="pointer-events-none absolute -right-32 top-1/2 h-[400px] w-[400px] -translate-y-1/2 rounded-full bg-[#D5B985]/10 blur-[100px]" />

                {/* Content */}
                <div className="hero-content relative z-10 max-w-2xl pb-7 text-white">
                  <div className="hero-item mb-7 inline-flex items-center gap-2.5 rounded-full border border-white/20 bg-white/[0.09] px-4 py-2.5 shadow-lg backdrop-blur-xl">
                    <Sparkles size={15} className="text-[#D5B985]" />

                    <span className="text-[9px] font-semibold tracking-[2px] text-[#E9D8B7] md:text-[11px] md:tracking-[2.5px]">
                      {slide.tag}
                    </span>
                  </div>

                  <h1 className="hero-item text-[42px] font-semibold leading-[1.12] tracking-[-1.8px] md:text-6xl md:leading-[1.08] lg:text-[72px]">
                    {slide.title}
                    <br />
                    <span className="bg-gradient-to-r from-[#F0DDBB] via-[#D5B985] to-[#B99B6C] bg-clip-text text-transparent">
                      {slide.highlight}
                    </span>
                  </h1>

                  <p className="hero-item mt-6 max-w-lg text-sm leading-7 text-white/75 md:text-base md:leading-8">
                    {slide.description}
                  </p>

                  <div className="hero-item mt-9 flex flex-wrap items-center gap-5">
                    <Link
                      href="/books"
                      className="group inline-flex items-center gap-3 rounded-xl bg-[#D5B985] px-6 py-4 text-sm font-bold text-[#263746] shadow-[0_8px_30px_rgba(213,185,133,0.18)] transition-all duration-500 hover:-translate-y-1 hover:bg-white hover:shadow-[0_12px_35px_rgba(255,255,255,0.2)] active:scale-95"
                    >
                      <BookOpen size={18} />
                      {slide.button}
                      <ArrowRight
                        size={17}
                        className="transition-transform duration-300 group-hover:translate-x-1"
                      />
                    </Link>

                    <span className="text-[9px] font-medium tracking-[2px] text-white/55 md:text-[10px]">
                      DISCOVER YOUR NEXT STORY
                    </span>
                  </div>
                </div>

                {/* Slide Number */}
                <div className="absolute bottom-12 right-12 z-10 hidden items-end gap-3 md:flex">
                  <span className="text-6xl font-light tracking-tighter text-white/35">
                    {slide.number}
                  </span>
                  <span className="mb-2 h-px w-12 bg-[#D5B985]/70" />
                </div>

                {/* Progress */}
                <div className="absolute bottom-0 left-0 h-[3px] w-full bg-white/10">
                  <div className="hero-progress h-full bg-[#D5B985]" />
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      <style jsx global>{`
        .booknook-slider {
          overflow: hidden;
          border-radius: 24px;
        }

        @media (min-width: 768px) {
          .booknook-slider {
            border-radius: 32px;
          }
        }

        .hero-background {
          transform: scale(1.08);
        }

        .swiper-slide-active .hero-background {
          animation: heroZoom 7s ease-out forwards;
        }

        @keyframes heroZoom {
          from {
            transform: scale(1.08);
          }
          to {
            transform: scale(1);
          }
        }

        .hero-item {
          opacity: 0;
          transform: translateY(28px);
        }

        .swiper-slide-active .hero-item {
          animation: heroReveal 0.85s cubic-bezier(0.22, 1, 0.36, 1) forwards;
        }

        .swiper-slide-active .hero-item:nth-child(1) {
          animation-delay: 0.15s;
        }

        .swiper-slide-active .hero-item:nth-child(2) {
          animation-delay: 0.3s;
        }

        .swiper-slide-active .hero-item:nth-child(3) {
          animation-delay: 0.45s;
        }

        .swiper-slide-active .hero-item:nth-child(4) {
          animation-delay: 0.6s;
        }

        .booknook-slider .swiper-pagination {
          bottom: 25px !important;
          padding-left: 28px;
          text-align: left;
        }

        .booknook-slider .swiper-pagination-bullet {
          width: 20px;
          height: 5px;
          margin: 0 4px !important;
          border-radius: 20px;
          background: white;
          opacity: 0.4;
          transition: all 0.4s ease;
        }

        .booknook-slider .swiper-pagination-bullet-active {
          width: 40px;
          background: #d5b985;
          opacity: 1;
        }

        .hero-progress {
          width: 0;
        }

        .swiper-slide-active .hero-progress {
          animation: progressFill 5.5s linear forwards;
        }

        @keyframes progressFill {
          to {
            width: 100%;
          }
        }

        @keyframes heroReveal {
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .swiper-slide-active .hero-background,
          .swiper-slide-active .hero-item,
          .swiper-slide-active .hero-progress {
            animation: none;
          }

          .hero-item {
            opacity: 1;
            transform: none;
          }
        }
      `}</style>
    </section>
  );
}
