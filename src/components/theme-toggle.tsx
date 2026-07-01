'use client'

import * as React from 'react'
import { Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'
import { Button } from '@/components/ui/button'

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  const toggle = () => setTheme(theme === 'dark' ? 'light' : 'dark')

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggle}
      className="rounded-full h-10 w-10 border border-border/40 bg-background/60 backdrop-blur-md hover:bg-accent transition-colors"
      aria-label="Changer de thème"
    >
      {mounted ? (
        theme === 'dark' ? (
          <Sun className="h-[1.2rem] w-[1.2rem]" />
        ) : (
          <Moon className="h-[1.2rem] w-[1.2rem]" />
        )
      ) : (
        <Sun className="h-[1.2rem] w-[1.2rem] opacity-0" />
      )}
    </Button>
  )
}
