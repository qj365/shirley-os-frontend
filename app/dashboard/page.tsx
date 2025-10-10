'use client'

import React, { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ChevronDown, ChevronUp, ShoppingBag, Package, User } from "lucide-react"
import { useAuth } from "@/hooks/auth"
import { useCart } from "@/services/cart-service"
import { getAuthenticatedCustomerOrders } from "@/services/product-service"
import { Button } from "@/components/ui/button"

interface Order {
  id: string
  created_at: string | Date
  total: number
  shipping_total: number
  discount_total: number
  status: string
  items?: any[] | null
}

export default function Dashboard() {
  const router = useRouter()
  const { isAuthenticated, customer, isLoading } = useAuth()
  const { formatPrice } = useCart()
  const [isRedirecting, setIsRedirecting] = useState(false)
  const [orders, setOrders] = useState<Order[]>([])
  const [ordersLoading, setOrdersLoading] = useState(true)
  const [ordersError, setOrdersError] = useState<string | null>(null)
  const [expandedOrders, setExpandedOrders] = useState<Set<string>>(new Set())

  const toggleOrderExpansion = (orderId: string) => {
    const newExpanded = new Set(expandedOrders)
    if (newExpanded.has(orderId)) {
      newExpanded.delete(orderId)
    } else {
      newExpanded.add(orderId)
    }
    setExpandedOrders(newExpanded)
  }

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      setIsRedirecting(true)
      router.push('/')
    }
  }, [isAuthenticated, isLoading, router])

  useEffect(() => {
    const fetchOrders = async () => {
      if (!isAuthenticated || !customer) return
      
      try {
        setOrdersLoading(true)
        setOrdersError(null)
        
        const customerOrders = await getAuthenticatedCustomerOrders()
        setOrders(customerOrders)
      } catch (err: any) {
        console.error("Error fetching orders:", err)
        setOrdersError('Failed to load order history. Please try again later.')
      } finally {
        setOrdersLoading(false)
      }
    }
    
    fetchOrders()
  }, [isAuthenticated, customer, router])

  if (isLoading || isRedirecting) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-2 border-gray-300 border-t-gray-900 mx-auto"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center space-y-4 max-w-md mx-auto px-6">
          <User className="w-12 h-12 text-gray-400 mx-auto" />
          <h2 className="text-2xl font-semibold text-gray-900">Access Denied</h2>
          <p className="text-gray-600">Please log in to access your dashboard.</p>
          <Button onClick={() => router.push('/')} className="bg-black text-white hover:bg-gray-800">
            Return to Home
          </Button>
        </div>
      </div>
    )
  }

  const formatDate = (dateString: string | Date) => {
    const date = typeof dateString === 'string' ? new Date(dateString) : dateString
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-6 py-24 md:pt-40">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-3xl font-semibold text-gray-900 mb-2">My Account</h1>
          <p className="text-gray-600">Welcome back, {customer?.first_name || customer?.email?.split('@')[0]}!</p>
        </div>

        {/* Order History Section */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Order History</h2>
          
          {ordersLoading ? (
            <div className="bg-white border border-gray-200 rounded-lg p-12 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-2 border-gray-300 border-t-gray-900 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading your orders...</p>
            </div>
          ) : ordersError ? (
            <div className="bg-white border border-gray-200 rounded-lg p-12 text-center">
              <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Unable to Load Orders</h3>
              <p className="text-gray-600 mb-6">{ordersError}</p>
              <Button 
                onClick={() => window.location.reload()} 
                variant="outline"
                className="border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                Try Again
              </Button>
            </div>
          ) : orders.length === 0 ? (
            <div className="bg-white border border-gray-200 rounded-lg p-12 text-center">
              <ShoppingBag className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Orders Yet</h3>
              <p className="text-gray-600 mb-6">Start shopping to see your order history here.</p>
              <Button 
                onClick={() => router.push('/shop')}
                className="bg-black text-white hover:bg-gray-800"
              >
                Start Shopping
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => {
                const isExpanded = expandedOrders.has(order.id)
                return (
                  <div key={order.id} className="bg-white border border-gray-200 rounded-lg">
                    {/* Order Header */}
                    <div 
                      className="px-6 py-4 cursor-pointer"
                      onClick={() => toggleOrderExpansion(order.id)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-4 mb-2">
                            <h3 className="font-semibold text-gray-900">Order #{order.id.slice(-8)}</h3>
                            {/* <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                              {order.status}
                            </span> */}
                          </div>
                          <div className="flex items-center space-x-6 text-sm text-gray-600">
                            <span>{formatDate(order.created_at)}</span>
                            <span>{formatPrice(order.total)}</span>
                            <span>{order.items?.length || 0} item{(order.items?.length || 0) !== 1 ? 's' : ''}</span>
                          </div>
                        </div>
                        {isExpanded ? (
                          <ChevronUp className="w-5 h-5 text-gray-400" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-gray-400" />
                        )}
                      </div>
                    </div>

                    {/* Expanded Order Details */}
                    {isExpanded && (
                      <div className="px-6 pb-6 border-t border-gray-200">
                        {/* Order Items */}
                        <div className="mt-6">
                          <h4 className="font-semibold text-gray-900 mb-4">Items</h4>
                          <div className="space-y-4">
                            {order.items?.map((item: any) => (
                              <div key={item.id} className="flex items-center space-x-4">
                                <div className="w-12 h-12 flex-shrink-0 overflow-hidden rounded border border-gray-200">
                                  {item.thumbnail ? (
                                    <img
                                      src={item.thumbnail}
                                      alt={item.title}
                                      className="w-full h-full object-cover"
                                    />
                                  ) : (
                                    <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                                      <ShoppingBag className="w-4 h-4 text-gray-400" />
                                    </div>
                                  )}
                                </div>
                                
                                <div className="flex-1 min-w-0">
                                  <h3 className="font-medium text-gray-900 text-sm">{item.title}</h3>
                                  <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                                </div>
                                
                                <div className="text-right">
                                  <p className="font-medium text-gray-900 text-sm">{formatPrice(item.total)}</p>
                                </div>
                              </div>
                            )) || (
                              <p className="text-gray-500 text-sm">No items found</p>
                            )}
                          </div>
                        </div>

                        {/* Order Summary */}
                        <div className="mt-6 pt-6 border-t border-gray-200">
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm text-gray-600">
                              <span>Subtotal</span>
                              <span>{formatPrice(order.total - order.shipping_total + order.discount_total)}</span>
                            </div>
                            
                            {order.shipping_total > 0 && (
                              <div className="flex justify-between text-sm text-gray-600">
                                <span>Shipping</span>
                                <span>{formatPrice(order.shipping_total)}</span>
                              </div>
                            )}
                            
                            {order.discount_total > 0 && (
                              <div className="flex justify-between text-sm text-green-600">
                                <span>Discount</span>
                                <span>-{formatPrice(order.discount_total)}</span>
                              </div>
                            )}
                            
                            <div className="border-t border-gray-200 pt-2">
                              <div className="flex justify-between items-center">
                                <span className="font-semibold text-gray-900">Total</span>
                                <span className="font-semibold text-gray-900">{formatPrice(order.total)}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Continue Shopping */}
        {orders.length > 0 && (
          <div className="mt-8 text-center">
            <Button
              onClick={() => router.push('/shop')}
              variant="outline"
              className="border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              Continue Shopping
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
