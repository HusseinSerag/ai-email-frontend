import type {
  Action,
} from 'kbar'
import type { ReactNode } from 'react'
import { useTheme } from '@/context/themeProvider'

import {
  KBarAnimator,
  KBarPortal,
  KBarPositioner,
  KBarProvider,
  KBarSearch,
} from 'kbar'
import RenderResults from './RenderResults'

interface KbarProps {
  children: ReactNode
}
interface KbarComponentProps {
  children: ReactNode
}
export default function Kbar({ children }: KbarProps) {
  const { setTheme } = useTheme()

  const actions: Action[] = [
    {
      id: 'light',
      name: 'Light mode',
      shortcut: ['l'],
      keywords: 'light, light mode',
      section: 'Theme',
      subtitle: 'Toggle light mode',
      perform: () => {
        setTheme('light')
      },
    },
    {
      id: 'dark',
      name: 'Dark mode',
      shortcut: ['d'],
      keywords: 'dark, dark mode',
      section: 'Theme',
      subtitle: 'Toggle dark mode',
      perform: () => {
        setTheme('dark')
      },
    },
  ]

  return (
    <KBarProvider actions={actions}>
      <KbarComponent>{children}</KbarComponent>
    </KBarProvider>
  )
}
function KbarComponent({ children }: KbarComponentProps) {
  return (
    <>
      <KBarPortal>
        <KBarPositioner className="fixed inset-0 bg-black/40 dark:bg-black/60 backdrop-blur-sm  scrollbar-hide !p-0 z-[999]">
          <KBarAnimator className="max-w-[600px] !mt-64 w-full bg-white dark:bg-gray-800 text-foreground dark:text-gray-200 shadow-lg border dark:border-gray-600 rounded-lg overflow-hidden relative !-translate-y-16">
            <div className="bg-white dark:bg-gray-800">
              <div className="border-x-0 border-b-2 dark:border-gray-700">
                <KBarSearch className="w-full py-4 px-6 text-lg bg-white dark:bg-gray-600 outline-none border-none focus:ring-0 focus:ring-offset-0  focus:outline-none" />
              </div>
              <RenderResults />
            </div>
          </KBarAnimator>
        </KBarPositioner>
      </KBarPortal>
      {children}
    </>
  )
}
