"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Database, Download, Upload, Shield, Zap, Trash2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { hasDefaultDataBeenLoaded, restoreDefaultData, deleteDefaultData } from "@/lib/default-data"
import type { ReproductiveHealthEntry } from "@/app/reproductive-health/reproductive-health-tracker"
import { GSpot4BoringFileExporter, BoringFileType } from "@/lib/database/g-spot-steganography"

interface DataManagementModalProps {
  isOpen: boolean
  onClose: () => void
}

export function DataManagementModal({ isOpen, onClose }: DataManagementModalProps) {
  const [hasPin, setHasPin] = useState(false)
  const [pinInput, setPinInput] = useState("")
  const [confirmPinInput, setConfirmPinInput] = useState("")
  const [showGSpotExplanation, setShowGSpotExplanation] = useState(false)
  const [importFile, setImportFile] = useState<File | null>(null)

  // Check if PIN is set on component mount
  useEffect(() => {
    const savedPin = localStorage.getItem('chaos-data-pin')
    setHasPin(!!savedPin)
  }, [])

  const handleSetPin = () => {
    if (pinInput.length < 4) {
      alert("PIN must be at least 4 characters")
      return
    }
    if (pinInput !== confirmPinInput) {
      alert("PINs don't match")
      return
    }
    
    localStorage.setItem('chaos-data-pin', pinInput)
    setHasPin(true)
    setPinInput("")
    setConfirmPinInput("")
    alert("PIN set successfully! This will be required for data import/export.")
  }



  const handleChangePIN = () => {
    if (confirm("Change PIN? This will log you out and you'll need to set up a new PIN. For testing: this will trigger the first-time setup flow again.")) {
      localStorage.removeItem('chaos-data-pin')
      localStorage.removeItem('default-data-loaded') // Clear this flag for testing
      alert("PIN cleared! You'll be logged out and can set up a new PIN.")
      window.location.reload() // Force logout and restart
    }
  }

  const handleExportByTag = async () => {
    if (!hasPin) {
      alert("Please set a PIN first for secure data export")
      return
    }

    const enteredPin = prompt("Enter your PIN to export data:")
    const savedPin = localStorage.getItem('chaos-data-pin')

    if (enteredPin !== savedPin) {
      alert("Incorrect PIN")
      return
    }

    // Get available tags
    try {
      const { db } = await import('@/lib/database/dexie-db')
      const allData = await db.daily_data.toArray()

      // Get unique tags
      const allTags = new Set<string>()
      allData.forEach(record => {
        record.tags?.forEach(tag => allTags.add(tag))
      })

      if (allTags.size === 0) {
        alert("No tagged data found to export")
        return
      }

      const tagList = Array.from(allTags).sort()
      const selectedTag = prompt(`Select tag to export:\n\n${tagList.map((tag, i) => `${i + 1}. ${tag}`).join('\n')}\n\nEnter tag name:`)

      if (!selectedTag || !tagList.includes(selectedTag)) {
        alert("Invalid tag selected")
        return
      }

      // Filter data by tag
      const taggedData = allData.filter(record =>
        record.tags?.includes(selectedTag)
      )

      if (taggedData.length === 0) {
        alert(`No data found with tag: ${selectedTag}`)
        return
      }

      const exportData = {
        version: "1.0.0",
        timestamp: new Date().toISOString(),
        tag: selectedTag,
        data: taggedData,
        _cycle_backup: true
      }

      // Generate filename
      const hash = Math.random().toString(36).substring(2, 8)
      const filename = `tag-${selectedTag}-${hash}.json`

      // Download file
      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = filename
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)

      alert(`✅ Tagged data exported as ${filename}\n\n${taggedData.length} records with tag "${selectedTag}" exported.`)

    } catch (error) {
      console.error('Tag export error:', error)
      alert("❌ Failed to export tagged data")
    }
  }

  const handlePdfExport = async () => {
    if (!hasPin) {
      alert("Please set a PIN first for secure data export")
      return
    }

    const enteredPin = prompt("Enter your PIN to export medical summary:")
    const savedPin = localStorage.getItem('chaos-data-pin')

    if (enteredPin !== savedPin) {
      alert("Incorrect PIN")
      return
    }

    try {
      const { db } = await import('@/lib/database/dexie-db')

      // Get reproductive health data from last 6 months
      const sixMonthsAgo = new Date()
      sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6)
      const startDate = sixMonthsAgo.toISOString().split('T')[0]
      const endDate = new Date().toISOString().split('T')[0]

      const reproductiveData = await db.daily_data
        .where(['category', 'subcategory'])
        .equals(['tracker', 'reproductive-health'])
        .and(record => record.date >= startDate && record.date <= endDate)
        .toArray()

      if (reproductiveData.length === 0) {
        alert("No cycle data found in the last 6 months to export")
        return
      }

      // Generate medical summary
      const cycles: typeof reproductiveData[] = []
      let currentCycle: typeof reproductiveData = []
      let lastPeriodStart: string | null = null

      // Process data chronologically
      const sortedData = reproductiveData.sort((a, b) => a.date.localeCompare(b.date))

      for (const record of sortedData) {
        const data = record.content as Partial<ReproductiveHealthEntry>
        if (data.flow && data.flow !== 'none') {
          if (!lastPeriodStart) {
            lastPeriodStart = record.date
            currentCycle = [record]
          } else {
            // Check if this is a new cycle (gap in flow)
            const daysBetween = Math.floor((new Date(record.date).getTime() - new Date(lastPeriodStart).getTime()) / (1000 * 60 * 60 * 24))
            if (daysBetween > 10) { // New cycle
              if (currentCycle.length > 0) {
                cycles.push([...currentCycle])
              }
              currentCycle = [record]
              lastPeriodStart = record.date
            } else {
              currentCycle.push(record)
            }
          }
        }
      }

      if (currentCycle.length > 0) {
        cycles.push(currentCycle)
      }

      // Create medical summary text
      let summary = `MENSTRUAL CYCLE SUMMARY\n`
      summary += `Generated: ${new Date().toLocaleDateString()}\n`
      summary += `Data Period: ${new Date(startDate).toLocaleDateString()} - ${new Date(endDate).toLocaleDateString()}\n\n`

      summary += `CYCLE OVERVIEW:\n`
      summary += `• Total cycles tracked: ${cycles.length}\n`

      if (cycles.length > 0) {
        const cycleLengths = cycles.map(cycle => {
          const start = new Date(cycle[0].date)
          const end = cycles[cycles.indexOf(cycle) + 1] ? new Date(cycles[cycles.indexOf(cycle) + 1][0].date) : new Date()
          return Math.floor((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))
        }).filter(length => length > 0 && length < 60)

        if (cycleLengths.length > 0) {
          const avgLength = Math.round(cycleLengths.reduce((a, b) => a + b, 0) / cycleLengths.length)
          summary += `• Average cycle length: ${avgLength} days\n`
          summary += `• Cycle length range: ${Math.min(...cycleLengths)} - ${Math.max(...cycleLengths)} days\n`
        }
      }

      // Pain analysis
      const painData = sortedData.filter(r => (r.content as Partial<ReproductiveHealthEntry>).pain && (r.content as Partial<ReproductiveHealthEntry>).pain! > 0).map(r => (r.content as Partial<ReproductiveHealthEntry>).pain!)
      if (painData.length > 0) {
        const avgPain = (painData.reduce((a, b) => a + b, 0) / painData.length).toFixed(1)
        const maxPain = Math.max(...painData)
        summary += `• Average pain level: ${avgPain}/10\n`
        summary += `• Maximum pain level: ${maxPain}/10\n`
      }

      // Common symptoms
      const allSymptoms: string[] = []
      sortedData.forEach(r => {
        const content = r.content as Partial<ReproductiveHealthEntry>
        if (content.symptoms) {
          allSymptoms.push(...content.symptoms)
        }
      })

      if (allSymptoms.length > 0) {
        const symptomCounts: Record<string, number> = {}
        allSymptoms.forEach(symptom => {
          symptomCounts[symptom] = (symptomCounts[symptom] || 0) + 1
        })

        const topSymptoms = Object.entries(symptomCounts)
          .sort(([,a], [,b]) => b - a)
          .slice(0, 5)
          .map(([symptom, count]) => `${symptom} (${count} times)`)

        summary += `\nCOMMON SYMPTOMS:\n`
        topSymptoms.forEach(symptom => summary += `• ${symptom}\n`)
      }

      summary += `\nNOTE: This summary is generated from self-tracked data and should be reviewed with a healthcare provider.\n`

      // Create and download text file (easier than PDF for now)
      const hash = Math.random().toString(36).substring(2, 8)
      const filename = `medical-summary-${hash}.txt`

      const blob = new Blob([summary], { type: 'text/plain' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = filename
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)

      alert(`✅ Medical summary exported as ${filename}\n\nThis file contains a clinical summary of your cycle data for the last 6 months.`)

    } catch (error) {
      console.error('PDF export error:', error)
      alert("❌ Failed to export medical summary")
    }
  }

  const handleStealthExport = async () => {
    if (!hasPin) {
      alert("Please set a PIN first for secure data export")
      return
    }

    const enteredPin = prompt("Enter your PIN to export data:")
    const savedPin = localStorage.getItem('chaos-data-pin')

    if (enteredPin !== savedPin) {
      alert("Incorrect PIN")
      return
    }

    try {
      const { db } = await import('@/lib/database/dexie-db')

      // Export all data
      const allData = await db.daily_data.toArray()
      const userTags = await db.user_tags.toArray()

      const exportData = {
        version: "1.0.0",
        timestamp: new Date().toISOString(),
        data: allData,
        tags: userTags,
        _cycle_backup: true
      }

      // Use G-Spot 4.0 steganography to hide data in innocent file
      const fileTypes = [
        { type: BoringFileType.COSTCO_RECEIPT, name: "Shopping Receipt" },
        { type: BoringFileType.FAMILY_RECIPES, name: "Recipe Collection" },
        { type: BoringFileType.WIFI_PASSWORDS, name: "WiFi Backup" }
      ]

      const selectedType = Math.floor(Math.random() * fileTypes.length)
      const fileType = fileTypes[selectedType]

      const result = await GSpot4BoringFileExporter.exportMedicalData(
        exportData,
        enteredPin,
        fileType.type
      )

      if (!result.success) {
        throw new Error(result.message)
      }

      // Download the innocent-looking file
      const file = result.files[0]
      const blob = new Blob([file.content], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = file.filename
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)

      alert(`✅ Data exported successfully!\n\nYour cycle data is safely stored in the downloaded file. Keep it somewhere safe - you can import it later to restore your data.`)

    } catch (error) {
      console.error('Export error:', error)
      alert("❌ Failed to export data")
    }
  }

  const handleLoadTestData = async () => {
    if (!hasPin) {
      alert("Please set a PIN first for secure data operations")
      return
    }

    const enteredPin = prompt("Enter your PIN to load test data:")
    const savedPin = localStorage.getItem('chaos-data-pin')

    if (enteredPin !== savedPin) {
      alert("Incorrect PIN")
      return
    }

    if (!confirm("⚠️ LOAD TEST DATA ⚠️\n\nThis will replace ALL current data with 3 months of realistic test data for analytics testing.\n\nThis action cannot be undone. Make sure you have a backup!\n\nContinue?")) {
      return
    }

    try {
      const { db } = await import('@/lib/database/dexie-db')
      const { loadTestData } = await import('@/lib/database/default-data')

      const success = await loadTestData(db)

      if (success) {
        alert("✅ Test data loaded successfully!\n\n3 months of realistic cycle data has been added. You can now test the analytics features.")
        window.location.reload() // Refresh to show new data
      } else {
        alert("❌ Failed to load test data")
      }
    } catch (error) {
      console.error('Test data loading error:', error)
      alert("❌ Failed to load test data")
    }
  }

  const handleStealthImport = async () => {
    if (!hasPin) {
      alert("Please set a PIN first for secure data import")
      return
    }

    if (!importFile) {
      alert("Please select a file to import")
      return
    }

    const enteredPin = prompt("Enter your PIN to import data:")
    const savedPin = localStorage.getItem('chaos-data-pin')

    if (enteredPin !== savedPin) {
      alert("Incorrect PIN")
      return
    }

    try {
      const fileContent = await importFile.text()

      // Try to import using G-Spot 4.0 steganography first
      let importData
      try {
        const result = await GSpot4BoringFileExporter.importMedicalData(
          [{ filename: importFile.name, content: fileContent }],
          enteredPin
        )

        if (result.success) {
          importData = result.data
        } else {
          throw new Error("Not a steganographic file")
        }
      } catch (stegError) {
        // Fallback to regular JSON import for backwards compatibility
        try {
          importData = JSON.parse(fileContent)

          // Verify this is a Cycle backup file
          if (!importData._cycle_backup) {
            alert("❌ Invalid backup file. Please select a valid Cycle data export.")
            return
          }
        } catch (jsonError) {
          alert("❌ Invalid file format. Please select a valid Cycle data export.")
          return
        }
      }

      if (!confirm("⚠️ IMPORT DATA ⚠️\n\nThis will replace ALL current data with the imported data. This action cannot be undone.\n\nMake sure you have a current backup before proceeding!\n\nContinue with import?")) {
        return
      }

      const { db } = await import('@/lib/database/dexie-db')

      // Clear existing data
      await db.daily_data.clear()
      await db.user_tags.clear()

      // Import new data
      if (importData.data && importData.data.length > 0) {
        await db.daily_data.bulkAdd(importData.data)
      }

      if (importData.tags && importData.tags.length > 0) {
        await db.user_tags.bulkAdd(importData.tags)
      }

      alert("✅ Data imported successfully! The page will refresh to show your restored data.")
      setImportFile(null)
      onClose()
      window.location.reload()

    } catch (error) {
      console.error('Import error:', error)
      alert("❌ Failed to import data. Please check the file and try again.")
    }
  }

  const handleGSpotTap = () => {
    setShowGSpotExplanation(true)
  }

  const handleClearAllData = async () => {
    if (!hasPin) {
      alert("PIN required to clear all data")
      return
    }

    const enteredPin = prompt("Enter your PIN to clear all data:")
    const savedPin = localStorage.getItem('chaos-data-pin')

    if (enteredPin !== savedPin) {
      alert("Incorrect PIN")
      return
    }

    const confirmed = confirm(
      "⚠️ CLEAR ALL DATA ⚠️\n\n" +
      "This will permanently delete ALL your cycle tracking data.\n" +
      "This action cannot be undone.\n\n" +
      "Continue?"
    )

    if (!confirmed) return

    try {
      // Import and clear database directly
      const dexieModule = await import('@/lib/database/dexie-db')
      const database = dexieModule.getDB() // Use getDB() function instead of proxy

      console.log('🗑️ Clearing database...', database)

      // Clear all tables
      await database.daily_data.clear() // Correct table name with underscore
      await database.user_tags.clear()
      await database.image_blobs.clear()

      console.log('✅ Database cleared successfully')

      alert("✅ All data cleared successfully!")
      onClose()
      window.location.reload() // Refresh to show empty state
    } catch (error) {
      console.error('Error clearing data:', error)
      alert(`❌ Error occurred while clearing data: ${error instanceof Error ? error.message : String(error)}`)
    }
  }

  const handleGSpotProtocol = async () => {
    if (!hasPin) {
      alert("PIN required to execute G-Spot Protocol")
      return
    }

    const enteredPin = prompt("Enter your PIN to execute G-Spot Protocol:")
    const savedPin = localStorage.getItem('chaos-data-pin')

    if (enteredPin === savedPin) {
      if (confirm("⚡ G-SPOT PROTOCOL ⚡\n\nThis will completely replace all your current data with algorithmically generated bland patterns that appear normal but contain no real personal information. This action cannot be undone.\n\nThey can't find it if they don't think it exists anyways. 😉\n\nAre you sure you want to continue?")) {
        try {
          await restoreDefaultData()
          alert("⚡ G-Spot Protocol executed successfully. Your data has been replaced with unremarkable patterns.")
          onClose() // Close the modal
          window.location.reload() // Refresh to show clean state
        } catch (error) {
          console.error('Error executing G-Spot Protocol:', error)
          alert("❌ Error occurred while executing G-Spot Protocol.")
        }
      }
    } else {
      alert("Incorrect PIN")
    }
  }

  const handleDeleteDefaultData = async () => {
    if (!hasPin) {
      alert("PIN required to delete default data")
      return
    }

    const enteredPin = prompt("Enter your PIN to delete default data:")
    const savedPin = localStorage.getItem('chaos-data-pin')

    if (enteredPin === savedPin) {
      if (confirm("🗑️ DELETE DEFAULT DATA 🗑️\n\nThis will remove all the sample entries that were loaded when you first set up the app. Your real data will remain untouched.\n\nAre you sure you want to continue?")) {
        try {
          await deleteDefaultData()
          alert("✅ Default data deleted successfully. Sample entries have been removed.")
          onClose() // Close the modal
          window.location.reload() // Refresh to show updated state
        } catch (error) {
          console.error('Error deleting default data:', error)
          alert("❌ Error occurred while deleting default data.")
        }
      }
    } else {
      alert("Incorrect PIN")
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Data Management
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* PIN Setup Section */}
          <div className="p-4 border rounded-lg">
            <div className="flex items-center gap-2 mb-3">
              <Shield className="h-4 w-4" />
              <Label className="text-sm font-medium">Security PIN</Label>
              {hasPin && <Badge variant="default">Set</Badge>}
            </div>
            
            {!hasPin ? (
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  Set a PIN to secure your data exports and imports
                </p>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="pin">PIN (min 4 chars)</Label>
                    <Input
                      id="pin"
                      type="password"
                      value={pinInput}
                      onChange={(e) => setPinInput(e.target.value)}
                      placeholder="Enter PIN"
                    />
                  </div>
                  <div>
                    <Label htmlFor="confirm-pin">Confirm PIN</Label>
                    <Input
                      id="confirm-pin"
                      type="password"
                      value={confirmPinInput}
                      onChange={(e) => setConfirmPinInput(e.target.value)}
                      placeholder="Confirm PIN"
                    />
                  </div>
                </div>
                <Button onClick={handleSetPin} className="w-full">
                  Set PIN
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  PIN is set and protecting your data exports
                </p>
                <div className="flex gap-2">
                  <Button onClick={handleChangePIN} variant="outline" size="sm">
                    Change PIN
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Export Options */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Export Data</Label>
            
            <Button 
              onClick={handleExportByTag} 
              variant="outline" 
              className="w-full justify-start"
              disabled={!hasPin}
            >
              <Download className="h-4 w-4 mr-2" />
              Export by Tag
            </Button>
            
            <Button 
              onClick={handlePdfExport} 
              variant="outline" 
              className="w-full justify-start"
              disabled={!hasPin}
            >
              <Download className="h-4 w-4 mr-2" />
              PDF for Doctors
            </Button>
            
            <Button
              onClick={handleStealthExport}
              variant="outline"
              className="w-full justify-start"
              disabled={!hasPin}
            >
              <Download className="h-4 w-4 mr-2" />
              🧾 Export Data Backup
            </Button>
            <p className="text-xs text-muted-foreground">
              The cycle goblins will disguise your data in a perfectly innocent file! 🧚‍♀️
            </p>

            <Button
              onClick={handleLoadTestData}
              variant="outline"
              className="w-full justify-start"
              disabled={!hasPin}
            >
              <div className="flex items-center gap-2">
                📊 Load Test Data
              </div>
            </Button>

            <Button
              onClick={handleClearAllData}
              variant="outline"
              className="w-full justify-start text-red-600 border-red-200 hover:bg-red-50"
              disabled={!hasPin}
            >
              <div className="flex items-center gap-2">
                <Trash2 className="h-4 w-4" />
                🗑️ Clear All Data
              </div>
            </Button>

            {!hasPin && (
              <p className="text-xs text-muted-foreground">
                Set a PIN above to enable data features
              </p>
            )}
          </div>

          {/* Import Options */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Import Data</Label>

            <div className="space-y-2">
              <input
                type="file"
                accept=".json"
                onChange={(e) => setImportFile(e.target.files?.[0] || null)}
                className="block w-full text-sm text-muted-foreground file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
                disabled={!hasPin}
              />

              <Button
                onClick={handleStealthImport}
                variant="outline"
                className="w-full justify-start"
                disabled={!hasPin || !importFile}
              >
                <Upload className="h-4 w-4 mr-2" />
                📂 Import Data Backup
              </Button>
              <p className="text-xs text-muted-foreground">
                Upload your innocent-looking file and the cycle spirits will extract your data! ✨
              </p>
            </div>

            {!hasPin && (
              <p className="text-xs text-muted-foreground">
                Set a PIN above to enable data import features
              </p>
            )}
          </div>

          {/* Delete Default Data Section */}
          {hasDefaultDataBeenLoaded() && (
            <div className="space-y-3 p-4 border border-orange-200 rounded-lg bg-orange-50">
              <div className="flex items-center gap-2">
                <Trash2 className="h-4 w-4 text-orange-600" />
                <Label className="text-sm font-medium text-orange-600">Clean Up Default Data</Label>
              </div>

              <Button
                variant="outline"
                className="w-full border-orange-200 text-orange-600 hover:bg-orange-50"
                onClick={handleDeleteDefaultData}
              >
                🗑️ Delete Default Data
              </Button>

              <p className="text-xs text-orange-600">
                Remove the sample entries that were loaded when you first set up the app. Your real data stays safe.
              </p>
            </div>
          )}

          {/* G-Spot Protocol */}
          <div className="p-4 border-2 border-destructive/20 rounded-lg bg-destructive/5">
            <div className="flex items-center gap-2 mb-3">
              <Zap className="h-4 w-4 text-destructive" />
              <Label className="text-sm font-medium text-destructive">⚡ G-Spot Protocol</Label>
              <Badge variant="destructive" className="text-xs">DANGER</Badge>
            </div>
            
            <Button
              variant="destructive"
              className="w-full"
              onClick={handleGSpotTap}
              onMouseDown={() => {
                const timer = setTimeout(() => {
                  handleGSpotProtocol()
                }, 1000)

                const cleanup = () => {
                  clearTimeout(timer)
                  document.removeEventListener('mouseup', cleanup)
                }
                document.addEventListener('mouseup', cleanup)
              }}
            >
              ⚡ G-Spot Protocol
            </Button>

            <p className="text-xs text-muted-foreground mt-2">
              Tap to explain • Long hold + PIN to execute
            </p>

            {showGSpotExplanation && (
              <div className="mt-3 p-3 bg-muted rounded border">
                <p className="text-sm">
                  <strong>G-Spot Protocol:</strong> Emergency data replacement with bland, unremarkable patterns
                  that appear normal but contain no real personal information. Use this if you need to quickly
                  sanitize your data for privacy reasons.
                </p>
                <p className="text-sm mt-2 font-medium text-destructive">
                  They can't find it if they don't think it exists anyways. 😉
                </p>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowGSpotExplanation(false)}
                  className="mt-2"
                >
                  Got it
                </Button>
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
