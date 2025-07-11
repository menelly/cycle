"use client"

import { useState } from "react"
import AppCanvas from "@/components/app-canvas"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Settings, Database, Palette, MessageSquare, HelpCircle, Tag } from "lucide-react"

// Modal components
import { VisualSettingsModal } from "./visual-settings-modal"
import { DataManagementModal } from "./data-management-modal"
import { TagsModal } from "./tags-modal"
import { SupportModal } from "./support-modal"

export default function SettingsPage() {
  // Modal state management
  const [activeModal, setActiveModal] = useState<string | null>(null)

  const openModal = (modalName: string) => setActiveModal(modalName)
  const closeModal = () => setActiveModal(null)

  // Settings categories with their modal components
  const settingsCategories = [
    {
      id: 'visual',
      title: 'Visual Settings',
      description: 'Themes, fonts, colors, and goblin mode',
      icon: Palette,
      component: VisualSettingsModal
    },
    {
      id: 'data',
      title: 'Data Management',
      description: 'Export, backup, PIN setup, and restore default data',
      icon: Database,
      component: DataManagementModal
    },
    {
      id: 'tags',
      title: 'Tags',
      description: 'Manage user tags and special tags',
      icon: Tag,
      component: TagsModal
    },
    {
      id: 'support',
      title: 'Support & Info',
      description: 'Help, contact, and app information',
      icon: MessageSquare,
      component: SupportModal
    }
  ]

  return (
    <div className="max-w-4xl mx-auto">
      <AppCanvas currentPage="settings">
        <header className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2 flex items-center justify-center gap-2">
            <Settings className="h-8 w-8" />
            Settings & Customization
          </h1>
          <p className="text-lg text-muted-foreground">
            Configure your Chaos Cycle tracker to match your beautiful chaos
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {settingsCategories.map((category) => {
            const IconComponent = category.icon
            return (
              <Card key={category.id} className="cursor-pointer hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <IconComponent className="h-5 w-5" />
                    {category.title}
                  </CardTitle>
                  <CardDescription>
                    {category.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button
                    onClick={() => openModal(category.id)}
                    className="w-full"
                    variant="outline"
                  >
                    Configure
                  </Button>
                </CardContent>
              </Card>
            )
          })}
        </div>


        {/* Render active modal */}
        {settingsCategories.map((category) => {
          const ModalComponent = category.component
          return (
            <ModalComponent
              key={category.id}
              isOpen={activeModal === category.id}
              onClose={closeModal}
            />
          )
        })}


      </AppCanvas>
    </div>
  )
}
