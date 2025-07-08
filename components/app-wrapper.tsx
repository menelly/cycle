"use client"

import { useState, useEffect } from 'react'
import { StartupWizard } from './startup-wizard'
import { AIProvider } from '@/lib/contexts/ai-context'

interface AppWrapperProps {
  children: React.ReactNode
}

export function AppWrapper({ children }: AppWrapperProps) {
  const [isFirstRun, setIsFirstRun] = useState(true)
  const [aiEnabled, setAiEnabled] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check if this is the first run
    const hasCompletedSetup = localStorage.getItem('chaos-setup-complete')
    const savedAIPreference = localStorage.getItem('ai-enabled')
    
    if (hasCompletedSetup === 'true') {
      setIsFirstRun(false)
      setAiEnabled(savedAIPreference === 'true')
    }
    
    setIsLoading(false)
  }, [])

  const handleSetupComplete = (enableAI: boolean) => {
    setAiEnabled(enableAI)
    setIsFirstRun(false)
    localStorage.setItem('chaos-setup-complete', 'true')
    localStorage.setItem('ai-enabled', enableAI.toString())
  }

  if (isLoading) {
    // Simple loading state while checking setup status
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-purple-300 text-lg">Loading...</div>
      </div>
    )
  }

  if (isFirstRun) {
    return <StartupWizard onComplete={handleSetupComplete} />
  }

  return (
    <AIProvider>
      {children}
    </AIProvider>
  )
}
