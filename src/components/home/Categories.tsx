import Link from "next/link";
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
    description: "Stories that spark imagination.",
    count: "Explore stories",
    icon: BookOpen,
    color: "bg-[#e9eee6]",
  },
  {
    name: "Science",
    description: "Discover the world of knowledge.",
    count: "Explore knowledge",
    icon: FlaskConical,
    color: "bg-[#e9edf2]",
  },
  {
    name: "History",
    description: "Travel through time and events.",
    count: "Explore history",
    icon: Landmark,
    color: "bg-[#f3eadf]",
  },
  {
    name: "Kids",
    description: "Little books, big adventures.",
    count: "Explore adventures",
    icon: Baby,
    color: "bg-[#f3e9ec]",
  },
];

export default function Categories() {
  return (
    <section className="bg-white px-5 py-20 md:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 text-center">
          <p className="mb-3 text-xs font-bold tracking-[3px] text-[#b58749]">
            FIND YOUR INTEREST
          </p>

          <h2 className="text-3xl font-bold text-[#183f32] md:text-4xl">
            Explore Categories<span className="text-[#c18b45]">.</span>
          </h2>

          <p className="mx-auto mt-4 max-w-lg text-sm leading-7 text-gray-500">
            Whatever you love to read, find a collection that matches your
            curiosity.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4 lg:gap-6">
          {categories.map((category) => {
            const Icon = category.icon;

            return (
              <Link
                key={category.name}
                href={`/books?category=${category.name}`}
                className={`group rounded-2xl border border-[#eae7df] ${category.color} p-5 transition duration-300 hover:-translate-y-2 hover:shadow-lg sm:p-7`}
              >
                <div className="mb-8 flex items-center justify-between">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-[#183f32] shadow-sm">
                    <Icon size={27} strokeWidth={1.7} />
                  </div>

                  <ArrowUpRight
                    size={21}
                    className="text-[#183f32] transition group-hover:-translate-y-1 group-hover:translate-x-1"
                  />
                </div>

                <h3 className="text-xl font-bold text-[#183f32]">
                  {category.name}
                </h3>

                <p className="mt-2 min-h-10 text-xs leading-6 text-gray-600">
                  {category.description}
                </p>

                <p className="mt-5 text-[10px] font-bold uppercase tracking-wider text-[#b58749]">
                  {category.count}
                </p>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
