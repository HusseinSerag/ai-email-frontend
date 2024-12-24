import type { Unread } from '@/lib/globals'
import { useLocalStorage } from 'usehooks-ts'

const currentDone = 'current-inbox-or-done'

export function useCurrentDone() {
  const [done, setDone] = useLocalStorage<Unread>(currentDone, 'all')

  return {
    done,
    setDone,
  }
}
