"use client"

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, BookOpen, Settings, Plus } from 'lucide-react'
import { useDailyData } from '@/lib/database'
import { format, differenceInDays } from 'date-fns'
import { getTodayLocalDate } from '@/lib/utils/dateUtils'

interface TodayStats {
  cycleDay: number | null
  daysUntilPeriod: number | null
  fertilityStatus: 'fertile' | 'not-fertile' | 'ovulation' | 'unknown'
  hasLoggedToday: boolean
  lastPeriodDate: string | null
}

/**
 * MINIMAL DAILY VIEW HOME PAGE
 *
 * Clean, focused daily dashboard for cycle tracking
 */
export default function MainPage() {
  const [todayStats, setTodayStats] = useState<TodayStats>({
    cycleDay: null,
    daysUntilPeriod: null,
    fertilityStatus: 'unknown',
    hasLoggedToday: false,
    lastPeriodDate: null
  })
  const [isLoading, setIsLoading] = useState(true)
  const [isClient, setIsClient] = useState(false)
  const { getSpecificData } = useDailyData()

  const loadTodayStats = useCallback(async () => {
    try {
      const today = getTodayLocalDate()

      // Check if user has logged anything today
      const todayData = await getSpecificData(today, 'tracker', 'reproductive-health')
      const hasLoggedToday = !!todayData

      // Get recent reproductive health entries to calculate cycle info
      const recentEntries = []
      for (let i = 0; i < 60; i++) { // Look back 60 days
        const lookbackDate = new Date()
        lookbackDate.setDate(lookbackDate.getDate() - i)
        const date = format(lookbackDate, 'yyyy-MM-dd')
        const entry = await getSpecificData(date, 'tracker', 'reproductive-health')
        if (entry && typeof entry.content === 'object' && entry.content !== null) {
          recentEntries.push({ date, ...(entry.content as Record<string, unknown>) })
        }
      }

      // Find last period start (need to find the PREVIOUS cycle start, not current period)
      let lastPeriodDate = null
      let cycleDay = null

      // Sort entries chronologically to find period starts properly
      const sortedEntries = recentEntries.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

      // Find all period starts (first day of flow after no flow)
      const periodStarts = []
      for (let i = 0; i < sortedEntries.length; i++) {
        const entry = sortedEntries[i] as { date: string; flow?: string }
        if (entry.flow && entry.flow !== 'none') {
          // Check if this is the start of a period
          if (i === 0) {
            // First entry with flow is a period start
            periodStarts.push(entry.date)
          } else {
            // Check if previous day had no flow
            const prevEntry = sortedEntries[i - 1] as { date: string; flow?: string }
            const entryDate = new Date(entry.date)
            const prevDate = new Date(prevEntry.date)
            const daysDiff = differenceInDays(entryDate, prevDate)

            if (daysDiff === 1 && (!prevEntry.flow || prevEntry.flow === 'none')) {
              // Previous day had no flow, this is a period start
              periodStarts.push(entry.date)
            } else if (daysDiff > 1) {
              // Gap in data, assume this is a period start
              periodStarts.push(entry.date)
            }
          }
        }
      }

      // Find the most recent period start that's not today's period
      const todayEntry = recentEntries.find(e => e.date === today) as { date: string; flow?: string } | undefined
      const isCurrentlyOnPeriod = todayEntry?.flow && todayEntry.flow !== 'none'

      if (periodStarts.length > 0) {
        if (isCurrentlyOnPeriod && periodStarts.length > 1) {
          // If currently on period, use the previous period start for cycle calculation
          lastPeriodDate = periodStarts[periodStarts.length - 2]
        } else {
          // Use the most recent period start
          lastPeriodDate = periodStarts[periodStarts.length - 1]
        }

        if (lastPeriodDate) {
          cycleDay = differenceInDays(new Date(today), new Date(lastPeriodDate)) + 1
        }
      }

      // Estimate fertility status based on cycle day
      let fertilityStatus: 'fertile' | 'not-fertile' | 'ovulation' | 'unknown' = 'unknown'
      if (cycleDay) {
        if (cycleDay >= 10 && cycleDay <= 18) {
          fertilityStatus = cycleDay >= 13 && cycleDay <= 15 ? 'ovulation' : 'fertile'
        } else {
          fertilityStatus = 'not-fertile'
        }
      }

      // Estimate days until next period (assuming 28-day cycle)
      let daysUntilPeriod = null
      if (cycleDay) {
        const estimatedCycleLength = 28 // Could be made smarter with historical data
        daysUntilPeriod = estimatedCycleLength - cycleDay
        if (daysUntilPeriod < 0) daysUntilPeriod = null
      }

      setTodayStats({
        cycleDay,
        daysUntilPeriod,
        fertilityStatus,
        hasLoggedToday,
        lastPeriodDate
      })
    } catch (error) {
      console.error('Error loading today stats:', error)
    } finally {
      setIsLoading(false)
    }
  }, [getSpecificData])

  useEffect(() => {
    setIsClient(true)
    // Only load stats on client side to prevent hydration mismatch
    if (typeof window !== 'undefined') {
      loadTodayStats()
    }
  }, [loadTodayStats])

  const getFertilityStatusColor = (status: string) => {
    switch (status) {
      case 'ovulation': return 'bg-destructive/10 text-destructive border-destructive/20'
      case 'fertile': return 'bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20'
      case 'not-fertile': return 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20'
      default: return 'bg-muted text-muted-foreground border-border'
    }
  }

  const getFertilityStatusText = (status: string) => {
    switch (status) {
      case 'ovulation': return '🥚 Ovulation Window'
      case 'fertile': return '🌱 Fertile Window'
      case 'not-fertile': return '🌙 Not Fertile'
      default: return '❓ Unknown'
    }
  }

  if (!isClient || isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-muted flex items-center justify-center">
        <div className="text-primary text-lg">Loading your day...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted">
      <div className="container mx-auto p-4 space-y-6">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-primary mb-1">
            🌸 Today
          </h1>
          <p className="text-lg text-muted-foreground">
            {isClient ? format(new Date(), 'EEEE, MMMM do') : 'Loading date...'}
          </p>
        </div>

        {/* Today's Overview */}
        <Card className="mb-6 bg-card/80 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
              {/* Cycle Day */}
              <div>
                <div className="text-3xl font-bold text-primary mb-1">
                  {todayStats.cycleDay ? `Day ${todayStats.cycleDay}` : '—'}
                </div>
                <div className="text-sm text-muted-foreground">of your cycle</div>
              </div>

              {/* Fertility Status */}
              <div>
                <Badge className={`mb-2 ${getFertilityStatusColor(todayStats.fertilityStatus)}`}>
                  {getFertilityStatusText(todayStats.fertilityStatus)}
                </Badge>
                <div className="text-sm text-muted-foreground">
                  {todayStats.daysUntilPeriod
                    ? `~${todayStats.daysUntilPeriod} days until period`
                    : 'Period timing unknown'
                  }
                </div>
              </div>

              {/* Today's Status */}
              <div>
                <div className={`text-2xl mb-1 ${todayStats.hasLoggedToday ? 'text-green-600 dark:text-green-400' : 'text-orange-600 dark:text-orange-400'}`}>
                  {todayStats.hasLoggedToday ? '✅' : '⏰'}
                </div>
                <div className="text-sm text-muted-foreground">
                  {todayStats.hasLoggedToday ? 'Logged today' : 'Not logged yet'}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Action */}
        <div className="mb-6">
          <Link href="/reproductive-health">
            <Button className="w-full h-16 bg-primary hover:bg-primary/90 text-primary-foreground">
              <div className="flex flex-col items-center gap-1">
                <Plus className="h-5 w-5" />
                <span className="text-sm font-medium">Log Today</span>
              </div>
            </Button>
          </Link>
        </div>

        {/* Navigation Cards */}
        <div className="grid gap-4 md:grid-cols-3">
          <Link href="/reproductive-health">
            <Card className="cursor-pointer hover:bg-accent/50 transition-colors">
              <CardHeader className="text-center py-4">
                <Calendar className="h-6 w-6 mx-auto text-primary mb-2" />
                <CardTitle className="text-base">Track Cycle</CardTitle>
                <CardDescription className="text-xs">
                  Log cycle, BBT, symptoms
                </CardDescription>
              </CardHeader>
            </Card>
          </Link>

          <Link href="/journal">
            <Card className="cursor-pointer hover:bg-accent/50 transition-colors">
              <CardHeader className="text-center py-4">
                <BookOpen className="h-6 w-6 mx-auto text-primary mb-2" />
                <CardTitle className="text-base">Journal</CardTitle>
                <CardDescription className="text-xs">
                  Daily notes & thoughts
                </CardDescription>
              </CardHeader>
            </Card>
          </Link>

          <Link href="/settings">
            <Card className="cursor-pointer hover:bg-accent/50 transition-colors">
              <CardHeader className="text-center py-4">
                <Settings className="h-6 w-6 mx-auto text-primary mb-2" />
                <CardTitle className="text-base">Settings</CardTitle>
                <CardDescription className="text-xs">
                  Privacy & preferences
                </CardDescription>
              </CardHeader>
            </Card>
          </Link>
        </div>

        {/* Privacy Note */}
        <div className="text-center mt-6">
          <p className="text-xs text-muted-foreground">
            🔒 Your data is private and secure - protected by your PIN
          </p>
        </div>
      </div>
    </div>
  )
}