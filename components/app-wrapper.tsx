"use client"

import { useState, useEffect } from 'react'
import PinLogin from './pin-login'
import { loadDefaultData, hasDefaultDataBeenLoaded } from '@/lib/default-data'

interface AppWrapperProps {
  children: React.ReactNode
}

export function AppWrapper({ children }: AppWrapperProps) {
  const [hasPin, setHasPin] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isLoadingDefaultData, setIsLoadingDefaultData] = useState(false)

  useEffect(() => {
    // Check if PIN is already set
    const savedPin = localStorage.getItem('chaos-data-pin')
    setHasPin(!!savedPin)
    setIsLoading(false)
  }, [])

  const handlePinEntered = async (pin: string) => {
    const savedPin = localStorage.getItem('chaos-data-pin')
    const isFirstTimeSetup = !savedPin

    if (isFirstTimeSetup) {
      // First-time PIN setup
      setIsLoadingDefaultData(true)

      try {
        // Save the PIN
        localStorage.setItem('chaos-data-pin', pin)

        // Load default data for plausible deniability
        if (!hasDefaultDataBeenLoaded()) {
          await loadDefaultData()
        }

        setHasPin(true)
      } catch (error) {
        console.error('Failed to set up default data:', error)
        alert('Failed to initialize app. Please try again.')
        localStorage.removeItem('chaos-data-pin')
      } finally {
        setIsLoadingDefaultData(false)
      }
    } else {
      // Returning user - verify PIN
      if (pin === savedPin) {
        setHasPin(true)
      } else {
        alert('Incorrect PIN')
        return
      }
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950 dark:to-pink-950 flex items-center justify-center">
        <div className="text-purple-600 dark:text-purple-300 text-lg">Loading...</div>
      </div>
    )
  }

  if (isLoadingDefaultData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950 dark:to-pink-950 flex items-center justify-center">
        <div className="text-center">
          <div className="text-purple-600 dark:text-purple-300 text-lg mb-2">Setting up your secure tracker...</div>
          <div className="text-purple-500 dark:text-purple-400 text-sm">Loading initial data for privacy</div>
        </div>
      </div>
    )
  }

  if (!hasPin) {
    return <PinLogin onPinEntered={handlePinEntered} />
  }

  return <>{children}</>
}
