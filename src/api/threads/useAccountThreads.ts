import type { EmailThreadArray } from '@/lib/types'
import { useCurrentAccount } from '@/hooks/useCurrentAccount'

import { useCurrentDone } from '@/hooks/useCurrentDone'

import { useCurrentTab } from '@/hooks/useCurrentTab'
import { useCustomAuth } from '@/hooks/useCustomAuth'
import { useQuery } from '@tanstack/react-query'
import { createAxiosClient } from '../axios'

export default function useAccountThreads() {
  const { userId, getToken } = useCustomAuth()
  const { value: accountId } = useCurrentAccount()
  const { tab } = useCurrentTab()
  const { done } = useCurrentDone()
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

        return (
          await createAxiosClient(token!).get<EmailThreadArray>(
            `/api/accounts/threads/${accountId}`,
            {
              params: {
                isDone: done,
                tab,
              },
            },
          )
        ).data
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
