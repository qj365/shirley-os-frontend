// FastAPI Product Service

// Product and Category interfaces
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
  description?: string;
}

// FastAPI Product interfaces
export interface FastAPIProduct {
  id: string;
  title: string;
  description: string;
  thumbnail: string | null;
  price: number;
  inventory_quantity: number;
  category_id: string;
  status: 'active' | 'inactive';
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
  id: string;
  title: string;
  inventory_quantity: number;
  calculated_price?: {
    calculated_amount: number;
    original_amount: number;
  };
}

export interface FastAPIProductCategory {
  id: string;
  name: string;
  description?: string;
}

// Keep legacy type names for backward compatibility
export type MedusaProduct = Product;
export type MedusaProductCategory = ProductCategory;

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://dev-api.shirleysfoods.com';

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
    
    return {
      products: allProducts,
      count: allProducts.length,
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
 * Get products by category
 */
export async function getProductsByCategory(categoryId: string) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/products?category_id=${categoryId}&status=active`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch products: ${response.statusText}`);
    }
    
    const products = await response.json();
    return products;
  } catch (error) {
    console.error("Error fetching products by category:", error);
    return [];
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
    
    const product = await response.json();
    return product;
  } catch (error) {
    console.error("Error fetching product by ID:", error);
    return null;
  }
}

/**
 * Get product categories
 */
export async function getProductCategories() {
  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/categories`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch categories: ${response.statusText}`);
    }
    
    const categories = await response.json();
    return categories;
  } catch (error) {
    console.error("Error fetching categories:", error);
    // Return hardcoded categories based on what we see in logs
    return [
      { id: 'CAT001', name: "Shirley's Jollof Paste" },
      { id: 'CAT002', name: "Shirley's Red Sauce" },
      { id: 'CAT003', name: "Shirley's Bundles" }
    ];
  }
}

// Convert FastAPI product to Product format
export function convertToProductFormat(fastApiProduct: FastAPIProduct): Product {
  return {
    id: fastApiProduct.id,
    title: fastApiProduct.title,
    description: fastApiProduct.description,
    thumbnail: fastApiProduct.thumbnail,
    metadata: fastApiProduct.metadata,
    variants: fastApiProduct.variants?.map(variant => ({
      id: variant.id,
      title: variant.title,
      inventory_quantity: variant.inventory_quantity,
      calculated_price: variant.calculated_price ? {
        calculated_amount: variant.calculated_price.calculated_amount,
        original_amount: variant.calculated_price.original_amount
      } : undefined
    })) || []
  };
}

// Legacy function name for backward compatibility
export const convertToMedusaFormat = convertToProductFormat;