import React, { useEffect } from 'react'
import { useSubscription } from '../src/hooks/useSubscription'
import { Button } from './ui/button'
import { CircleCheck as CheckCircle, Crown } from 'lucide-react'

interface SuccessPageProps {
  onNavigate: (page: string) => void
}

export function SuccessPage({ onNavigate }: SuccessPageProps) {
  const { refetch } = useSubscription()

  useEffect(() => {
    // Refetch subscription data after successful payment
    const timer = setTimeout(() => {
      refetch()
    }, 2000)

    return () => clearTimeout(timer)
  }, [refetch])

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        <div className="flex justify-center mb-6">
          <div className="bg-green-100 rounded-full p-4">
            <CheckCircle className="h-12 w-12 text-green-600" />
          </div>
        </div>

        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Payment Successful!
        </h1>

        <p className="text-gray-600 mb-6">
          Thank you for your purchase. Your subscription is now active and you have access to all premium features.
        </p>

        <div className="bg-blue-50 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-center mb-2">
            <Crown className="h-5 w-5 text-blue-600 mr-2" />
            <span className="font-semibold text-blue-900">Premium Access Activated</span>
          </div>
          <p className="text-sm text-blue-700">
            You can now enjoy all the benefits of your subscription plan.
          </p>
        </div>

        <div className="space-y-3">
          <Button
            onClick={() => onNavigate('home')}
            className="w-full"
            size="lg"
          >
            Go to Dashboard
          </Button>

          <Button
            onClick={() => onNavigate('pricing')}
            variant="outline"
            className="w-full"
          >
            View All Plans
          </Button>
        </div>
      </div>
    </div>
  )
}