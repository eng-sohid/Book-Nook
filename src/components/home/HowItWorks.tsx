import Link from "next/link";
import { Search, BookPlus, BookCheck, ArrowRight } from "lucide-react";

const steps = [
  {
    number: "01",
    title: "Explore Books",
    description:
      "Browse our collection and discover books from different categories.",
    icon: Search,
  },
  {
    number: "02",
    title: "Borrow a Book",
    description:
      "Choose your favorite book and borrow it for a specific period.",
    icon: BookPlus,
  },
  {
    number: "03",
    title: "Enjoy & Return",
    description: "Enjoy reading your book and return it before the due date.",
    icon: BookCheck,
  },
];

export default function HowItWorks() {
  return (
    <section className="bg-white px-5 py-20 md:px-10 lg:px-16">
      <div className="mx-auto max-w-7xl">
        <div className="mb-14 text-center">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-[#c18b45]">
            Simple Process
          </p>

          <h2 className="text-3xl font-bold text-[#183f32] md:text-4xl">
            How BookNook Works
          </h2>

          <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-gray-500 md:text-base">
            Getting your favorite book is simple. Follow these three easy steps
            and start your reading journey.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {steps.map((step) => {
            const Icon = step.icon;

            return (
              <div
                key={step.number}
                className="group relative rounded-2xl border border-[#e9e7df] bg-[#faf9f6] p-8 transition-all duration-300 hover:-translate-y-2 hover:border-[#183f32]/30 hover:shadow-xl"
              >
                <div className="mb-7 flex items-center justify-between">
                  <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-[#183f32] text-white transition-colors group-hover:bg-[#c18b45]">
                    <Icon size={26} />
                  </div>

                  <span className="text-4xl font-bold text-[#e8e5dc]">
                    {step.number}
                  </span>
                </div>

                <h3 className="mb-3 text-xl font-bold text-[#183f32]">
                  {step.title}
                </h3>

                <p className="text-sm leading-7 text-gray-500">
                  {step.description}
                </p>
              </div>
            );
          })}
        </div>

        <div className="mt-12 text-center">
          <Link
            href="/books"
            className="inline-flex items-center gap-2 rounded-full bg-[#183f32] px-7 py-3.5 text-sm font-semibold text-white transition-all hover:bg-[#245743]"
          >
            Start Exploring
            <ArrowRight size={17} />
          </Link>
        </div>
      </div>
    </section>
  );
}
