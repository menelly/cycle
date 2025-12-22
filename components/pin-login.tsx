'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

interface PinLoginProps {
  onPinEntered: (pin: string, lmpDate?: Date, cycleLength?: number) => void
}

export default function PinLogin({ onPinEntered }: PinLoginProps) {
  const [pin, setPin] = useState('')
  const [error, setError] = useState('')


  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!pin.trim()) {
      setError('Please enter a PIN')
      return
    }

    if (pin.length < 4) {
      setError('PIN must be at least 4 characters')
      return
    }

    setError('')

    // Just submit the PIN
    onPinEntered(pin.trim())
  }



  const handlePinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPin(e.target.value)
    if (error) setError('') // Clear error when user starts typing
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950 dark:to-pink-950 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">🔐 Cycle Tracker</CardTitle>
          <CardDescription>
            Enter your PIN to access your secure fertility data
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handlePinSubmit} className="space-y-4">
            <div className="space-y-2">
              <Input
                type="password"
                placeholder="Enter your PIN"
                value={pin}
                onChange={handlePinChange}
                className="text-center text-lg tracking-widest"
                autoFocus
                maxLength={20}
              />
              {error && (
                <p className="text-sm text-red-500 text-center">{error}</p>
              )}
            </div>
            
            <Button type="submit" className="w-full" size="lg">
              🌸 Access Cycle Tracker
            </Button>
            
            <div className="text-xs text-muted-foreground text-center space-y-1 mt-4">
              <p>💡 Your fertility data is private and secure - keep your PIN safe</p>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
