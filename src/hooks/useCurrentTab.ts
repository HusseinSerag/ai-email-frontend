import type { Tab } from '@/lib/globals'
import { useLocalStorage } from 'usehooks-ts'

const currentTab = 'current-chosen-tab'
export function useCurrentTab() {
  const [tab, setTab] = useLocalStorage<Tab>(currentTab, 'inbox')

  return {
    tab,
    setTab,
  }
}
