import ProductDetailComponent from '@/components/product-detail/ProductDetail';
import ProductDetailEmptyData from '@/components/product-detail/ProductDetailEmptyData';
import ProductsCarousel from '@/components/shop/ProductsCarousel';
import { api } from '@/src/lib/api/customer';

async function fetchProductsByCategory(slug: string) {
  try {
    return await api.product.getProductBySlug({
      slug,
    });
  } catch {
    return null;
  }
}

async function fetchRelatedProducts(productId: number, categoryId: number) {
  try {
    return await api.product.getRelatedProducts({
      idProduct: productId,
      categoryId: categoryId,
    });
  } catch {
    return [];
  }
}

export default async function ProductDetail({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const productDetail = await fetchProductsByCategory(slug);

  if (!productDetail) {
    return <ProductDetailEmptyData />;
  }

  // Fetch related products using the product ID and category ID
  const relatedProducts = await fetchRelatedProducts(
    productDetail.id,
    productDetail.category.id
  );
  console.log(relatedProducts);

  return (
    <div className="min-h-screen pt-35 md:pt-40">
      <ProductDetailComponent data={productDetail} />

      <section className="container py-10">
        <ProductsCarousel
          categoryName="More Like This"
          products={relatedProducts}
        />
      </section>
    </div>
  );
}
