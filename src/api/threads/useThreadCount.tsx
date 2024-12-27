import { useCurrentAccount } from '@/hooks/useCurrentAccount'

import { useCustomAuth } from '@/hooks/useCustomAuth'
import { useQuery } from '@tanstack/react-query'
import { createAxiosClient } from '../axios'

export default function useThreadCount() {
  const { userId, getToken } = useCustomAuth()
  const { value: accountId } = useCurrentAccount()
  const { data: count, isPending: isPendingCount } = useQuery({
    queryKey: ['thread-count', userId, accountId],
    async queryFn() {
      try {
        const token = await getToken()
        if (!accountId || !userId || !token) {
          throw new Error('No account ID')
        }

        return (
          await createAxiosClient(token).get<{
            draft: number
            sent: number
            inbox: number
            starred: number
            social: number
            updates: number
            personal: number
            promotions: number
          }>(`/api/threads/count/${accountId}`)
        ).data
      }
      catch (e) {
        return null
      }
    },
    enabled: navigator.onLine,
    retry: false,
  })

  return {
    count,
    isPendingCount,
  }
}
