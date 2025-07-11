import type React from "react"
import "./globals.css"
import "../styles/chaos-themes.css"
import ThemeLoader from "@/components/theme-loader"


import { Toaster } from "@/components/ui/toaster"

// Import modular components
import { AppWrapper } from "@/components/app-wrapper"
import MobileBottomNav from "@/components/mobile-bottom-nav"
// import AddyChatBubble from "@/components/addy-chat-bubble"
// import { ModuleRouter } from "@/lib/module-router"

export const metadata = {
  title: "Chaos Cycle - Fertility & Cycle Tracking",
  description: "Your secure, private fertility and menstrual cycle tracking app with BBT charts and ovulation prediction",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#7c3aed" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />

        {/* Favicon Links */}
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/icon-192.png" type="image/png" sizes="192x192" />
        <link rel="icon" href="/icon-512.png" type="image/png" sizes="512x512" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Atkinson+Hyperlegible:ital,wght@0,400;0,700;1,400;1,700&family=Poppins:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400;1,500;1,600;1,700&family=Lexend:wght@100;200;300;400;500;600;700;800;900&display=swap" rel="stylesheet" />

      </head>
      <body className="min-h-screen bg-background font-sans antialiased" suppressHydrationWarning>
        <ThemeLoader />
        <AppWrapper>
          <div className="min-h-screen pb-16">
            {children}
          </div>
          <MobileBottomNav />
          {/* <AddyChatBubble /> */}
          <Toaster />
        </AppWrapper>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // Load theme immediately to prevent color flash
              (function() {
                try {
                  const savedTheme = localStorage.getItem('chaos-theme') || 'theme-lavender';
                  const savedFont = localStorage.getItem('chaos-font') || 'font-atkinson';

                  // Available themes and fonts
                  const themes = ['theme-lavender', 'theme-chaos', 'theme-light', 'theme-colorblind', 'theme-glitter', 'theme-calm', 'theme-accessibility', 'theme-storm'];
                  const fonts = ['font-atkinson', 'font-poppins', 'font-lexend', 'font-system'];

                  // Remove all theme classes first
                  themes.forEach(theme => document.body.classList.remove(theme));

                  // Apply saved theme (lavender is default, no class needed)
                  if (savedTheme !== 'theme-lavender') {
                    document.body.classList.add(savedTheme);
                  }

                  // Remove all font classes first
                  fonts.forEach(font => document.body.classList.remove(font));

                  // Apply saved font
                  document.body.classList.add(savedFont);

                  console.log('🎨 Theme loaded immediately:', savedTheme);
                } catch (e) {
                  console.error('Failed to load theme:', e);
                }
              })();
            `,
          }}
        />
      </body>
    </html>
  )
}
