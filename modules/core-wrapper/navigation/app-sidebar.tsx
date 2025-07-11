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

  // Modular sidebar items - updated for our new module structure
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
      buttonClass: "sidebar-btn-7"
    },
    {
      id: "calendar",
      text: "Calendar",
      emoji: "📆",
      targetPageId: "calendar",
      isVisible: true,
      buttonClass: "sidebar-btn-8"
    },
    {
      id: "settings",
      text: "Settings",
      emoji: "⚙️",
      targetPageId: "settings",
      isVisible: true,
      buttonClass: "sidebar-btn-9"
    }
  ]

  // Load sidebar state from localStorage on mount
  useEffect(() => {
    const savedState = localStorage.getItem('sidebar-visible')
    setShowSidebar(savedState === 'true')
  }, [])

  // Save sidebar state to localStorage when it changes
  useEffect(() => {
    if (showSidebar !== undefined) {
      localStorage.setItem('sidebar-visible', showSidebar.toString())
    }
  }, [showSidebar])

  const toggleSidebar = () => {
    setShowSidebar(!showSidebar)
  }

  // Handle shortcut hold for editing
  const handleShortcutMouseDown = (shortcutId: string) => {
    const timer = setTimeout(() => {
      setHoldingShortcut(shortcutId)
    }, 500) // 500ms hold to edit
    setHoldTimer(timer)
  }

  const handleShortcutMouseUp = () => {
    if (holdTimer) {
      clearTimeout(holdTimer)
      setHoldTimer(null)
    }
  }

  const handleShortcutMouseLeave = () => {
    if (holdTimer) {
      clearTimeout(holdTimer)
      setHoldTimer(null)
    }
  }

  // Don't render anything until we know the sidebar state
  if (showSidebar === undefined) {
    return null
  }

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={toggleSidebar}
        className="fixed top-4 right-4 z-50 p-2 bg-primary text-primary-foreground rounded-md shadow-lg md:hidden"
        aria-label="Toggle sidebar"
      >
        {showSidebar ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Sidebar */}
      <div
        className={`fixed right-0 top-0 h-full bg-background border-l border-border shadow-lg z-40 transition-transform duration-300 ease-in-out ${
          showSidebar ? 'translate-x-0' : 'translate-x-full'
        } w-64 md:w-72`}
      >
        {/* Header */}
        <div className="p-4 border-b border-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Image
                src="/icon-192.png"
                alt="Chaos Command Center"
                width={24}
                height={24}
                className="rounded"
              />
              <span className="font-semibold text-sm">Chaos Command</span>
            </div>
            <button
              onClick={toggleSidebar}
              className="p-1 hover:bg-muted rounded"
              aria-label="Close sidebar"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto p-4">
          <nav className="space-y-2">
            {sidebarItems
              .filter(item => item.isVisible)
              .map((item) => (
                <Link
                  key={item.id}
                  href={`/${item.targetPageId}`}
                  className={`flex items-center space-x-3 p-3 rounded-lg transition-colors hover:bg-muted ${item.buttonClass}`}
                  onClick={() => setShowSidebar(false)} // Close sidebar on mobile after navigation
                >
                  <span className="text-lg">{item.emoji}</span>
                  <span className="font-medium">{item.text}</span>
                </Link>
              ))}
          </nav>

          {/* Quick Actions */}
          <div className="mt-6 pt-4 border-t border-border">
            <h3 className="text-sm font-semibold text-muted-foreground mb-3">Quick Actions</h3>
            <div className="space-y-2">
              <Link
                href="/"
                className="flex items-center space-x-3 p-2 rounded-lg transition-colors hover:bg-muted text-sm"
                onClick={() => setShowSidebar(false)}
              >
                <span>🏠</span>
                <span>Home</span>
              </Link>
              <Link
                href="/survival"
                className="flex items-center space-x-3 p-2 rounded-lg transition-colors hover:bg-muted text-sm"
                onClick={() => setShowSidebar(false)}
              >
                <span>🆘</span>
                <span>Survival Mode</span>
              </Link>
            </div>
          </div>

          {/* Footer Info */}
          <div className="mt-6 pt-4 border-t border-border">
            <div className="text-xs text-muted-foreground space-y-1">
              <div>Week {getWeekOfYear(new Date())} of {new Date().getFullYear()}</div>
              <div className="text-xs opacity-75">Chaos Command Center v1.0</div>
            </div>
          </div>
        </div>
      </div>

      {/* Overlay for mobile */}
      {showSidebar && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={toggleSidebar}
        />
      )}
    </>
  )
}
