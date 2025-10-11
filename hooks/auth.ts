"use client";

import { useState, useEffect } from "react";
import { sdk } from "@/config";

export interface CustomerData {
  id: string;
  email: string;
  first_name?: string | null;
  last_name?: string | null;
  phone?: string | null;
  // Add other customer fields as needed
}

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [customer, setCustomer] = useState<CustomerData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Function to handle cart transfer when authentication state changes
  const handleCartTransfer = async (customerId: string | null) => {
    try {
      const cartId = localStorage.getItem("cart_id");
      
      // If there's no cart, nothing to transfer
      if (!cartId) return;
      
      if (customerId) {
        // User logged in - transfer cart to the customer
        await sdk.store.cart.transferCart(cartId);
        } else {
        // User logged out - no need to transfer, but we might want to refresh the cart
        //console.log("User logged out, cart remains in session");
      }
    } catch (error) {
      console.error("Error transferring cart:", error);
    }
  };

  const fetchAuthData = async () => {
    try {
      setIsLoading(true);
      // Check if customer_id exists in sessionStorage or localStorage
      const sessionCustomerId = sessionStorage.getItem("customer_id");
      const localCustomerId = localStorage.getItem("customer_id");
      const customerId = sessionCustomerId || localCustomerId;
      
      // Set authentication status
      setIsAuthenticated(!!customerId);
      
      if (!customerId) {
        setCustomer(null);
        setIsLoading(false);
        return;
      }

      // Retrieve customer data using Medusa SDK
      const { customer } = await sdk.store.customer.retrieve();
      
      // Type-safe conversion from Medusa customer to our CustomerData type
      if (customer) {
        const customerData: CustomerData = {
          id: customer.id,
          email: customer.email,
          first_name: customer.first_name,
          last_name: customer.last_name,
          phone: customer.phone
        };
        setCustomer(customerData);
        
        localStorage.setItem("customer_id", customer.id);
        localStorage.setItem("user_email", customer.email);
        
        // Transfer cart when customer data is retrieved
        await handleCartTransfer(customer.id);
      } else {
        setCustomer(null);
      }
      
      setError(null);
    } catch (err) {
      console.error("Error fetching auth data:", err);
      setError("Failed to load customer data");
      setCustomer(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAuthData();

    // Listen for storage events (login/logout in other tabs)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "customer_id" || e.key === "shirleys_auth_token") {
        fetchAuthData();
      }
    };
    
    // Listen for our custom auth state change event
    const handleAuthChange = () => {
      fetchAuthData();
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("auth_state_changed", handleAuthChange);
    
    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("auth_state_changed", handleAuthChange);
    };
  }, []);

  return { isAuthenticated, customer, isLoading, error, refreshAuth: fetchAuthData };
}