// Product Service - FastAPI Integration

// Type definitions for product-related operations
export interface Product {
  id: string;
  title: string;
  description?: string;
  thumbnail?: string | null;
  images?: Array<{ url: string; alt_text?: string | null }>;
  metadata?: Record<string, unknown>;
  variants?: ProductVariant[];
}

export interface ProductVariant {
  id: string;
  title: string;
  inventory_quantity: number;
  calculated_price?: {
    calculated_amount: number;
    original_amount: number;
  };
}

export interface ProductCategory {
  id: string;
  name: string;
  handle?: string;
}

// Keep legacy type names for backward compatibility
export type MedusaProduct = Product;
export type MedusaProductCategory = ProductCategory;

// FastAPI Product interfaces
export interface FastAPIProduct {
  id: string;
  name: string;
  slug: string;
  title?: string;
  description: string;
  short_description?: string;
  thumbnail?: string | null;
  price: number;
  sale_price?: number;
  inventory_quantity?: number;
  category_id?: string;
  status: 'active' | 'inactive';
  minimum_quantity?: number;
  images?: Array<{
    url: string;
    alt_text?: string | null;
    title?: string;
    caption?: string;
    sort_order?: number;
    is_primary?: boolean;
    flavor?: string;
    variant_id?: string;
  }>;
  metadata?: {
    color?: string;
    ingredients?: string;
    allergens?: string;
    nutritional_info?: unknown;
    storage_instructions?: string;
    shelf_life?: string;
    additional_info?: unknown;
  };
  variants?: FastAPIVariant[];
}

export interface FastAPIVariant {
  name: string;
  variant_id: string;
  attributes?: {
    color?: string;
    [key: string]: any;
  };
  packs?: Array<{
    pack_count: number;
    price: number;
    sku: string;
    stock_quantity: number;
    variant_id: string;
  }>;
  description?: string;
  images?: Array<{
    url: string;
    alt_text?: string | null;
    title?: string;
    caption?: string;
    sort_order?: number;
    is_primary?: boolean;
    flavor?: string;
    variant_id?: string;
  }>;
  label?: string;
  stock_quantity?: number;
  id?: string;
  title?: string;
  inventory_quantity?: number;
  calculated_price?: {
    calculated_amount: number;
    original_amount: number;
  };
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://dev-api.shirleysfoods.com';

// Convert FastAPI product to our Product format
function convertToProductFormat(fastApiProduct: FastAPIProduct): Product {
  return {
    id: fastApiProduct.id,
    title: fastApiProduct.title || fastApiProduct.name,
    description: fastApiProduct.description,
    thumbnail: fastApiProduct.thumbnail || fastApiProduct.images?.find(img => img.is_primary)?.url || fastApiProduct.images?.[0]?.url,
    images: fastApiProduct.images,
    metadata: fastApiProduct.metadata,
    variants: fastApiProduct.variants?.map(variant => ({
      id: variant.variant_id || variant.id || '',
      title: variant.name || variant.title || '',
      inventory_quantity: variant.stock_quantity || variant.inventory_quantity || 0,
      calculated_price: variant.calculated_price || (variant.packs && variant.packs.length > 0 ? {
        calculated_amount: fastApiProduct.sale_price || fastApiProduct.price,
        original_amount: fastApiProduct.price
      } : undefined)
    })) || []
  };
}

/**
 * Get all products
 */
export async function getProducts() {
  try {
    // Since we don't have a "get all products" endpoint, we'll get products from all categories
    const categories = ['CAT001', 'CAT002', 'CAT003'];
    const allProducts: FastAPIProduct[] = [];
    
    for (const categoryId of categories) {
      const response = await fetch(`${API_BASE_URL}/api/v1/products?category_id=${categoryId}&status=active`);
      if (response.ok) {
        const categoryProducts = await response.json();
        allProducts.push(...categoryProducts);
      }
    }
    
    // Convert to our Product format
    const products = allProducts.map(convertToProductFormat);
    
    return {
      products,
      count: products.length,
    };
  } catch (error) {
    console.error("Error fetching products:", error);
    return {
      products: [],
      count: 0,
    };
  }
}

/**
 * Get product by ID
 */
export async function getProductById(productId: string) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/products/${productId}`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch product: ${response.statusText}`);
    }
    
    const fastApiProduct = await response.json();
    return convertToProductFormat(fastApiProduct);
  } catch (error) {
    console.error("Error fetching product by ID:", error);
    return null;
  }
}

/**
 * Get products by category
 * Expands variants into separate products for display
 */
export async function getProductsByCategory(categoryId: string) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/products?category_id=${categoryId}&status=active`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch products: ${response.statusText}`);
    }
    
    const fastApiProducts = await response.json();
    
    // Flatten variants: convert each variant into a separate product
    const expandedProducts: Product[] = [];
    
    fastApiProducts.forEach((apiProduct: FastAPIProduct) => {
      if (apiProduct.variants && apiProduct.variants.length > 0) {
        // Create a separate product for each variant
        apiProduct.variants.forEach((variant: any) => {
          const variantImages = apiProduct.images?.filter(img => 
            img.variant_id === variant.variant_id || !img.variant_id
          ) || [];
          
          expandedProducts.push({
            id: `${apiProduct.id}-${variant.variant_id}`,
            title: `${apiProduct.name} - ${variant.name}`,
            description: variant.description || apiProduct.description,
            thumbnail: variantImages.find(img => img.is_primary)?.url || variantImages[0]?.url || apiProduct.images?.[0]?.url,
            images: variantImages,
            metadata: {
              ...apiProduct.metadata,
              ...variant.attributes,
              variant_name: variant.name,
              parent_product_id: apiProduct.id,
            },
            variants: [{
              id: variant.variant_id,
              title: variant.label || variant.name,
              inventory_quantity: variant.stock_quantity || 0,
              calculated_price: {
                calculated_amount: apiProduct.sale_price || apiProduct.price,
                original_amount: apiProduct.price
              }
            }]
          });
        });
      } else {
        // No variants, just convert the product as-is
        expandedProducts.push(convertToProductFormat(apiProduct));
      }
    });
    
    return expandedProducts;
  } catch (error) {
    console.error("Error fetching products by category:", error);
    return [];
  }
}

/**
 * Get product categories
 */
export async function getProductCategories() {
  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/categories`);
    
    if (response.ok) {
      const categories = await response.json();
      return categories;
    }
  } catch (error) {
    console.error("Error fetching categories:", error);
  }
  
  // Return hardcoded categories based on what we see in logs if API fails
  return [
    { id: 'CAT001', name: "Shirley's Jollof Paste" },
    { id: 'CAT002', name: "Shirley's Red Sauce" },
    { id: 'CAT003', name: "Shirley's Bundles" }
  ];
}

/**
 * Get customer orders (placeholder - may need implementation)
 */
export async function getOrders(customerId?: string) {
  try {
    const endpoint = customerId 
      ? `${API_BASE_URL}/api/v1/orders?customer_id=${customerId}`
      : `${API_BASE_URL}/api/v1/orders`;
      
    const response = await fetch(endpoint);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch orders: ${response.statusText}`);
    }
    
    const orders = await response.json();
    return { orders, count: orders.length };
  } catch (error) {
    console.error("Error fetching orders:", error);
    return { orders: [], count: 0 };
  }
}

/**
 * Get order by ID (placeholder - may need implementation)
 */
export async function getOrderById(orderId: string) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/orders/${orderId}`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch order: ${response.statusText}`);
    }
    
    const order = await response.json();
    return order;
  } catch (error) {
    console.error("Error fetching order by ID:", error);
    throw error;
  }
}