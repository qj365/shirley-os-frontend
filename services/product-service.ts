import { sdk } from "@/config";
import { HttpTypes } from "@medusajs/types";

// Type definitions for product-related operations
export type MedusaProduct = HttpTypes.StoreProduct;
export type MedusaProductCategory = HttpTypes.StoreProductCategory;
export type MedusaOrder = HttpTypes.StoreOrder;


/**
 * Get all products
 */
export async function getProducts() {
  try {
    const response = await sdk.store.product.list(
        {
            fields:"*variants.calculated_price,+variants.inventory_quantity,+metadata,+tags",
            region_id: process.env.NEXT_PUBLIC_REGION_ID,
        }
    );
    
    return {
      products: response.products,
      count: response.count,
    };
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
}

/**
 * Get a single product by ID
 */
export async function getProductById(productId: string) {
  try {
    const response = await sdk.store.product.retrieve(
        productId,
        {  
            fields:"*variants.calculated_price,+variants.inventory_quantity,+metadata,+tags",
            region_id: process.env.NEXT_PUBLIC_REGION_ID,
        }
    );
    return response.product;
  } catch (error) {
    console.error(`Error fetching product with ID ${productId}:`, error);
    throw error;
  }
}

/**
 * Get products by category
 */
export async function getProductsByCategory(categoryId: string) {
  try {
    const response = await sdk.store.product.list({
      category_id: categoryId,
      fields: "*variants.calculated_price,+variants.inventory_quantity,+metadata,+tags",
      region_id: process.env.NEXT_PUBLIC_REGION_ID,
    });
    return response.products;
  } catch (error) {
    console.error(`Error fetching products for category ${categoryId}:`, error);
    throw error;
  }
}

/**
 * Get all product categories
 */
export async function getProductCategories() {
  try {
    const response = await sdk.store.category.list();
    return response.product_categories;
  } catch (error) {
    console.error("Error fetching product categories:", error);
    throw error;
  }
}

/**
 * Get orders for a specific customer by email
 */
// export async function getOrdersByCustomerEmail(customerEmail: string, authToken?: string) {
//   try {
//     // If auth token is provided, set it for the SDK
//     if (authToken) {
//       // Set the authentication token for this request
//       const headers = {
//         Authorization: `Bearer ${authToken}`
//       };
      
//       // Get orders for the authenticated customer with proper fields
//       const response = await sdk.store.order.list(
//         {
//           fields: "id,email,status,created_at,total,currency_code,*items,*customer"
//         },
//         headers
//       );
      
//       return response.orders;
//     } else {
//       // Alternative: If no auth token, try to get orders for currently logged-in customer
//       const response = await sdk.store.order.list({
//         fields: "id,email,status,created_at,total,currency_code,*items,*customer"
//       });
      
//       return response.orders;
//     }
//   } catch (error) {
//     console.error('Error fetching authenticated customer orders:', error);
//     throw error;
//   }
// }

export async function getAuthenticatedCustomerOrders() {
  try {
   const response = await sdk.store.order.list({
    fields: [
      "id",
      "email",
      "status",
      "created_at",
      "total",
      "subtotal",
      "tax_total",
      "discount_total",
      "shipping_total",
      "currency_code",
      "shipping_address.*",
      "billing_address.*",
      "items.*"
    ].join(",")
  });
    return response.orders.reverse();
  } catch (error) {
    console.error('Error fetching authenticated customer orders:', error);
    throw error;
  }
}

/**
 * Get a single order by ID
 */
export async function getOrderById(orderId: string) {
  try {
    const { order } = await sdk.store.order.retrieve(orderId);
    return order;
  } catch (error) {
    console.error(`Error fetching order with ID ${orderId}:`, error);
    throw error;
  }
}