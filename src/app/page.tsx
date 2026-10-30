import Categories from "@/components/home/Categories";
import HeroSlider from "@/components/home/HeroSlider";
import NewArrivals from "@/components/home/NewArrivals";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#faf9f6]">
      <HeroSlider />
      <NewArrivals />
      <Categories />
    </main>
  );
}
