import React, { useState } from 'react'
import { PricingTier } from '../../lib/paddle-config'
import { Button } from './ui/Button'
import { supabase } from '../lib/supabase'

interface ProductCardProps {
  product: PricingTier
  onCheckout?: () => void
}

export function ProductCard({ product, onCheckout }: ProductCardProps) {
  const [loading, setLoading] = useState(false)

  const handleCheckout = async () => {
    setLoading(true)
    onCheckout?.()

    try {
      const { data: { session } } = await supabase.auth.getSession()

      if (!session) {
        throw new Error('Please sign in to continue')
      }

      const response = await fetch('/api/paddle/create-checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tier: product.id,
          billingCycle: 'monthly'
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create checkout session')
      }

      if (data.url) {
        window.location.href = data.url
      }
    } catch (error) {
      console.error('Checkout error:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200 hover:shadow-xl transition-shadow">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">{product.name}</h3>
        <p className="text-gray-600 mb-4">{product.description}</p>

        <div className="mb-6">
          <span className="text-4xl font-bold text-gray-900">
            ${product.monthlyPrice}
          </span>
          <span className="text-gray-600 ml-1">/month</span>
        </div>

        <Button
          onClick={handleCheckout}
          loading={loading}
          className="w-full"
          size="lg"
        >
          {loading ? 'Processing...' : `Get ${product.name}`}
        </Button>
      </div>
    </div>
  )
}