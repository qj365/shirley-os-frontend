'use client';

import { useCartStore } from '@/stores/cart-store';
import { useEffect } from 'react';

export default function ClearCartOnSuccess() {
  const clearCart = useCartStore(state => state.clearCart);

  useEffect(() => {
    // Clear cart when component mounts (when user reaches success page)
    clearCart();
  }, [clearCart]);

  // This component doesn't render anything
  return null;
}
