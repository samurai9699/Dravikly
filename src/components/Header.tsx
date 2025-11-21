import React from 'react'
import { useAuth } from '../hooks/useAuth'
import { useSubscription } from '../hooks/useSubscription'
import { Button } from './ui/Button'
import { User, Crown } from 'lucide-react'

interface HeaderProps {
  onNavigate: (page: string) => void
}

export function Header({ onNavigate }: HeaderProps) {
  const { user, signOut } = useAuth()
  const { getActivePlan } = useSubscription()
  const activePlan = getActivePlan()

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <button
              onClick={() => onNavigate('home')}
              className="text-xl font-bold text-gray-900 hover:text-blue-600"
            >
              MyApp
            </button>
          </div>

          <nav className="hidden md:flex space-x-8">
            <button
              onClick={() => onNavigate('home')}
              className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium"
            >
              Home
            </button>
            <button
              onClick={() => onNavigate('pricing')}
              className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium"
            >
              Pricing
            </button>
          </nav>

          <div className="flex items-center space-x-4">
            {user ? (
              <>
                {activePlan && (
                  <div className="flex items-center space-x-1 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                    <Crown className="h-4 w-4" />
                    <span>{activePlan}</span>
                  </div>
                )}
                <div className="flex items-center space-x-2">
                  <User className="h-5 w-5 text-gray-600" />
                  <span className="text-sm text-gray-700">{user.email}</span>
                </div>
                <Button
                  onClick={signOut}
                  variant="outline"
                  size="sm"
                >
                  Sign Out
                </Button>
              </>
            ) : (
              <Button
                onClick={() => onNavigate('auth')}
                size="sm"
              >
                Sign In
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}