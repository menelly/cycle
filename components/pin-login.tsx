'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { MobileCalendar } from '@/components/ui/mobile-calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { CalendarIcon, Info } from 'lucide-react'
import { format } from 'date-fns'
import { cn } from '@/lib/utils'

interface PinLoginProps {
  onPinEntered: (pin: string, lmpDate?: Date, cycleLength?: number) => void
}

export default function PinLogin({ onPinEntered }: PinLoginProps) {
  const [pin, setPin] = useState('')
  const [error, setError] = useState('')
  const [step, setStep] = useState<'pin' | 'cycle-info'>('pin')
  const [lmpDate, setLmpDate] = useState<Date | undefined>()
  const [cycleLength, setCycleLength] = useState<string>('')
  const [cycleLengthOption, setCycleLengthOption] = useState<'unknown' | 'known'>('unknown')
  const [isCalendarOpen, setIsCalendarOpen] = useState(false)

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

    // Check if PIN already exists (returning user)
    const savedPin = localStorage.getItem('chaos-data-pin')
    if (savedPin) {
      // Returning user - just verify PIN
      onPinEntered(pin.trim())
    } else {
      // New user - proceed to cycle info setup
      setStep('cycle-info')
    }
  }

  const handleCycleInfoSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Validate cycle length if provided
    if (cycleLengthOption === 'known') {
      const lengthNum = parseInt(cycleLength)
      if (!cycleLength || isNaN(lengthNum) || lengthNum < 21 || lengthNum > 45) {
        setError('Please enter a valid cycle length (21-45 days)')
        return
      }
    }

    setError('')

    // Submit all data
    const finalCycleLength = cycleLengthOption === 'known' ? parseInt(cycleLength) : undefined
    onPinEntered(pin.trim(), lmpDate, finalCycleLength)
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
          <form onSubmit={handleSubmit} className="space-y-4">
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
