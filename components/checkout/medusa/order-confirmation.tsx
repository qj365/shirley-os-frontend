import React, { useEffect, useState } from "react"
import { CheckCircle, ShoppingBag, UserPlus, Package, Truck, CreditCard, Mail, Phone, ArrowRight } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { sdk } from "@/config"
import { useCart } from "@/services/cart-service"
import { useAuth } from "@/hooks/auth"
import { Button } from "@/components/ui/button"

interface OrderConfirmationProps {
  orderId: string
}

export function OrderConfirmation({ orderId }: OrderConfirmationProps) {
  const [order, setOrder] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { formatPrice } = useCart()
  const { isAuthenticated } = useAuth()
  const router = useRouter()

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await sdk.store.order.retrieve(orderId)
        setOrder(response.order)
      } catch (err) {
        console.error('Error fetching order:', err)
        setError('Failed to load order details')
      } finally {
        setLoading(false)
      }
    }

    if (orderId) {
      fetchOrder()
    }
  }, [orderId])

  const handleGuestSignupRedirect = () => {
    if (order?.email) {
      const signupUrl = `/signup?email=${encodeURIComponent(order.email)}`
      router.push(signupUrl)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-2 border-gray-300 border-t-gray-900 mx-auto"></div>
          <p className="text-gray-600">Loading your order details...</p>
        </div>
      </div>
    )
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center space-y-4 max-w-md mx-auto px-6">
          <Package className="w-12 h-12 text-gray-400 mx-auto" />
          <h2 className="text-2xl font-semibold text-gray-900">Order Not Found</h2>
          <p className="text-gray-600">{error || 'We couldn\'t find your order details.'}</p>
          <Button onClick={() => router.push('/')} className="bg-black text-white hover:bg-gray-800">
            Return to Home
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-6 py-24 md:pt-40">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-6">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h1 className="text-3xl font-semibold text-gray-900 mb-2">Order Confirmed</h1>
          <p className="text-gray-600">Thank you for your order. We'll send you a confirmation email shortly.</p>
          <p className="text-gray-600">Order ID: {order.id.slice(-8)}</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Email Confirmation */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-green-600" />
                <div>
                  <p className="text-sm font-medium text-green-900">Confirmation email sent to {order.email}</p>
                </div>
              </div>
            </div>

            {/* Guest Account Creation */}
            {!isAuthenticated && (
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <UserPlus className="w-5 h-5 text-gray-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-2">Save Your Order Details</h3>
                    <p className="text-gray-600 text-sm mb-4">Create an account to track orders and enjoy faster checkout next time.</p>
                    
                    <div className="flex flex-col sm:flex-row gap-3">
                      <Button
                        onClick={handleGuestSignupRedirect}
                        className="bg-black text-white hover:bg-gray-800"
                      >
                        Create Account
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => router.push('/')}
                        className="border-gray-300 text-gray-700 hover:bg-gray-50"
                      >
                        Maybe Later
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Order Items */}
            <div className="bg-white border border-gray-200 rounded-lg">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="font-semibold text-gray-900">Order Summary</h2>
              </div>
              
              <div className="p-6">
                <div className="space-y-4">
                  {order.items.map((item: any) => (
                    <div key={item.id} className="flex items-center space-x-4 py-3">
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
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Order Total */}
            <div className="bg-white border border-gray-200 rounded-lg">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="font-semibold text-gray-900">Order Total</h3>
              </div>
              
              <div className="p-6 space-y-3">
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
                
                {order.tax_total > 0 && (
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Tax</span>
                    <span>{formatPrice(order.tax_total)}</span>
                  </div>
                )}
                
                {order.discount_total > 0 && (
                  <div className="flex justify-between text-sm text-green-600">
                    <span>Discount</span>
                    <span>-{formatPrice(order.discount_total)}</span>
                  </div>
                )}
                
                <div className="border-t border-gray-200 pt-3">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-gray-900">Total</span>
                    <span className="font-semibold text-gray-900">{formatPrice(order.total)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Shipping Information */}
            {order.shipping_address && (
              <div className="bg-white border border-gray-200 rounded-lg">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="font-semibold text-gray-900 flex items-center">
                    <Truck className="w-4 h-4 mr-2 text-gray-500" />
                    Shipping Address
                  </h3>
                </div>
                
                <div className="p-6">
                  <div className="space-y-1 text-sm text-gray-700">
                    <p className="font-medium">{order.shipping_address.first_name} {order.shipping_address.last_name}</p>
                    <p>{order.shipping_address.address_1}</p>
                    {order.shipping_address.address_2 && <p>{order.shipping_address.address_2}</p>}
                    <p>{order.shipping_address.city}, {order.shipping_address.postal_code}</p>
                    <p>{order.shipping_address.country_code?.toUpperCase()}</p>
                    {order.shipping_address.phone && (
                      <p className="flex items-center mt-2 pt-2 border-t border-gray-200">
                        <Phone className="w-3 h-3 mr-2 text-gray-400" />
                        {order.shipping_address.phone}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Billing Information */}
            {order.billing_address && (
              <div className="bg-white border border-gray-200 rounded-lg">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="font-semibold text-gray-900 flex items-center">
                    <CreditCard className="w-4 h-4 mr-2 text-gray-500" />
                    Billing Address
                  </h3>
                </div>
                
                <div className="p-6">
                  <div className="space-y-1 text-sm text-gray-700">
                    <p className="font-medium">{order.billing_address.first_name} {order.billing_address.last_name}</p>
                    <p>{order.billing_address.address_1}</p>
                    {order.billing_address.address_2 && <p>{order.billing_address.address_2}</p>}
                    <p>{order.billing_address.city}, {order.billing_address.postal_code}</p>
                    <p>{order.billing_address.country_code?.toUpperCase()}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Continue Shopping */}
            <div className="text-center">
              <Button
                onClick={() => router.push('/shop')}
                variant="outline"
                className="w-full border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                Continue Shopping
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}