import React from 'react'
import { useAuth } from '../src/hooks/useAuth'
import { useSubscription } from '../src/hooks/useSubscription'
import { Button } from './ui/button'
import { Crown, Star, Zap } from 'lucide-react'

interface HomePageProps {
  onNavigate: (page: string) => void
}

export function HomePage({ onNavigate }: HomePageProps) {
  const { user } = useAuth()
  const { getActivePlan } = useSubscription()
  const activePlan = getActivePlan()

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 sm:text-6xl mb-6">
            Welcome to MyApp
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            The ultimate platform for productivity and success. Choose your plan and unlock powerful features.
          </p>

          {user ? (
            <div className="bg-white rounded-lg shadow-lg p-8 max-w-md mx-auto">
              <div className="flex items-center justify-center mb-4">
                <Crown className="h-8 w-8 text-blue-600 mr-2" />
                <h2 className="text-2xl font-bold text-gray-900">Your Plan</h2>
              </div>

              {activePlan ? (
                <div className="text-center">
                  <div className="bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-lg font-semibold mb-4">
                    {activePlan} Plan
                  </div>
                  <p className="text-gray-600 mb-6">
                    You have access to all {activePlan.toLowerCase()} features!
                  </p>
                </div>
              ) : (
                <div className="text-center">
                  <p className="text-gray-600 mb-6">
                    You don't have an active subscription yet.
                  </p>
                  <Button
                    onClick={() => onNavigate('pricing')}
                    size="lg"
                  >
                    View Plans
                  </Button>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-6">
              <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto mb-12">
                <div className="text-center">
                  <div className="bg-blue-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                    <Star className="h-8 w-8 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Premium Features</h3>
                  <p className="text-gray-600">Access advanced tools and capabilities</p>
                </div>

                <div className="text-center">
                  <div className="bg-blue-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                    <Zap className="h-8 w-8 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Lightning Fast</h3>
                  <p className="text-gray-600">Optimized for speed and performance</p>
                </div>

                <div className="text-center">
                  <div className="bg-blue-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                    <Crown className="h-8 w-8 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Professional</h3>
                  <p className="text-gray-600">Built for professionals and teams</p>
                </div>
              </div>

              <div className="space-x-4">
                <Button
                  onClick={() => onNavigate('auth')}
                  size="lg"
                >
                  Get Started
                </Button>
                <Button
                  onClick={() => onNavigate('pricing')}
                  variant="outline"
                  size="lg"
                >
                  View Pricing
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}