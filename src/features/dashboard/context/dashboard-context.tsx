import useKbarMail from '@/lib/kbar/useKbarMailPage'
import { createContext, type ReactNode, useContext, useState } from 'react'

import useIOevents from '../hooks/useIOevents'

interface DashboardValue {
  progress: {
    done: number
    total: number
  }
  isCollapsed: boolean
  setIsCollapsed: React.Dispatch<React.SetStateAction<boolean>>
}
const Context = createContext<DashboardValue>({} as DashboardValue)

interface DashboardProviderProps {
  children: ReactNode
}
export default function DashboardProvider({
  children,
}: DashboardProviderProps) {
  const [isCollapsed, setIsCollapsed] = useState(false)

  const { progress } = useIOevents()
  useKbarMail()
  return (
    <Context.Provider
      value={{
        isCollapsed,
        setIsCollapsed,
        progress,
      }}
    >
      {children}
    </Context.Provider>
  )
}

export function useDashboard() {
  const context = useContext(Context)
  if (!context)
    throw new Error('Cannot use useDashboard outside of Dashboard provider')
  return context
}
