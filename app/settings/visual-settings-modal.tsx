"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Palette } from "lucide-react"


interface VisualSettingsModalProps {
  isOpen: boolean
  onClose: () => void
}

export function VisualSettingsModal({ isOpen, onClose }: VisualSettingsModalProps) {
  const [currentTheme, setCurrentTheme] = useState('theme-lavender')
  const [currentFont, setCurrentFont] = useState('font-atkinson')
  const [fertilityTrackingEnabled, setFertilityTrackingEnabled] = useState(true)
  const [cyclePersonalityEnabled, setCyclePersonalityEnabled] = useState(true)
  const [fertilityTrackingPurpose, setFertilityTrackingPurpose] = useState<'ttc' | 'bc'>('ttc')

  const themes = [
    { id: 'theme-lavender', name: 'Lavender Garden', description: 'Gentle lavender serenity (default)' },
    { id: 'theme-chaos', name: 'Chaos Vortex', description: 'Purple chaos energy' },
    { id: 'theme-light', name: 'Light Mode', description: 'Clean and bright' },
    { id: 'theme-colorblind', name: 'Colorblind Friendly', description: 'High contrast accessibility' },
    { id: 'theme-glitter', name: 'Glitter Mode', description: 'Sparkly pink dreams' },
    { id: 'theme-calm', name: 'Calm Mode', description: 'Blue and gold serenity' },
    { id: 'theme-accessibility', name: 'Accessibility', description: 'Maximum contrast and large text' },
    { id: 'theme-storm', name: 'Storm Mode', description: 'Dark storm energy' }
  ]

  const fonts = [
    { id: 'font-atkinson', name: 'Atkinson Hyperlegible', description: 'Designed for low vision accessibility' },
    { id: 'font-poppins', name: 'Poppins', description: 'Modern and friendly' },
    { id: 'font-lexend', name: 'Lexend', description: 'Optimized for reading proficiency' },
    { id: 'font-system', name: 'System Font', description: 'Your device default' }
  ]

  const applyTheme = (themeId: string) => {
    // Remove all theme classes
    themes.forEach(theme => document.body.classList.remove(theme.id))
    // Add new theme class (lavender is default, no class needed)
    if (themeId !== 'theme-lavender') {
      document.body.classList.add(themeId)
    }
    setCurrentTheme(themeId)
    localStorage.setItem('chaos-theme', themeId)
  }

  const applyFont = (fontId: string) => {
    // Remove all font classes
    fonts.forEach(font => document.body.classList.remove(font.id))
    // Add new font class
    document.body.classList.add(fontId)
    setCurrentFont(fontId)
    localStorage.setItem('chaos-font', fontId)
  }

  const toggleFertilityTracking = (enabled: boolean) => {
    setFertilityTrackingEnabled(enabled)
    localStorage.setItem('fertility-tracking-enabled', enabled.toString())
  }

  const toggleCyclePersonality = (enabled: boolean) => {
    setCyclePersonalityEnabled(enabled)
    localStorage.setItem('cycle-personality-enabled', enabled.toString())
  }

  const handleFertilityPurposeChange = (purpose: 'ttc' | 'bc') => {
    setFertilityTrackingPurpose(purpose)
    localStorage.setItem('fertility-tracking-purpose', purpose)
  }

  // Load saved theme, font, and fertility tracking setting on component mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('chaos-theme') || 'theme-lavender'
    const savedFont = localStorage.getItem('chaos-font') || 'font-atkinson'
    const savedFertilityTracking = localStorage.getItem('fertility-tracking-enabled')
    const savedCyclePersonality = localStorage.getItem('cycle-personality-enabled')
    const savedFertilityPurpose = localStorage.getItem('fertility-tracking-purpose')

    setCurrentTheme(savedTheme)
    setCurrentFont(savedFont)
    setFertilityTrackingEnabled(savedFertilityTracking !== 'false') // Default to true
    setCyclePersonalityEnabled(savedCyclePersonality !== 'false') // Default to true
    setFertilityTrackingPurpose((savedFertilityPurpose as 'ttc' | 'bc') || 'ttc') // Default to TTC

    // Apply saved theme
    themes.forEach(theme => document.body.classList.remove(theme.id))
    if (savedTheme !== 'theme-lavender') {
      document.body.classList.add(savedTheme)
    }

    // Apply saved font
    fonts.forEach(font => document.body.classList.remove(font.id))
    document.body.classList.add(savedFont)
  }, [])

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Palette className="h-5 w-5" />
            Visual Settings
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Theme Selection */}
          <div>
            <Label className="text-sm font-medium mb-2 block">Theme</Label>
            <Select value={currentTheme} onValueChange={applyTheme}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {themes.map((theme) => (
                  <SelectItem key={theme.id} value={theme.id}>
                    <div>
                      <div className="font-medium">{theme.name}</div>
                      <div className="text-xs text-muted-foreground">{theme.description}</div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Font Selection */}
          <div>
            <Label className="text-sm font-medium mb-2 block">Font Family</Label>
            <Select value={currentFont} onValueChange={applyFont}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {fonts.map((font) => (
                  <SelectItem key={font.id} value={font.id}>
                    <div>
                      <div className="font-medium">{font.name}</div>
                      <div className="text-xs text-muted-foreground">{font.description}</div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Fertility Tracking Toggle */}
          <div>
            <Label className="text-sm font-medium mb-2 block">Fertility Features</Label>
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <div className="font-medium">
                  {fertilityTrackingEnabled ? '🌸 Fertility Tracking On' : '🌙 Basic Cycle Only'}
                </div>
                <div className="text-xs text-muted-foreground">
                  {fertilityTrackingEnabled
                    ? 'Shows BBT charts, ovulation prediction, and fertility signs'
                    : 'Hides fertility features - shows only basic cycle tracking'
                  }
                </div>
              </div>
              <Switch
                checked={fertilityTrackingEnabled}
                onCheckedChange={toggleFertilityTracking}
              />
            </div>
          </div>

          {/* Cycle Personality Toggle */}
          <div>
            <Label className="text-sm font-medium mb-2 block">Cycle Personality</Label>
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <div className="font-medium">
                  {cyclePersonalityEnabled ? '🧚‍♀️ Cycle Goblins Active' : '📊 Clinical Mode'}
                </div>
                <div className="text-xs text-muted-foreground">
                  {cyclePersonalityEnabled
                    ? 'Shows supportive messages, celebrations, and cheeky goblinisms'
                    : 'Clean, clinical interface without personality messages'
                  }
                </div>
              </div>
              <Switch
                checked={cyclePersonalityEnabled}
                onCheckedChange={toggleCyclePersonality}
              />
            </div>
          </div>

          {/* Fertility Purpose Selection - Only show if both fertility tracking AND cycle personality are enabled */}
          {fertilityTrackingEnabled && cyclePersonalityEnabled && (
            <div>
              <Label className="text-sm font-medium mb-2 block">Fertility Tracking Purpose</Label>
              <div className="p-4 border rounded-lg space-y-3">
                <div className="text-xs text-muted-foreground mb-3">
                  This helps us show the right kind of support messages for your journey
                </div>

                <div className="space-y-2">
                  <div
                    className={`p-3 border rounded cursor-pointer transition-colors ${
                      fertilityTrackingPurpose === 'ttc'
                        ? 'border-primary bg-primary/5'
                        : 'border-muted hover:border-primary/50'
                    }`}
                    onClick={() => handleFertilityPurposeChange('ttc')}
                  >
                    <div className="font-medium">🍼 Trying to Conceive</div>
                    <div className="text-xs text-muted-foreground">
                      Gentle, hopeful support messages for your conception journey
                    </div>
                  </div>

                  <div
                    className={`p-3 border rounded cursor-pointer transition-colors ${
                      fertilityTrackingPurpose === 'bc'
                        ? 'border-primary bg-primary/5'
                        : 'border-muted hover:border-primary/50'
                    }`}
                    onClick={() => handleFertilityPurposeChange('bc')}
                  >
                    <div className="font-medium">🛡️ Birth Control Tracking</div>
                    <div className="text-xs text-muted-foreground">
                      Relief celebration messages when cycles arrive as expected
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

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
