"use client"

import React, { useState, useEffect } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Thermometer } from 'lucide-react'
import { format } from 'date-fns'

interface BBTEntry {
  date: string
  bbt: number | null
}

interface BBTChartProps {
  entries: BBTEntry[]
  className?: string
}

export function BBTChart({ entries, className }: BBTChartProps) {
  // Fix hydration mismatch with client-side state
  const [isClient, setIsClient] = useState(false)
  const [bbtData, setBbtData] = useState<any[]>([])

  useEffect(() => {
    setIsClient(true)
    // Process data on client side to avoid hydration mismatch
    const processedData = entries
      .filter(entry => entry.bbt !== null && entry.bbt !== undefined)
      .map(entry => ({
        date: entry.date,
        temp: entry.bbt,
        displayDate: format(new Date(entry.date), 'MM/dd')
      }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

    setBbtData(processedData)
  }, [entries])

  // Show loading state during hydration
  if (!isClient) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Thermometer className="h-5 w-5" />
            BBT Temperature Chart
          </CardTitle>
          <CardDescription>Loading chart...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            <div className="h-64 bg-muted rounded"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (bbtData.length === 0) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Thermometer className="h-5 w-5" />
            BBT Temperature Chart
          </CardTitle>
          <CardDescription>
            Track your basal body temperature patterns
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-64 text-muted-foreground">
            <div className="text-center">
              <Thermometer className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No BBT data recorded yet</p>
              <p className="text-sm">Start logging your morning temperature to see patterns</p>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Thermometer className="h-5 w-5" />
          BBT Temperature Chart
        </CardTitle>
        <CardDescription>
          Your basal body temperature over time ({bbtData.length} readings)
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={bbtData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="displayDate"
              tick={{ fontSize: 12 }}
            />
            <YAxis
              domain={['dataMin - 0.5', 'dataMax + 0.5']}
              tickFormatter={(temp) => `${temp}°F`}
              tick={{ fontSize: 12 }}
            />
            <Tooltip
              formatter={(value: number) => [`${value}°F`, 'BBT']}
              labelFormatter={(date) => `Date: ${date}`}
            />
            <Line
              type="monotone"
              dataKey="temp"
              stroke="#8884d8"
              strokeWidth={2}
              dot={{ fill: '#8884d8', strokeWidth: 2, r: 4 }}
              connectNulls={false}
            />
          </LineChart>
        </ResponsiveContainer>
        
        <div className="mt-4 text-sm text-muted-foreground">
          <p>💡 <strong>Reading your chart:</strong> Look for a temperature rise of 0.2°F+ that stays elevated for 3+ days - this indicates ovulation occurred.</p>
        </div>
      </CardContent>
    </Card>
  )
}
