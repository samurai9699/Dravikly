import React, { useState } from 'react'
import { stripeProducts } from '../stripe-config'
import { ProductCard } from '../components/ProductCard'
import { useAuth } from '../hooks/useAuth'
import { Alert } from '../components/ui/Alert'

interface PricingPageProps {
  onNavigate: (page: string) => void
}

export function PricingPage({ onNavigate }: PricingPageProps) {
  const { user } = useAuth()
  const [checkoutError, setCheckoutError] = useState<string | null>(null)

  const handleCheckout = () => {
    setCheckoutError(null)
    
    if (!user) {
      setCheckoutError('Please sign in to continue with checkout')
      return
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Choose Your Plan
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Select the perfect plan for your needs. All plans include our core features with additional benefits.
          </p>
        </div>

        {checkoutError && (
          <div className="max-w-2xl mx-auto mb-8">
            <Alert 
              type="error" 
              onClose={() => setCheckoutError(null)}
            >
              {checkoutError}
              {!user && (
                <button
                  onClick={() => onNavigate('auth')}
                  className="ml-2 underline hover:no-underline"
                >
                  Sign in now
                </button>
              )}
            </Alert>
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {stripeProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onCheckout={handleCheckout}
            />
          ))}
        </div>

        {!user && (
          <div className="text-center mt-12">
            <p className="text-gray-600 mb-4">
              Need an account first?
            </p>
            <button
              onClick={() => onNavigate('auth')}
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              Sign up for free →
            </button>
          </div>
        )}
      </div>
    </div>
  )
}