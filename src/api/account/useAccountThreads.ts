import type { EmailThreadArray } from '@/lib/types'
import { useCustomAuth } from '@/hooks/useCustomAuth'
import {
  chosenTab,
  inboxOrDone,
  localStorageKeyAccountId,
} from '@/lib/globals'
import { useQuery } from '@tanstack/react-query'
import { useLocalStorage } from 'usehooks-ts'
import { createAxiosClient } from '../axios'

export default function useAccountThreads() {
  const { userId, getToken } = useCustomAuth()
  const [accountId] = useLocalStorage(localStorageKeyAccountId, '')
  const [tab] = useLocalStorage(chosenTab, 'inbox')
  const [done] = useLocalStorage(inboxOrDone, 'inbox')
  const {
    data: threads,
    isPending: isLoadingThreads,
    refetch: refetchThreads,
  } = useQuery({
    queryKey: ['threads', userId, accountId, tab, done],

    async queryFn() {
      try {
        if (!accountId || !tab || !userId) {
          throw new Error('No account ID')
        }
        const token = await getToken()

        const res = await createAxiosClient(token!).get<{
          data: EmailThreadArray
        }>(`/api/accounts/threads/${accountId}`, {
          params: {
            isDone: done,
            tab,
          },
        })

        return res.data.data
      }
      catch (e) {
        return null
      }
    },
  })

  return {
    threads,
    isLoadingThreads,
    refetchThreads,
  }
}
