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
        if (accountId === '') {
          throw new Error('No account ID')
        }
        const token = await getToken()

        return (
          await createAxiosClient(token!).get<{
            draft: number
            sent: number
            inbox: number
            starred: number
          }>(`/api/threads/count/${accountId}`)
        ).data
      }
      catch (e) {
        return null
      }
    },
  })

  return {
    count,
    isPendingCount,
  }
}
