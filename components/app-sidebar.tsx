"use client"

import { useState, useEffect } from "react"
import { X, Menu } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { getWeekOfYear } from "@/lib/utils/dateUtils"

export default function AppSidebar() {
  // Start with undefined to prevent hydration mismatch
  const [showSidebar, setShowSidebar] = useState<boolean | undefined>(undefined)
  const [shortcuts, setShortcuts] = useState<Array<{id: string, name: string, icon: string, category: string}>>([])
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null)
  const [holdTimer, setHoldTimer] = useState<NodeJS.Timeout | null>(null)
  const [holdingShortcut, setHoldingShortcut] = useState<string | null>(null)

  // Default sidebar items with themed button classes
  const sidebarItems = [
    {
      id: "body",
      text: "Body",
      emoji: "🫀",
      targetPageId: "body",
      isVisible: true,
      buttonClass: "sidebar-btn-1"
    },
    {
      id: "mind",
      text: "Mind",
      emoji: "🧠",
      targetPageId: "mind",
      isVisible: true,
      buttonClass: "sidebar-btn-5"
    },
    {
      id: "choice",
      text: "Choice",
      emoji: "💪",
      targetPageId: "choice",
      isVisible: true,
      buttonClass: "sidebar-btn-3"
    },
    {
      id: "planning",
      text: "Plan",
      emoji: "📅",
      targetPageId: "planning",
      isVisible: true,
      buttonClass: "sidebar-btn-2"
    },
    {
      id: "manage",
      text: "Manage",
      emoji: "📋",
      targetPageId: "manage",
      isVisible: true,
      buttonClass: "sidebar-btn-4"
    },
    {
      id: "patterns",
      text: "Patterns",
      emoji: "📊",
      targetPageId: "patterns",
      isVisible: true,
      buttonClass: "sidebar-btn-6"
    },
    {
      id: "journal",
      text: "Journal",
      emoji: "📝",
      targetPageId: "journal",
      isVisible: true,
      buttonClass: "sidebar-btn-2"
    },
    {
      id: "guide",
      text: "Guide",
      emoji: "🧭",
      targetPageId: "guide",
      isVisible: true,
      buttonClass: "sidebar-btn-guide"
    },

  ]

  // Available trackers for shortcuts
  const availableTrackers = {
    'body': [
      { id: 'pain-tracking', name: 'Pain Tracking', icon: '🤕' },
      { id: 'energy', name: 'Energy & Pacing', icon: '⚡' },
      { id: 'sleep', name: 'Sleep Tracker', icon: '😴' },
    ],
    'mind': [
      { id: 'brain-fog', name: 'Brain Fog', icon: '🧠' },
      { id: 'mood-check', name: 'Mood Check', icon: '🎭' },
      { id: 'anxiety-tracker', name: 'Anxiety', icon: '😰' },
    ],
    'planning': [
      { id: 'monthly-calendar', name: 'Monthly Calendar', icon: '📆' },
      { id: 'task-lists', name: 'Task Lists', icon: '✅' },
      { id: 'goals-tracker', name: 'Goals', icon: '🎯' },
    ],
    'manage': [
      { id: 'medications', name: 'Medications & Supplements', icon: '💊', href: '/medications' },
      { id: 'providers', name: 'Healthcare Providers', icon: '👩‍⚕️', href: '/providers' },
      { id: 'timeline', name: 'Diagnoses & Timeline', icon: '📋', href: '/timeline' },
      { id: 'missed-work', name: 'Missed Work', icon: '💼' },
      { id: 'chore-chart', name: 'Chore Chart', icon: '🏠' },
    ],
    'patterns': [
      { id: 'symptom-correlations', name: 'Symptom Correlations', icon: '📈' },
      { id: 'data-analytics', name: 'Data Analytics', icon: '📊' },
      { id: 'health-timeline', name: 'Health Timeline', icon: '⏱️' },
    ],
    'journal': [
      { id: 'brain-dump', name: 'Brain Dump', icon: '🧠' },
      { id: 'gratitude-journal', name: 'Gratitude', icon: '😊' },
    ],
    'fun-motivation': [
      { id: 'creative-projects', name: 'Creative Projects', icon: '🎨' },
      { id: 'reward-system', name: 'Rewards', icon: '🏆' },
    ]
  }

  // Check if mobile - use state to handle window resize
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      // In Tauri desktop app, never treat as mobile
      if (typeof window !== 'undefined' && window.__TAURI__) {
        setIsMobile(false)
      } else {
        setIsMobile(window.innerWidth < 768)
      }
    }

    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Load preferences AFTER initial render to prevent hydration issues
  useEffect(() => {
    // Load shortcuts without blocking render
    try {
      const savedShortcuts = localStorage.getItem('sidebar-shortcuts')
      if (savedShortcuts) {
        setShortcuts(JSON.parse(savedShortcuts))
      }
    } catch (error) {
      console.error('Failed to load shortcuts:', error)
    }

    // Load sidebar state without blocking render
    try {
      const savedSidebarState = localStorage.getItem('sidebar-visible')
      if (savedSidebarState !== null) {
        setShowSidebar(JSON.parse(savedSidebarState))
      } else {
        // Default to true if no saved state
        setShowSidebar(true)
      }
    } catch (error) {
      console.error('Failed to load sidebar state:', error)
      // Default to true on error
      setShowSidebar(true)
    }
  }, [])

  // Save sidebar state when it changes (but not on initial undefined state)
  useEffect(() => {
    if (showSidebar !== undefined) {
      try {
        localStorage.setItem('sidebar-visible', JSON.stringify(showSidebar))
      } catch (error) {
        console.error('Failed to save sidebar state:', error)
      }
    }
  }, [showSidebar])

  const getHref = (pageId: string): string => {
    if (pageId === 'daily-today') {
      const today = new Date()
      const dateStr = today.toISOString().split('T')[0]
      return `/calendar/day/${dateStr}`
    } else {
      return `/${pageId}`
    }
  }

  const getHomeHref = (): string => {
    // Safe for server-side rendering
    if (typeof window === 'undefined') return '/'

    const dailyAsHome = localStorage.getItem('chaos-daily-as-home') === 'true'
    if (dailyAsHome) {
      const today = new Date()
      const dateStr = today.toISOString().split('T')[0]
      return `/calendar/day/${dateStr}`
    } else {
      return '/'
    }
  }

  // Don't render until we know the sidebar state to prevent hydration mismatch
  if (showSidebar === undefined) {
    return null
  }

  return (
    <>
      {/* Menu toggle button - ALWAYS visible as backup */}
      <button
        onClick={() => setShowSidebar(!showSidebar)}
        className="fixed top-4 left-4 z-[9999] p-3 rounded-lg bg-orange-500 text-white shadow-xl hover:bg-orange-600 transition-colors border-2 border-white"
        title={showSidebar ? "Close menu" : "Open menu"}
        style={{
          position: 'fixed',
          top: '16px',
          left: '16px',
          zIndex: 9999,
          backgroundColor: '#f97316',
          color: 'white'
        }}
      >
        {showSidebar ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      {/* Mobile backdrop - only for actual mobile, not Tauri */}
      {isMobile && showSidebar && !window.__TAURI__ && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setShowSidebar(false)}
        />
      )}

      {/* Sidebar */}
      {showSidebar && (
        <div
          className={`flex flex-col p-3 bg-card border-l-2 border-orange-400 flex-shrink-0 ${
            isMobile && !window.__TAURI__
              ? 'fixed top-0 right-0 h-full z-50 shadow-2xl w-[180px]'
              : 'w-[8vw] min-w-[130px] max-w-[180px]'
          }`}
        >
          {/* Close button - always available */}
          <div className="flex justify-between items-center mb-3">
            <span className="text-sm font-bold">🌪️ Menu</span>
            <button
              onClick={() => setShowSidebar(false)}
              className="p-1 rounded hover:bg-accent transition-colors"
                title="Close menu"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          )}

          {/* Home button */}
          <Link
            href={getHomeHref()}
            className="mb-3 rounded text-center transition-all p-3 w-full hover:opacity-80 block"
            title="Home - Command Center"
            style={{
              backgroundColor: "var(--btn-bg)",
              border: "2px solid var(--btn-border)"
            }}
          >
            <Image
              src="/home.png"
              alt="Home"
              width={80}
              height={80}
              className="mx-auto drop-shadow-lg"
            />
          </Link>

          {/* Calendar buttons */}
          <Link
            href={getHref('calendar')}
            className="mb-1 rounded text-xs font-medium transition-all py-2 px-1 hover:opacity-80 block text-center"
            title="Calendar - This Month"
            style={{
              backgroundColor: "var(--btn-bg)",
              color: "var(--text-main)",
              border: "1px solid var(--border-soft)"
            }}
          >
            📅 Month
          </Link>

          <Link
            href={(() => {
              const now = new Date()
              const year = now.getFullYear()
              const week = getWeekOfYear(now)
              return `/calendar/week/${year}-W${week}`
            })()}
            className="mb-1 rounded text-xs font-medium transition-all py-2 px-1 hover:opacity-80 block text-center"
            title="Weekly View"
            style={{
              backgroundColor: "var(--btn-bg)",
              color: "var(--text-main)",
              border: "1px solid var(--border-soft)"
            }}
          >
            📋 Weekly
          </Link>

          <Link
            href={getHref('daily-today')}
            className="mb-1 rounded text-xs font-medium transition-all py-2 px-1 hover:opacity-80 block text-center"
            title="Daily Dashboard - Today"
            style={{
              backgroundColor: "var(--btn-bg)",
              color: "var(--text-main)",
              border: "1px solid var(--border-soft)"
            }}
          >
            🗓️ Daily
          </Link>

          {/* Trackers section */}
          <div className="flex-1 mt-2">
            {sidebarItems.filter(item => item.isVisible).map((item) => (
              <Link
                key={item.id}
                href={getHref(item.targetPageId)}
                className={`w-full rounded font-medium py-2 px-1 text-center text-xs hover:opacity-80 mb-1 block ${item.buttonClass}`}
                title={item.text}
                style={{
                  border: "1px solid var(--border)"
                }}
              >
                {item.emoji && <span style={{ marginRight: '4px' }}>{item.emoji}</span>}
                {item.text}
              </Link>
            ))}
          </div>

          {/* Settings */}
          <Link
            href={getHref('settings')}
            className="mt-2 rounded text-xs font-medium transition-all py-2 px-1 hover:opacity-80 block text-center"
            title="Settings"
            style={{
              backgroundColor: "var(--btn-bg)",
              color: "var(--text-main)",
              border: "1px solid var(--border-soft)"
            }}
          >
            ⚙️ Settings
          </Link>
        </div>
      )}
    </>
  )
}
