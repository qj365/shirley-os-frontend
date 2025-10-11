import { cn } from "@/lib/utils";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

type Props = {
  bgClassName?: string;
  isShowSeeMoreBtn?: boolean;
  isShowSeeMoreDetailBtn?: boolean;
};

export default function OurRecipes({
  bgClassName = "our-recipes-bg-gradient--yellow",
  isShowSeeMoreBtn,
  isShowSeeMoreDetailBtn,
}: Props) {
  const recipes = [
    {
      id: 1,
      title: "Shirley's Classic Jollof Rice",
      image: "/image/landingPageImages/recipe1.png",
      slug: "shirleys-classic-jollof-rice",
    },
    {
      id: 2,
      title: "Signature Sautéed Onions",
      image: "/image/landingPageImages/recipe2.png",
      slug: "signature-sauteed-onions",
    },
    {
      id: 3,
      title: "Hearty Mushroom Spinach Stew",
      image: "/image/landingPageImages/recipe3.jpg",
      slug: "hearty-mushroom-spinach-stew",
    },
  ];

  return (
    <section className="w-full relative lg:mt-10">
      {/* Gradient Background */}
      <div className={cn("w-full py-16", bgClassName)}>
        <div className="container">
          {/* Header Section */}
          <div className="mb-12 text-center">
            <h2 className="mb-6 text-2xl font-bold text-black md:text-3xl lg:text-3xl">
              Our Recipes
            </h2>
            <p className="mx-auto mb-8 max-w-5xl text-lg leading-relaxed text-black/85 md:text-xl lg:text-2xl">
              From traditional classics to modern interpretations, each
              <br />
              dish celebrates the rich culinary heritage of West Africa whilst
              offering
              <br />
              simplicity and convenience
            </p>
          </div>

          {/* Recipe Cards */}
          <div className="mb-10 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {recipes.map((recipe) => (
              <Link
                key={recipe.id}
                href={`/recipe/${recipe.slug}`}
                className="group block"
              >
                <div className="shadow-card">
                  {/* Recipe Image */}
                  <div className="relative h-80 bg-gray-100">
                    <Image
                      src={recipe.image}
                      alt={recipe.title.replace("\n", " ")}
                      fill
                      className="object-cover"
                    />
                  </div>
                  {/* Recipe Tags */}
                  {/* <div className="flex flex-wrap gap-2 mb-4">
                      <span className="bg-white px-4 py-2 rounded-full text-black font-semibold text-sm">
                        Appetizers
                      </span>
                      <span className="bg-white px-4 py-2 rounded-full text-black font-semibold text-sm">
                        Rice
                      </span>
                      <span className="bg-white px-4 py-2 rounded-full text-black font-semibold text-sm">
                        Healthy Eats
                      </span>
                    </div> */}

                  {/* Recipe Title */}
                  <div className="p-6">
                    <h3 className="text-base leading-tight font-medium text-black md:text-xl lg:text-lg">
                      {recipe.title}
                    </h3>
                    {!!isShowSeeMoreDetailBtn && (
                      <button className="font-raleway mt-4 flex w-full items-center justify-between rounded-[33px] bg-[#FFC020] px-6 py-3 text-base font-bold text-black transition-colors hover:bg-[#FFB000]">
                        <span>See the full recipe</span>
                        <ArrowRight className="h-5 w-5" />
                      </button>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {!!isShowSeeMoreBtn && (
            <div className="text-center">
              <Link
                href="/recipes"
                className="font-raleway inline-flex items-center justify-center gap-2 rounded-full bg-black px-8 py-4 text-lg font-normal text-white transition-colors duration-300 hover:bg-gray-800"
              >
                View All
                <ArrowRight className="h-5 w-5" />
              </Link>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
