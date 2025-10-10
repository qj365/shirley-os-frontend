"use client"

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode
} from "react"
import { HttpTypes } from "@medusajs/types"
import { sdk } from "@/config"
import { toast } from "sonner"

type CartContextType = {
  cart: HttpTypes.StoreCart | null
  loading: boolean
  addItem: (variantId: string, quantity: number) => Promise<void>
  updateItem: (lineId: string, quantity: number) => Promise<void>
  removeItem: (lineId: string) => Promise<void>
  clearCart: () => Promise<void>
  refreshCart: () => Promise<void>
  setCart: (cart: HttpTypes.StoreCart | null) => void
  formatPrice: (amount: number | undefined) => string
  handleAddToCart: (variantId: string) => void
  handleDecreaseQuantity: (lineId: string) => void
  clearCartSilently: () => Promise<void> // Add this line
}

const CartContext = createContext<CartContextType | null>(null)

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<HttpTypes.StoreCart | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  // Format price function that can be used throughout the app
  const formatPrice = (amount: number | undefined): string => {
    if (amount === undefined) return "£0.00"
    
    return new Intl.NumberFormat("en-GB", {
      style: "currency",
      currency: cart?.currency_code || "GBP",
    }).format(amount)
  }

  const handleAddToCart = (variantId: string) => {
    addItem(variantId, 1);
  };

  const handleDecreaseQuantity = (lineId: string) => {
    const item = cart?.items?.find((item) => item.id === lineId);
    if (item) {
      if (item.quantity > 1) {
        updateItem(lineId, item.quantity - 1);
      } else {
        removeItem(lineId);
      }
    }
  };

  // Initialize cart
  const initializeCart = async () => {
    setLoading(true)
    try {
      const cartId = localStorage.getItem("cart_id")
      
      if (cartId) {
        try {
          // Try to retrieve existing cart with expanded fields
          const response = await sdk.client
            .fetch<HttpTypes.StoreCartResponse>(`/store/carts/${cartId}`, {
              method: "GET",
              query: {
                fields: "*items, *region, *items.product, *items.variant, *items.thumbnail, *items.metadata, +items.total, *promotions, +shipping_methods.name, *items.variant.product.images",
              },
            })
          setCart(response.cart)
        } catch (error) {
          console.error("Error retrieving cart:", error)
          // If cart retrieval fails, clear the invalid cart ID from localStorage
          localStorage.removeItem("cart_id")
          // Then create a new one
          await createNewCart()
        }
      } else {
        // No cart ID found, create a new cart
        await createNewCart()
      }
    } catch (error) {
      console.error("Error initializing cart:", error)
      toast.error("Failed to initialize cart. Please try again.") 
    } finally {
      setLoading(false)
    }
  }

  // Create a new cart
  const createNewCart = async () => {
    try {
      const { cart: newCart } = await sdk.store.cart.create({
        region_id: process.env.NEXT_PUBLIC_REGION_ID,
      })
      
      localStorage.setItem("cart_id", newCart.id)
      setCart(newCart)
      return newCart
    } catch (error) {
      console.error("Error creating new cart:", error)
      throw error
    }
  }

  // Add item to cart
  const addItem = async (variantId: string, quantity: number) => {
    setLoading(true)
    try {
      if (!cart) {
        await initializeCart()
      }
      
      // Get the cart ID after initialization
      const cartId = cart?.id || localStorage.getItem("cart_id")
      if (!cartId) {
        // If still no cart ID, create a new cart
        const newCart = await createNewCart()
        await sdk.store.cart.createLineItem(newCart.id, {
          variant_id: variantId,
          quantity
        })
      } else {
        try {
          await sdk.store.cart.createLineItem(cartId, {
            variant_id: variantId,
            quantity
          })
        } catch (error) {
          console.error("Error adding item to cart:", error)
          // If adding item fails due to invalid cart, create a new cart and try again
          localStorage.removeItem("cart_id")
          const newCart = await createNewCart()
          await sdk.store.cart.createLineItem(newCart.id, {
            variant_id: variantId,
            quantity
          })
        }
      }

      // Refresh cart to get updated data with product images
      await refreshCart()
      
      toast.success("Item has been added to your cart.")
    } catch (error) {
      console.error("Error adding item to cart:", error)
      toast.error("Failed to add item to cart. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  // Update item quantity
  const updateItem = async (lineId: string, quantity: number) => {
    setLoading(true)
    try {
      if (!cart) {
        throw new Error("No cart available")
      }

      await sdk.store.cart.updateLineItem(cart.id, lineId, {
        quantity
      })
      
      // Refresh cart to get updated data with product images
      await refreshCart()
      toast.success("Item quantity in your cart has been updated.")
    } catch (error) {
      console.error("Error updating item quantity:", error)
      toast.error("Failed to update item quantity. Please try again.") // Changed toast format
    } finally {
      setLoading(false)
    }
  }

  // Remove item from cart
  const removeItem = async (lineId: string) => {
    setLoading(true)
    try {
      if (!cart) {
        throw new Error("No cart available")
      }

      await sdk.store.cart.deleteLineItem(cart.id, lineId)
      
      // Refresh cart to get updated data with product images
      await refreshCart()
      
      toast.success("Item has been removed from your cart.") // Changed toast format
    } catch (error) {
      console.error("Error removing item from cart:", error)
      toast.error("Failed to remove item from cart. Please try again.") // Changed toast format
    } finally {
      setLoading(false)
    }
  }

  // Clear cart (create a new empty cart)
  const clearCart = async () => {
    setLoading(true)
    try {
      localStorage.removeItem("cart_id")
      await createNewCart()
    } catch (error) {
      console.error("Error clearing cart:", error)
      toast.error("Failed to clear cart. Please try again.") // Changed toast format
    } finally {
      setLoading(false)
    }
  }

  // Add a new method for silent cart clearing after order completion
  const clearCartSilently = async () => {
    try {
      localStorage.removeItem("cart_id")
      // Create new cart without triggering loading states or UI updates
      const { cart: newCart } = await sdk.store.cart.create({
        region_id: process.env.NEXT_PUBLIC_REGION_ID,
      })
      localStorage.setItem("cart_id", newCart.id)
      // Only update cart state, don't trigger loading
      setCart(newCart)
    } catch (error) {
      console.error("Error clearing cart silently:", error)
    }
  }

  // Refresh cart (useful after login/logout)
  const refreshCart = async () => {
    setLoading(true)
    try {
      const cartId = localStorage.getItem("cart_id")
      
      if (cartId) {
        try {
          // Retrieve cart with expanded fields
          const response = await sdk.client
            .fetch<HttpTypes.StoreCartResponse>(`/store/carts/${cartId}`, {
              method: "GET",
              query: {
                fields: "*items, *region, *items.product, *items.variant, *items.thumbnail, *items.metadata, +items.total, *promotions, +shipping_methods.name, *items.variant.product.images",
              },
            })
          setCart(response.cart)
        } catch (error) {
          console.error("Error refreshing cart:", error)
          // If cart retrieval fails, create a new one
          await createNewCart()
        }
      } else {
        // No cart ID found, create a new cart
        await createNewCart()
      }
    } catch (error) {
      console.error("Error refreshing cart:", error)
      toast.error("Failed to refresh cart. Please try again.") // Changed toast format
    } finally {
      setLoading(false)
    }
  }

  // Initialize cart on component mount
  useEffect(() => {
    initializeCart()
  }, [])


  return (
    <CartContext.Provider
      value={{
        cart,
        loading,
        addItem,
        updateItem,
        removeItem,
        clearCart,
        refreshCart,
        setCart,
        formatPrice,
        handleAddToCart,
        handleDecreaseQuantity,
        clearCartSilently, // Add this new method
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  
  if (!context) {
    throw new Error("useCart must be used within a CartProvider")
  }
  
  return context
}