import type { Done } from '@/lib/globals'
import { useLocalStorage } from 'usehooks-ts'

const currentDone = 'current-inbox-or-done'

export function useCurrentDone() {
  const [done, setDone] = useLocalStorage<Done>(currentDone, 'inbox')

  return {
    done,
    setDone,
  }
}
