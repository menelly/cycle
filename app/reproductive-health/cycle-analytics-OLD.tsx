"use client"

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { TrendingUp, TrendingDown, Minus, Calendar, Thermometer, Activity, Heart, Brain } from 'lucide-react'
import { ReproductiveHealthEntry } from './reproductive-health-tracker'
import { OvulationPredictor } from './ovulation-predictor'
import { format, differenceInDays, startOfDay, parseISO } from 'date-fns'

interface CycleAnalyticsProps {
  entries: ReproductiveHealthEntry[]
}

interface CycleStats {
  avgCycleLength: number
  cycleLengthTrend: 'increasing' | 'decreasing' | 'stable'
  avgPainLevel: number
  painTrend: 'increasing' | 'decreasing' | 'stable'
  mostCommonSymptoms: Array<{ name: string; count: number }>
  mostCommonMoods: Array<{ name: string; count: number }>
  totalCycles: number
  dataQuality: 'excellent' | 'good' | 'fair' | 'poor'
}

interface CycleData {
  cycleNumber: number
  startDate: string
  endDate: string
  length: number
  avgPain: number
  avgMood: number
  ovulationDay: number | null
}

export function CycleAnalytics({ entries }: CycleAnalyticsProps) {
  const [stats, setStats] = useState<CycleStats | null>(null)
  const [cycleData, setCycleData] = useState<CycleData[]>([])
  const [bbtData, setBbtData] = useState<Array<{ date: string; temp: number; cycleDay: number }>>([])

  useEffect(() => {
    if (entries.length > 0) {
      calculateAnalytics()
    }
  }, [entries])

  const calculateAnalytics = () => {
    // Identify cycles based on menstrual flow
    const cycles = identifyCycles(entries)
    setCycleData(cycles)

    // Calculate overall stats
    const calculatedStats = calculateCycleStats(cycles, entries)
    setStats(calculatedStats)

    // Prepare BBT data
    const bbtEntries = entries
      .filter(e => e.bbt !== null && e.bbt !== undefined)
      .map(e => ({
        date: e.date,
        temp: e.bbt!,
        cycleDay: calculateCycleDay(e.date, cycles)
      }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    
    setBbtData(bbtEntries)
  }

  const identifyCycles = (entries: ReproductiveHealthEntry[]): CycleData[] => {
    // Sort entries by date
    const sortedEntries = [...entries].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    
    // Find cycle starts (first day of flow after no flow)
    const cycleStarts: string[] = []
    let lastHadFlow = false
    
    for (const entry of sortedEntries) {
      const hasFlow = entry.flow !== 'none'
      if (hasFlow && !lastHadFlow) {
        cycleStarts.push(entry.date)
      }
      lastHadFlow = hasFlow
    }

    // Build cycle data
    const cycles: CycleData[] = []
    for (let i = 0; i < cycleStarts.length - 1; i++) {
      const startDate = cycleStarts[i]
      const endDate = cycleStarts[i + 1]
      const cycleEntries = sortedEntries.filter(e => 
        new Date(e.date) >= new Date(startDate) && 
        new Date(e.date) < new Date(endDate)
      )
      
      const length = differenceInDays(new Date(endDate), new Date(startDate))
      const avgPain = cycleEntries.reduce((sum, e) => sum + e.pain, 0) / cycleEntries.length
      const avgMood = cycleEntries.length // Simplified mood calculation
      
      // Try to detect ovulation day
      const ovulationDay = detectOvulationDay(cycleEntries)
      
      cycles.push({
        cycleNumber: i + 1,
        startDate,
        endDate,
        length,
        avgPain,
        avgMood,
        ovulationDay
      })
    }
    
    return cycles
  }

  const detectOvulationDay = (cycleEntries: ReproductiveHealthEntry[]): number | null => {
    // Look for BBT shift, OPK peak, or cervical fluid changes
    const bbtEntries = cycleEntries.filter(e => e.bbt !== null)
    const opkEntries = cycleEntries.filter(e => e.opk === 'peak')
    
    if (opkEntries.length > 0) {
      const opkDate = opkEntries[0].date
      const cycleStart = cycleEntries[0].date
      return differenceInDays(new Date(opkDate), new Date(cycleStart)) + 1
    }
    
    // BBT shift detection (simplified)
    if (bbtEntries.length >= 6) {
      for (let i = 3; i < bbtEntries.length - 2; i++) {
        const before = bbtEntries.slice(i - 3, i).map(e => e.bbt!)
        const after = bbtEntries.slice(i, i + 3).map(e => e.bbt!)
        
        const avgBefore = before.reduce((a, b) => a + b, 0) / before.length
        const avgAfter = after.reduce((a, b) => a + b, 0) / after.length
        
        if (avgAfter - avgBefore >= 0.2) { // 0.2°F shift
          const shiftDate = bbtEntries[i].date
          const cycleStart = cycleEntries[0].date
          return differenceInDays(new Date(shiftDate), new Date(cycleStart)) + 1
        }
      }
    }
    
    return null
  }

  const calculateCycleDay = (date: string, cycles: CycleData[]): number => {
    for (const cycle of cycles) {
      if (new Date(date) >= new Date(cycle.startDate) && new Date(date) < new Date(cycle.endDate)) {
        return differenceInDays(new Date(date), new Date(cycle.startDate)) + 1
      }
    }
    return 1
  }

  const calculateCycleStats = (cycles: CycleData[], entries: ReproductiveHealthEntry[]): CycleStats => {
    if (cycles.length === 0) {
      return {
        avgCycleLength: 0,
        cycleLengthTrend: 'stable',
        avgPainLevel: 0,
        painTrend: 'stable',
        mostCommonSymptoms: [],
        mostCommonMoods: [],
        totalCycles: 0,
        dataQuality: 'poor'
      }
    }

    // Cycle length analysis
    const cycleLengths = cycles.map(c => c.length)
    const avgCycleLength = cycleLengths.reduce((a, b) => a + b, 0) / cycleLengths.length

    // Trend analysis
    const cycleLengthTrend = detectTrend(cycleLengths)
    const painLevels = entries.map(e => e.pain)
    const painTrend = detectTrend(painLevels)
    const avgPainLevel = painLevels.reduce((a, b) => a + b, 0) / painLevels.length

    // Symptom frequency
    const symptomCounts: Record<string, number> = {}
    const moodCounts: Record<string, number> = {}
    
    entries.forEach(entry => {
      entry.symptoms.forEach(symptom => {
        symptomCounts[symptom] = (symptomCounts[symptom] || 0) + 1
      })
      entry.mood.forEach(mood => {
        moodCounts[mood] = (moodCounts[mood] || 0) + 1
      })
    })

    const mostCommonSymptoms = Object.entries(symptomCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([name, count]) => ({ name, count }))

    const mostCommonMoods = Object.entries(moodCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([name, count]) => ({ name, count }))

    // Data quality assessment
    const dataQuality = entries.length > 90 ? 'excellent' : 
                       entries.length > 60 ? 'good' : 
                       entries.length > 30 ? 'fair' : 'poor'

    return {
      avgCycleLength: Math.round(avgCycleLength),
      cycleLengthTrend,
      avgPainLevel: Math.round(avgPainLevel * 10) / 10,
      painTrend,
      mostCommonSymptoms,
      mostCommonMoods,
      totalCycles: cycles.length,
      dataQuality
    }
  }

  const detectTrend = (data: number[]): 'increasing' | 'decreasing' | 'stable' => {
    if (data.length < 4) return 'stable'
    
    const firstHalf = data.slice(0, Math.floor(data.length / 2))
    const secondHalf = data.slice(Math.floor(data.length / 2))
    
    const firstAvg = firstHalf.reduce((a, b) => a + b, 0) / firstHalf.length
    const secondAvg = secondHalf.reduce((a, b) => a + b, 0) / secondHalf.length
    
    const threshold = 0.15 // 15% change threshold
    const change = (secondAvg - firstAvg) / firstAvg
    
    if (change > threshold) return 'increasing'
    if (change < -threshold) return 'decreasing'
    return 'stable'
  }

  const getTrendIcon = (trend: 'increasing' | 'decreasing' | 'stable') => {
    switch (trend) {
      case 'increasing': return <TrendingUp className="h-4 w-4 text-red-500" />
      case 'decreasing': return <TrendingDown className="h-4 w-4 text-green-500" />
      default: return <Minus className="h-4 w-4 text-gray-500" />
    }
  }

  const getTrendColor = (trend: 'increasing' | 'decreasing' | 'stable', isGoodWhenIncreasing: boolean = false) => {
    if (trend === 'stable') return 'text-gray-600'
    if (isGoodWhenIncreasing) {
      return trend === 'increasing' ? 'text-green-600' : 'text-red-600'
    } else {
      return trend === 'increasing' ? 'text-red-600' : 'text-green-600'
    }
  }

  if (!stats) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <TrendingUp className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-semibold mb-2">📊 Building Your Analytics</h3>
          <p className="text-muted-foreground">
            Keep tracking your cycle data to unlock powerful insights and predictions!
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Overview Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg Cycle</p>
                <p className="text-2xl font-bold">{stats.avgCycleLength} days</p>
              </div>
              <div className="flex items-center gap-1">
                {getTrendIcon(stats.cycleLengthTrend)}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg Pain</p>
                <p className="text-2xl font-bold">{stats.avgPainLevel}/10</p>
              </div>
              <div className="flex items-center gap-1">
                {getTrendIcon(stats.painTrend)}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div>
              <p className="text-sm text-muted-foreground">Total Cycles</p>
              <p className="text-2xl font-bold">{stats.totalCycles}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div>
              <p className="text-sm text-muted-foreground">Data Quality</p>
              <Badge variant={
                stats.dataQuality === 'excellent' ? 'default' :
                stats.dataQuality === 'good' ? 'secondary' :
                stats.dataQuality === 'fair' ? 'outline' : 'destructive'
              }>
                {stats.dataQuality}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Analytics Tabs */}
      <Tabs defaultValue="cycles" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="cycles">Cycles</TabsTrigger>
          <TabsTrigger value="symptoms">Symptoms</TabsTrigger>
          <TabsTrigger value="bbt">BBT</TabsTrigger>
          <TabsTrigger value="patterns">Patterns</TabsTrigger>
        </TabsList>

        <TabsContent value="cycles" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Cycle Length Trends
              </CardTitle>
              <CardDescription>
                Track how your cycle length changes over time
              </CardDescription>
            </CardHeader>
            <CardContent>
              {cycleData.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={cycleData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="cycleNumber" />
                    <YAxis />
                    <Tooltip
                      formatter={(value, name) => [`${value} days`, 'Cycle Length']}
                      labelFormatter={(label) => `Cycle ${label}`}
                    />
                    <Line
                      type="monotone"
                      dataKey="length"
                      stroke="#8884d8"
                      strokeWidth={2}
                      dot={{ fill: '#8884d8', strokeWidth: 2, r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  Need at least 2 complete cycles to show trends
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="symptoms" className="mt-6">
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Most Common Symptoms
                </CardTitle>
              </CardHeader>
              <CardContent>
                {stats.mostCommonSymptoms.length > 0 ? (
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={stats.mostCommonSymptoms}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="count" fill="#f97316" />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    No symptom data yet
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="h-5 w-5" />
                  Most Common Moods
                </CardTitle>
              </CardHeader>
              <CardContent>
                {stats.mostCommonMoods.length > 0 ? (
                  <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                      <Pie
                        data={stats.mostCommonMoods}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="count"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {stats.mostCommonMoods.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={`hsl(${index * 45}, 70%, 60%)`} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    No mood data yet
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="bbt" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Thermometer className="h-5 w-5" />
                BBT Temperature Curve
              </CardTitle>
              <CardDescription>
                Your basal body temperature patterns throughout cycles
              </CardDescription>
            </CardHeader>
            <CardContent>
              {bbtData.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={bbtData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="date"
                      tickFormatter={(date) => format(new Date(date), 'MM/dd')}
                    />
                    <YAxis
                      domain={['dataMin - 0.5', 'dataMax + 0.5']}
                      tickFormatter={(temp) => `${temp}°F`}
                    />
                    <Tooltip
                      formatter={(value) => [`${value}°F`, 'BBT']}
                      labelFormatter={(date) => format(new Date(date), 'MMM dd, yyyy')}
                    />
                    <Line
                      type="monotone"
                      dataKey="temp"
                      stroke="#dc2626"
                      strokeWidth={2}
                      dot={{ fill: '#dc2626', strokeWidth: 2, r: 3 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  Start tracking BBT to see temperature patterns
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="patterns" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5" />
                Cycle Insights & Patterns
              </CardTitle>
              <CardDescription>
                AI-powered insights from your cycle data
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Cycle Length Insights */}
                <div className="p-4 border rounded-lg">
                  <h4 className="font-semibold mb-2">📊 Cycle Length Analysis</h4>
                  <p className="text-sm text-muted-foreground mb-2">
                    Your average cycle is {stats.avgCycleLength} days, which is {
                      stats.avgCycleLength >= 21 && stats.avgCycleLength <= 35 ?
                      'within the normal range (21-35 days)' :
                      stats.avgCycleLength < 21 ? 'shorter than typical' :
                      'longer than typical'
                    }.
                  </p>
                  <div className="flex items-center gap-2">
                    <span className="text-sm">Trend:</span>
                    {getTrendIcon(stats.cycleLengthTrend)}
                    <span className={`text-sm ${getTrendColor(stats.cycleLengthTrend)}`}>
                      {stats.cycleLengthTrend === 'stable' ? 'Consistent' :
                       stats.cycleLengthTrend === 'increasing' ? 'Getting longer' : 'Getting shorter'}
                    </span>
                  </div>
                </div>

                {/* Pain Insights */}
                <div className="p-4 border rounded-lg">
                  <h4 className="font-semibold mb-2">🩹 Pain Pattern Analysis</h4>
                  <p className="text-sm text-muted-foreground mb-2">
                    Your average pain level is {stats.avgPainLevel}/10, which is {
                      stats.avgPainLevel <= 3 ? 'mild' :
                      stats.avgPainLevel <= 6 ? 'moderate' : 'severe'
                    }.
                  </p>
                  <div className="flex items-center gap-2">
                    <span className="text-sm">Trend:</span>
                    {getTrendIcon(stats.painTrend)}
                    <span className={`text-sm ${getTrendColor(stats.painTrend, false)}`}>
                      {stats.painTrend === 'stable' ? 'Consistent' :
                       stats.painTrend === 'increasing' ? 'Increasing (consider tracking triggers)' : 'Decreasing (great progress!)'}
                    </span>
                  </div>
                </div>

                {/* Data Quality */}
                <div className="p-4 border rounded-lg">
                  <h4 className="font-semibold mb-2">📈 Data Quality Assessment</h4>
                  <p className="text-sm text-muted-foreground">
                    Your tracking consistency is <strong>{stats.dataQuality}</strong>.
                    {stats.dataQuality === 'excellent' && ' Amazing work! Your data provides highly reliable insights.'}
                    {stats.dataQuality === 'good' && ' Great job! Keep tracking for even better predictions.'}
                    {stats.dataQuality === 'fair' && ' Good start! More data will improve accuracy.'}
                    {stats.dataQuality === 'poor' && ' Keep tracking daily for better insights and predictions.'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
