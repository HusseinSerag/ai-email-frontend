import { useCustomAuth } from '@/hooks/useCustomAuth'
import { localStorageKeyAccountId } from '@/lib/globals'
import { useQuery } from '@tanstack/react-query'
import { useLocalStorage } from 'usehooks-ts'
import { createAxiosClient } from '../axios'

export default function useThreadCount() {
  const { userId, getToken } = useCustomAuth()
  const [accountId] = useLocalStorage(localStorageKeyAccountId, '')
  const { data: count, isPending: isPendingCount } = useQuery({
    queryKey: ['thread-count', userId, accountId],
    async queryFn() {
      try {
        if (accountId === '') {
          throw new Error('No account ID')
        }
        const token = await getToken()

        const res = await createAxiosClient(token!).get<{
          data: {
            draft: number
            sent: number
            inbox: number
          }
        }>(`/api/accounts/thread-count/${accountId}`)

        return res.data.data
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
