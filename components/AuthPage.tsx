import React, { useState } from 'react'
import { AuthForm } from '@/src/components/AuthForm'

export function AuthPage() {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin')

  const toggleMode = () => {
    setMode(mode === 'signin' ? 'signup' : 'signin')
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <AuthForm mode={mode} onToggleMode={toggleMode} />
    </div>
  )
}