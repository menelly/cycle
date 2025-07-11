"use client"

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Calendar, BookOpen, Settings } from 'lucide-react'
import { cn } from '@/lib/utils'

export default function MobileBottomNav() {
  const pathname = usePathname()

  const navItems = [
    {
      id: 'home',
      label: 'Home',
      icon: Home,
      href: '/',
      isActive: pathname === '/'
    },
    {
      id: 'track',
      label: 'Track',
      icon: Calendar,
      href: '/reproductive-health',
      isActive: pathname.startsWith('/reproductive-health')
    },
    {
      id: 'journal',
      label: 'Journal',
      icon: BookOpen,
      href: '/journal',
      isActive: pathname.startsWith('/journal')
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: Settings,
      href: '/settings',
      isActive: pathname.startsWith('/settings')
    }
  ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-background border-t border-border z-50">
      <div className="flex items-center justify-around h-16 px-4">
        {navItems.map((item) => {
          const IconComponent = item.icon
          return (
            <Link
              key={item.id}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center space-y-1 px-3 py-2 rounded-lg transition-colors min-w-0 flex-1",
                item.isActive
                  ? "text-primary bg-primary/10"
                  : "text-muted-foreground hover:text-foreground hover:bg-accent"
              )}
            >
              <IconComponent className="h-5 w-5" />
              <span className="text-xs font-medium">{item.label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
