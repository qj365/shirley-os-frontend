import ProductDetailComponent from '@/components/product-detail/ProductDetail';
import ProductDetailEmptyData from '@/components/product-detail/ProductDetailEmptyData';
import EmptyShop from '@/components/shop/EmptyShop';
import { api } from '@/src/lib/api/customer';

export async function fetchProductsByCategory(slug: string) {
  try {
    return await api.product.getProductBySlug({
      slug,
    });
  } catch {
    return null;
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

  return (
    <div className="min-h-screen pt-35 md:pt-40">
      <ProductDetailComponent data={productDetail} />

      <section className="container py-7">
        <h2 className="mb-6 text-[23px] font-bold md:mb-8 md:text-3xl lg:mb-10">
          More Like This
        </h2>

        <EmptyShop />
      </section>
    </div>
  );
  // const [product, setProduct] = useState<MedusaProduct | null>(null);
  // const [loading, setLoading] = useState(true);
  // const params = useParams();
  // const productId = params.id as string;

  // // Fetch product data using the getProductById service
  // useEffect(() => {
  //   const fetchProductData = async () => {
  //     try {
  //       console.log('ProductDetail: Fetching product with ID:', productId);
  //       // Use the dedicated getProductById function
  //       const foundProduct = await getProductById(productId);
  //       console.log(
  //         'ProductDetail: Product fetched successfully:',
  //         foundProduct
  //       );
  //       setProduct(foundProduct);
  //     } catch (error) {
  //       console.error('ProductDetail: Error fetching product:', error);
  //       setProduct(null);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   if (productId) {
  //     fetchProductData();
  //   } else {
  //     console.error('ProductDetail: No product ID provided');
  //     setLoading(false);
  //   }
  // }, [productId]);

  // if (loading) {
  //   return (
  //     <div className="flex min-h-screen w-full items-center justify-center">
  //       <Loading />
  //     </div>
  //   );
  // }

  // return (
  //   <>
  //     {/* Pass the fetched product as a prop to MainSection */}
  //     <MainSection product={product} additionalProducts={[]} />

  //     {/* <div className="w-full hidden md:block">
  //       <ShopBundles heading="More Like This" card={3} align="left" />
  //     </div> */}
  //   </>
  // );
}
