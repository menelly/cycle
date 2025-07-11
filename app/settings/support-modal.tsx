"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MessageSquare, HelpCircle, Mail, Info, ExternalLink, Heart, Code, Zap } from "lucide-react"
import { Separator } from "@/components/ui/separator"

interface SupportModalProps {
  isOpen: boolean
  onClose: () => void
}

export function SupportModal({ isOpen, onClose }: SupportModalProps) {
  const appVersion = "1.0.0-beta"
  const buildDate = "2025-06-10"
  const [activeHelp, setActiveHelp] = useState<string | null>(null)

  const openExternalLink = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  const showHelp = (helpType: string) => {
    setActiveHelp(activeHelp === helpType ? null : helpType)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Support & Information
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Quick Help */}
          <div className="space-y-3">
            <h3 className="font-medium flex items-center gap-2">
              <HelpCircle className="h-4 w-4" />
              Quick Help
            </h3>

            <div className="grid gap-2">
              <Button
                variant="outline"
                className="justify-start h-auto p-4"
                onClick={() => showHelp('getting-started')}
              >
                <div className="text-left">
                  <div className="font-medium">🌸 Getting Started with Cycle Tracking</div>
                  <div className="text-sm text-muted-foreground">Learn how to log your cycle, BBT, and symptoms</div>
                </div>
              </Button>

              {activeHelp === 'getting-started' && (
                <div className="bg-muted p-4 rounded-lg text-sm space-y-3">
                  <div>
                    <strong>📅 Logging Your Period:</strong>
                    <p>Go to Track → Menstrual tab. Select your flow level (spotting, light, medium, heavy) and pain level (0-10). Add any symptoms or mood changes.</p>
                  </div>
                  <div>
                    <strong>🌡️ BBT Tracking:</strong>
                    <p>Take your temperature first thing in the morning before getting up. Log it in Track → Ovulation tab. Look for the temperature spike after ovulation!</p>
                  </div>
                  <div>
                    <strong>💧 Cervical Fluid:</strong>
                    <p>Track changes throughout your cycle. Dry → Sticky → Creamy → Watery → Egg white (most fertile). This helps predict ovulation.</p>
                  </div>
                  <div>
                    <strong>📊 Reading Your Data:</strong>
                    <p>Check the Analytics tab to see cycle patterns, average length, and fertility predictions based on your data.</p>
                  </div>
                </div>
              )}

              <Button
                variant="outline"
                className="justify-start h-auto p-4"
                onClick={() => showHelp('analytics')}
              >
                <div className="text-left">
                  <div className="font-medium">📊 Understanding Your Analytics</div>
                  <div className="text-sm text-muted-foreground">How to read cycle trends and fertility predictions</div>
                </div>
              </Button>

              {activeHelp === 'analytics' && (
                <div className="bg-muted p-4 rounded-lg text-sm space-y-3">
                  <div>
                    <strong>📈 BBT Chart:</strong>
                    <p>Look for a biphasic pattern - lower temps before ovulation, higher after. The spike indicates ovulation occurred.</p>
                  </div>
                  <div>
                    <strong>🔮 Cycle Predictions:</strong>
                    <p>Based on your history, the app predicts when your next period and fertile window will occur. More data = better predictions!</p>
                  </div>
                  <div>
                    <strong>📊 Cycle Stats:</strong>
                    <p>View average cycle length, period length, and symptom patterns. Useful for identifying irregularities or changes.</p>
                  </div>
                  <div>
                    <strong>🌱 Fertility Window:</strong>
                    <p>Green days = fertile window (5 days before + day of ovulation). Pink = ovulation day. Blue = not fertile.</p>
                  </div>
                </div>
              )}

              <Button
                variant="outline"
                className="justify-start h-auto p-4"
                onClick={() => showHelp('privacy')}
              >
                <div className="text-left">
                  <div className="font-medium">🔒 Privacy & Security</div>
                  <div className="text-sm text-muted-foreground">PIN protection and data safety features</div>
                </div>
              </Button>

              {activeHelp === 'privacy' && (
                <div className="bg-muted p-4 rounded-lg text-sm space-y-3">
                  <div>
                    <strong>🔐 PIN Protection:</strong>
                    <p>Set a PIN in Settings → Data Management. This protects your data exports and emergency features. Choose something memorable but secure.</p>
                  </div>
                  <div>
                    <strong>📱 Local Storage:</strong>
                    <p>All your data stays on your device. Nothing is sent to servers or shared with third parties. You have complete control.</p>
                  </div>
                  <div>
                    <strong>🚨 Emergency Protocol:</strong>
                    <p>The "Restore Default Data" button (long hold + PIN) replaces your real data with bland sample data for safety in dangerous situations.</p>
                  </div>
                  <div>
                    <strong>💾 Backups:</strong>
                    <p>Export your data regularly using benign filenames. Store backups safely - if you lose your device, your data is gone forever.</p>
                  </div>
                </div>
              )}

              <Button
                variant="outline"
                className="justify-start h-auto p-4"
                onClick={() => showHelp('medical')}
              >
                <div className="text-left">
                  <div className="font-medium">🩺 Medical Export Guide</div>
                  <div className="text-sm text-muted-foreground">How to export data for healthcare providers</div>
                </div>
              </Button>

              {activeHelp === 'medical' && (
                <div className="bg-muted p-4 rounded-lg text-sm space-y-3">
                  <div>
                    <strong>📋 Medical Summary:</strong>
                    <p>Go to Settings → Data Management → "PDF for Doctors". This creates a clinical summary with cycle stats, pain levels, and symptom patterns.</p>
                  </div>
                  <div>
                    <strong>📊 What's Included:</strong>
                    <p>• Average cycle length and range<br/>• Period length patterns<br/>• Pain levels and trends<br/>• Most common symptoms<br/>• 6 months of data</p>
                  </div>
                  <div>
                    <strong>🏥 For Appointments:</strong>
                    <p>Print or email the summary to your healthcare provider before appointments. It gives them objective data about your cycles.</p>
                  </div>
                  <div>
                    <strong>💾 Full Data Export:</strong>
                    <p>For detailed analysis, use "Export Data Backup" to get all your raw data in JSON format. Some providers can import this into their systems.</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          <Separator />

          {/* Contact & Feedback */}
          <div className="space-y-3">
            <h3 className="font-medium flex items-center gap-2">
              <Mail className="h-4 w-4" />
              Contact & Feedback
            </h3>
            
            <div className="grid gap-2">
              <Button
                variant="outline"
                className="justify-start h-auto p-4"
                onClick={() => openExternalLink('mailto:ren@chaoscascade.com')}
              >
                <div className="text-left flex-1">
                  <div className="font-medium flex items-center gap-2">
                    📧 Email Support
                    <ExternalLink className="h-3 w-3" />
                  </div>
                  <div className="text-sm text-muted-foreground">ren@chaoscascade.com</div>
                </div>
              </Button>
              
              <Button
                variant="outline"
                className="justify-start h-auto p-4"
                onClick={() => openExternalLink('mailto:ren@chaoscascade.com?subject=Chaos Cycle Bug Report')}
              >
                <div className="text-left flex-1">
                  <div className="font-medium flex items-center gap-2">
                    🐛 Report a Bug
                    <ExternalLink className="h-3 w-3" />
                  </div>
                  <div className="text-sm text-muted-foreground">Help us improve the app</div>
                </div>
              </Button>
            </div>
          </div>

          <Separator />

          {/* App Information */}
          <div className="space-y-3">
            <h3 className="font-medium flex items-center gap-2">
              <Info className="h-4 w-4" />
              App Information
            </h3>
            
            <div className="space-y-4">
              <div className="p-4 bg-muted rounded-lg">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="font-medium">Version</div>
                    <div className="text-muted-foreground">{appVersion}</div>
                  </div>
                  <div>
                    <div className="font-medium">Build Date</div>
                    <div className="text-muted-foreground">{buildDate}</div>
                  </div>
                  <div>
                    <div className="font-medium">Platform</div>
                    <div className="text-muted-foreground">Mobile App</div>
                  </div>
                  <div>
                    <div className="font-medium">Data Storage</div>
                    <div className="text-muted-foreground">Local Device Only</div>
                  </div>
                </div>
              </div>

              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => openExternalLink('/changelog')}
              >
                <div className="flex items-center gap-2">
                  <Code className="h-4 w-4" />
                  View Changelog
                  <ExternalLink className="h-3 w-3" />
                </div>
              </Button>
            </div>
          </div>

          <Separator />

          {/* Legal & Privacy */}
          <div className="space-y-3">
            <h3 className="font-medium">Legal & Privacy</h3>
            
            <div className="grid gap-2">
              <Button
                variant="outline"
                className="justify-start"
                onClick={() => openExternalLink('https://chaoscodex.app/privacy')}
              >
                <div className="flex items-center gap-2">
                  📜 Privacy Policy
                  <ExternalLink className="h-3 w-3" />
                </div>
              </Button>

              <Button
                variant="outline"
                className="justify-start"
                onClick={() => openExternalLink('https://chaoscodex.app/terms')}
              >
                <div className="flex items-center gap-2">
                  📋 Terms of Service
                  <ExternalLink className="h-3 w-3" />
                </div>
              </Button>
              

            </div>
          </div>

          <Separator />

          {/* About Chaos Cycle */}
          <div className="space-y-3">
            <h3 className="font-medium flex items-center gap-2">
              <Heart className="h-4 w-4" />
              About Chaos Cycle
            </h3>

            <div className="p-4 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground leading-relaxed">
                Chaos Cycle is a privacy-first fertility and menstrual cycle tracking app designed for
                people who want complete control over their reproductive health data. Built with security,
                accessibility, and user empowerment in mind, this app keeps your data local, secure, and
                entirely under your control.
              </p>

              <div className="mt-4 flex items-center gap-4 text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Zap className="h-3 w-3" />
                  Privacy First
                </div>
                <div className="flex items-center gap-1">
                  <Heart className="h-3 w-3" />
                  Made with Care
                </div>
                <div className="flex items-center gap-1">
                  <Code className="h-3 w-3" />
                  Secure & Local
                </div>
              </div>
            </div>
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
