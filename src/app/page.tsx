import { Suspense } from "react";

import HeroSlider from "@/components/home/HeroSlider";
import NewArrivals from "@/components/home/NewArrivals";
import Categories from "@/components/home/Categories";
import HowItWorks from "@/components/home/HowItWorks";

export default function HomePage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#faf9f6] text-[#183b2b] selection:bg-[#d9e8d7] selection:text-[#183b2b]">
      {/* Background Decoration */}
      <div className="pointer-events-none absolute left-0 top-0 -z-0 h-[600px] w-full overflow-hidden">
        <div className="absolute -left-40 -top-40 h-[450px] w-[450px] rounded-full bg-[#dce9d9]/40 blur-[100px]" />
        <div className="absolute -right-40 top-20 h-[400px] w-[400px] rounded-full bg-[#eee6d4]/50 blur-[100px]" />
      </div>

      {/* Hero Section */}
      <section className="relative z-10">
        <Suspense
          fallback={
            <div className="mx-auto mt-6 h-[420px] max-w-7xl animate-pulse rounded-[32px] bg-[#eeece5]" />
          }
        >
          <HeroSlider />
        </Suspense>
      </section>

      {/* New Arrivals */}
      <section className="relative z-10 scroll-mt-24">
        <NewArrivals />
      </section>

      {/* Categories */}
      <section className="relative z-10 scroll-mt-24">
        <Categories />
      </section>

      {/* How It Works */}
      <section className="relative z-10 scroll-mt-24">
        <HowItWorks />
      </section>
    </main>
  );
}
