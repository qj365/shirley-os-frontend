
"use client"

import { useEffect, useState } from 'react';
import ProductCard from '@/components/shop/product-card';
import { getProductsByCategory } from '@/services/product-service';
import { MedusaProduct } from '@/services/product-service';
import Loading from "../shared/loading";

interface ShopBundlesProps {
  categoryId?: string;
}

export default function ShopBundles({categoryId}: ShopBundlesProps) {
  const [products, setProducts] = useState<MedusaProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!categoryId) {
          console.error("ShopBundles: No category ID provided");
          setLoading(false);
          return;
        }
        
        const data = await getProductsByCategory(categoryId);
        
        // Ensure data is an array before setting state
        if (Array.isArray(data)) {
          setProducts(data);
        } else {
          console.error("ShopBundles: API returned non-array data:", data);
        }
      } catch (error) {
        console.error("ShopBundles: Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [categoryId]);

  if (loading) {
    return <div><Loading /></div>;
  }

  
  return (
    <section className="w-full mx-auto">
      <h2 className="text-lg md:text-[25px] font-bold mb-6 md:mb-8 lg:mb-10">
        Shirley's Bundles
      </h2>

      <div className="flex flex-col gap-9">
        <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6`}>
          {products.map((product, index) => (
            <div key={`desktop-${index}`} className="block">
              <ProductCard 
                product={product}
                categoryId={categoryId || null}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}