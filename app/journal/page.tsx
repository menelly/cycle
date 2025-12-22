"use client"

import AppCanvas from "@/components/app-canvas"
import UnifiedJournal from "@/components/journal/unified-journal"

export default function JournalPage() {
  return (
    <AppCanvas currentPage="journal">
      <div className="max-w-4xl mx-auto">
        <header className="text-center mb-6">
          <h1 className="text-3xl font-bold text-foreground mb-2 flex items-center justify-center gap-2">
            📝 Journal
          </h1>
          <p className="text-lg text-muted-foreground">
            Your daily thoughts, feelings, and reflections
          </p>
        </header>
        <UnifiedJournal />
      </div>
    </AppCanvas>
  )
}
