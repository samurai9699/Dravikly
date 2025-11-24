import React, { useState } from 'react'
import { useAuth } from './hooks/useAuth'
import { Header } from './components/Header'
import { AuthPage } from './pages-old/AuthPage'
import { PricingPage } from './pages-old/PricingPage'
import { SuccessPage } from './pages-old/SuccessPage'

function App() {
  const { user, loading } = useAuth()
  const [currentPage, setCurrentPage] = useState('home')

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'auth':
        return <AuthPage />
      case 'pricing':
        return <PricingPage onNavigate={setCurrentPage} />
      case 'success':
        return <SuccessPage onNavigate={setCurrentPage} />
      default:
        return <HomePage onNavigate={setCurrentPage} />
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onNavigate={setCurrentPage} />
      {renderPage()}
    </div>
  )
}

export default App