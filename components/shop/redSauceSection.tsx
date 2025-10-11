"use client"

import { useEffect, useState } from "react"
import { getProductsByCategory } from "@/services/product-service"
import { MedusaProduct } from "@/services/product-service"
import Loading from "../shared/loading"
import ProductCard from "./product-card";

interface RedSauceSectionProps {
  categoryId?: string;
}

export default function RedSauceSection({categoryId}: RedSauceSectionProps) {
  const [products, setProducts] = useState<MedusaProduct[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!categoryId) {
          console.error("RedSauceSection: No category ID provided");
          setLoading(false);
          return;
        }
        
        const data = await getProductsByCategory(categoryId);
        
        // Ensure data is an array before setting state
        if (Array.isArray(data)) {
          setProducts(data);
        } else {
          console.error("RedSauceSection: API returned non-array data:", data);
        }
      } catch (error) {
        console.error("RedSauceSection: Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [categoryId]);
  
  if (loading) {
    return <div><Loading /></div>; // Display loading state until data is fetched
  }

  return (
    <section className="w-full  mx-auto flex flex-col gap-10 ">
      <h2 className="text-lg md:text-[25px] font-bold">
        Shirley&apos;s Red Sauce
      </h2>

      <div className="flex flex-col gap-9">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product, index) => (
            <div key={index}>
              <ProductCard 
                product={product} 
                categoryId={categoryId || null}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}