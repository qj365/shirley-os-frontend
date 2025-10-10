import React, { useState } from "react"
import { ChevronDown, ArrowLeft, ArrowRight, Check } from "lucide-react"
import { useCart } from "@/services/cart-service"

interface SubscriptionConfig {
  interval: 'WEEKLY' | 'BI_WEEKLY' | 'MONTHLY' | 'BI_MONTHLY' | 'QUARTERLY'
}

interface CheckoutPaymentOptionStepProps {
  paymentType: 'one-time' | 'subscription'
  setPaymentType: (type: 'one-time' | 'subscription') => void
  subscriptionConfig: SubscriptionConfig
  setSubscriptionConfig: (config: SubscriptionConfig) => void
  onSubmit: () => void
  goToPreviousStep: () => void
}

export const CheckoutPaymentOptionStep: React.FC<CheckoutPaymentOptionStepProps> = ({
  paymentType,
  setPaymentType,
  subscriptionConfig,
  setSubscriptionConfig,
  onSubmit,
  goToPreviousStep
}) => {
  const { cart, formatPrice } = useCart()
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  // Calculate subscription pricing (example discounts)
  const getSubscriptionDiscount = (interval: string) => {
    const discounts = {
      'WEEKLY': 0.03,      // 3% discount
      'BI_WEEKLY': 0.05,   // 5% discount
      'MONTHLY': 0.08,     // 8% discount
      'BI_MONTHLY': 0.10,  // 10% discount
      'QUARTERLY': 0.15    // 15% discount
    }
    return discounts[interval as keyof typeof discounts] || 0
  }

  const getSubscriptionPrice = () => {
    if (!cart?.total) return 0
    const discount = getSubscriptionDiscount(subscriptionConfig.interval)
    return cart.total * (1 - discount)
  }

  const handleIntervalChange = (interval: SubscriptionConfig['interval']) => {
    setSubscriptionConfig({ interval })
    setIsDropdownOpen(false)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit()
  }

  const intervalOptions = [
    { value: 'WEEKLY', label: 'Every Week', description: 'Weekly delivery' },
    { value: 'BI_WEEKLY', label: 'Every 2 Weeks', description: 'Bi-weekly delivery' },
    { value: 'MONTHLY', label: 'Every Month', description: 'Monthly delivery' },
    { value: 'BI_MONTHLY', label: 'Every 2 Months', description: 'Bi-monthly delivery' },
    { value: 'QUARTERLY', label: 'Every 3 Months', description: 'Quarterly delivery' }
  ]

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="bg-white rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-6">Payment Option</h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* One-time Payment Option */}
          <div className="border border-gray-200 rounded-lg p-4">
            <label className="flex items-start space-x-3 cursor-pointer">
              <input
                type="radio"
                name="paymentType"
                value="one-time"
                checked={paymentType === 'one-time'}
                onChange={(e) => setPaymentType(e.target.value as 'one-time' | 'subscription')}
                className="mt-1 w-4 h-4 text-[#FFC020] border-gray-300 focus:ring-[#FFC020]"
              />
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-gray-900">One-time Purchase</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      Pay once and receive your order
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-semibold text-gray-900">
                      {/* {cart?.total ? formatPrice(cart.total) : '£0.00'} */}
                    </div>
                  </div>
                </div>
              </div>
            </label>
          </div>

          {/* Subscription Option */}
          <div className="border border-gray-200 rounded-lg p-4">
            <label className="flex items-start space-x-3 cursor-pointer">
              <input
                type="radio"
                name="paymentType"
                value="subscription"
                checked={paymentType === 'subscription'}
                onChange={(e) => setPaymentType(e.target.value as 'one-time' | 'subscription')}
                className="mt-1 w-4 h-4 text-[#FFC020] border-gray-300 focus:ring-[#FFC020]"
              />
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-gray-900">Subscription Payment</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      Regular deliveries of your order
                      {/* Regular deliveries with exclusive discounts */}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-semibold text-gray-900">
                      {/* {cart?.total ? formatPrice(getSubscriptionPrice()) : '£0.00'} */}
                    </div>
                    {/* {getSubscriptionDiscount(subscriptionConfig.interval) > 0 && (
                      <div className="text-sm text-green-600">
                        Save {Math.round(getSubscriptionDiscount(subscriptionConfig.interval) * 100)}%
                      </div>
                    )} */}
                  </div>
                </div>

                {/* Subscription Configuration */}
                {paymentType === 'subscription' && (
                  <div className="mt-4 space-y-4">
                    {/* Delivery Frequency Dropdown */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Delivery Frequency
                      </label>
                      <div className="relative">
                        <button
                          type="button"
                          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                          className="w-full bg-white border border-gray-300 rounded-md px-3 py-2 text-left focus:outline-none focus:ring-2 focus:ring-[#FFC020] focus:border-[#FFC020]"
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <span className="block text-sm font-medium text-gray-900">
                                {intervalOptions.find(opt => opt.value === subscriptionConfig.interval)?.label}
                              </span>
                              <span className="block text-xs text-gray-500">
                                {intervalOptions.find(opt => opt.value === subscriptionConfig.interval)?.description}
                              </span>
                            </div>
                            <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${
                              isDropdownOpen ? 'rotate-180' : ''
                            }`} />
                          </div>
                        </button>

                        {isDropdownOpen && (
                          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg">
                            {intervalOptions.map((option) => (
                              <button
                                key={option.value}
                                type="button"
                                onClick={() => handleIntervalChange(option.value as SubscriptionConfig['interval'])}
                                className="w-full px-3 py-2 text-left hover:bg-gray-50 focus:outline-none focus:bg-gray-50"
                              >
                                <div className="flex items-center justify-between">
                                  <div>
                                    <span className="block text-sm font-medium text-gray-900">
                                      {option.label}
                                    </span>
                                    <span className="block text-xs text-gray-500">
                                      {option.description}
                                    </span>
                                  </div>
                                  {subscriptionConfig.interval === option.value && (
                                    <Check className="w-4 h-4 text-[#FFC020]" />
                                  )}
                                </div>
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Subscription Benefits */}
                    <div className="bg-gray-50 rounded-md p-3">
                      <h4 className="text-sm font-medium text-gray-900 mb-2">Subscription Benefits:</h4>
                      <ul className="text-sm text-gray-600 space-y-1">
                        <li className="flex items-center space-x-2">
                          <Check className="w-3 h-3 text-green-500" />
                          <span>Never run out of your favorite products</span>
                        </li>
                        <li className="flex items-center space-x-2">
                          <Check className="w-3 h-3 text-green-500" />
                          <span>Exclusive subscriber discounts</span>
                        </li>
                        <li className="flex items-center space-x-2">
                          <Check className="w-3 h-3 text-green-500" />
                          <span>Cancel or modify anytime</span>
                        </li>
                        <li className="flex items-center space-x-2">
                          <Check className="w-3 h-3 text-green-500" />
                          <span>Priority customer support</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            </label>
          </div>

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between pt-6">
            <button
              type="button"
              onClick={goToPreviousStep}
              className="inline-flex items-center gap-2 px-4 py-2 text-gray-600 font-medium transition-colors border border-gray-200 rounded-full hover:bg-gray-50"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>
            
            <button
              type="submit"
              className="inline-flex items-center gap-2 px-6 py-2 bg-[#FFC020] text-black font-medium rounded-full hover:bg-[#FFB000] transition-colors"
            >
              Continue
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}