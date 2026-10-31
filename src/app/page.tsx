import { Suspense } from "react";

import HeroSlider from "@/components/home/HeroSlider";
import NewArrivals from "@/components/home/NewArrivals";
import Categories from "@/components/home/Categories";
import HowItWorks from "@/components/home/HowItWorks";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#faf9f6]">
      <Suspense
        fallback={
          <div className="mx-auto h-[400px] max-w-7xl animate-pulse rounded-[28px] bg-[#eeece5]" />
        }
      >
        <HeroSlider />
      </Suspense>

      <NewArrivals />
      <Categories />
      <HowItWorks />
    </main>
  );
}
