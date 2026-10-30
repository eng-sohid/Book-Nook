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
];

export default function HeroSlider() {
  return (
    <section className="bg-[#faf9f6] px-4 pb-12 pt-5 md:px-8">
      <div className="mx-auto max-w-7xl overflow-hidden rounded-[28px]">
        <Swiper
          modules={[Autoplay, Pagination, EffectFade]}
          effect="fade"
          loop
          autoplay={{
            delay: 5000,
            disableOnInteraction: false,
          }}
          pagination={{
            clickable: true,
          }}
          className="booknook-slider"
        >
          {slides.map((slide) => (
            <SwiperSlide key={slide.number}>
              <div
                className="relative flex min-h-[510px] items-center bg-cover bg-center px-7 py-16 md:min-h-[570px] md:px-16 lg:px-20"
                style={{
                  backgroundImage: `url(${slide.image})`,
                }}
              >
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-[#102c23]/95 via-[#102c23]/75 to-[#102c23]/10" />

                {/* Content */}
                <div className="relative z-10 max-w-2xl pb-8 text-white">
                  <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-2 backdrop-blur-sm">
                    <Sparkles size={14} className="text-[#e7bd77]" />
                    <span className="text-[10px] font-semibold tracking-[2px] text-[#f0d6a9] md:text-xs">
                      {slide.tag}
                    </span>
                  </div>

                  <h1 className="text-4xl font-bold leading-[1.15] tracking-tight md:text-6xl lg:text-7xl">
                    {slide.title}
                    <br />
                    <span className="text-[#e6bc79]">{slide.highlight}</span>
                  </h1>

                  <p className="mt-6 max-w-lg text-sm leading-7 text-white/75 md:text-base md:leading-8">
                    {slide.description}
                  </p>

                  <div className="mt-9 flex flex-wrap items-center gap-5">
                    <Link
                      href="/books"
                      className="inline-flex items-center gap-3 rounded-xl bg-[#e6bc79] px-6 py-4 text-sm font-bold text-[#183f32] transition duration-300 hover:-translate-y-1 hover:bg-white"
                    >
                      <BookOpen size={18} />
                      {slide.button}
                      <ArrowRight size={17} />
                    </Link>

                    <span className="text-xs tracking-widest text-white/60">
                      DISCOVER YOUR NEXT STORY
                    </span>
                  </div>
                </div>

                {/* Slide Number */}
                <div className="absolute bottom-12 right-8 z-10 hidden text-5xl font-light text-white/40 md:block">
                  {slide.number}
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      <style jsx global>{`
        .booknook-slider .swiper-pagination {
          bottom: 24px !important;
          text-align: left;
          padding-left: 30px;
        }

        .booknook-slider .swiper-pagination-bullet {
          width: 22px;
          height: 5px;
          border-radius: 10px;
          background: white;
          opacity: 0.45;
        }

        .booknook-slider .swiper-pagination-bullet-active {
          width: 38px;
          background: #e6bc79;
          opacity: 1;
        }
      `}</style>
    </section>
  );
}
