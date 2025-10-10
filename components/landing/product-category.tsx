import { ArrowRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import React, { useState, useEffect } from 'react';
import { getProductCategories } from '@/services/product-service';
import { MedusaProductCategory } from '@/services/product-service';

// Define a mapping for category images
const categoryImages: Record<string, string> = {
  "Shirley's Jollof Paste": '/image/landingPageImages/4paste.png',
  "Shirley's Red Sauce": '/image/landingPageImages/sauce.png',
  "Shirley's Bundles": '/image/landingPageImages/sauceandpaste.png',
  // Add fallback image for any new categories
  default: '/image/default-product.png',
};

function ProductCategory() {
  const [categories, setCategories] = useState<MedusaProductCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch categories on component mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const productCategories = await getProductCategories();
        setCategories(productCategories);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching product categories:', error);
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // Function to generate the appropriate URL for each category
  const getCategoryUrl = (category: MedusaProductCategory) => {
    // For bundles category
    if (category.name === "Shirley's Bundles") {
      return "/shop?category=Shirley's Bundles";
    }
    // For other categories
    return `/shop?category=${encodeURIComponent(category.name)}`;
  };

  // Function to get the image for a category
  const getCategoryImage = (categoryName: string) => {
    return categoryImages[categoryName] || categoryImages.default;
  };

  // Show loading state
  if (isLoading) {
    return (
      <section className="bg-gradient-to-br from-[#F3C03F] to-[#FFBA0A] py-12 md:py-24">
        <div className="container">
          <h2 className="mb-12 text-center text-3xl font-bold md:text-4xl">Our Product Category</h2>
          <div className="flex justify-center">
            <p>Loading categories...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-gradient-to-br from-[#F3C03F] to-[#FFBA0A] py-12 md:py-24">
      <div className="container">
        <h2 className="mb-12 text-center text-3xl font-bold md:text-4xl">Our Product Category</h2>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {categories.map(category => (
            <div key={category.id} className="relative rounded-xl bg-[#FFF3D6] p-6">
              <span className="mb-1 text-2xl font-semibold text-wrap">{category.name}</span>

              <Link href={getCategoryUrl(category)}>
                <div className="absolute bottom-6 left-6 rounded-full bg-white p-3">
                  <ArrowRight className="h-6 w-6 hover:cursor-pointer" />
                </div>
              </Link>

              <div className="mt-10 flex justify-center">
                <Image
                  src={getCategoryImage(category.name)}
                  alt={category.name}
                  width={262}
                  height={262}
                  className="object-contain"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default ProductCategory;
