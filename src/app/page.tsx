import HeroSlider from "@/components/home/HeroSlider";
import NewArrivals from "@/components/home/NewArrivals";
import Categories from "@/components/home/Categories";
import HowItWorks from "@/components/home/HowItWorks";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#faf9f6]">
      <HeroSlider />
      <NewArrivals />
      <Categories />
      <HowItWorks />
    </main>
  );
}
