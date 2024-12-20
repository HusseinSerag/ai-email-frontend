import type { EmailThread } from '@/lib/types'
import { SearchThreadAtom } from '@/features/dashboard/components/SearchDisplay'
// /get-thread/:id/:threadId
import { useCurrentAccount } from '@/hooks/useCurrentAccount'
import { useCustomAuth } from '@/hooks/useCustomAuth'
import { useQuery } from '@tanstack/react-query'
import { useAtom } from 'jotai'
import { createAxiosClient } from '../axios'

export default function useGetThread() {
  const { userId, getToken } = useCustomAuth()
  const { value: accountId } = useCurrentAccount()
  const [searchThread] = useAtom(SearchThreadAtom)
  const { data: thread, isPending: isPendingThread } = useQuery<EmailThread>({
    queryKey: ['thread-single', userId, accountId, searchThread],
    async queryFn() {
      try {
        const token = await getToken()
        if (!accountId || !userId || !searchThread || !token) {
          throw new Error('invalid')
        }

        return (
          await createAxiosClient(token!).get(
            `/api/accounts/get-thread/${accountId}/${searchThread}`,
          )
        ).data
      }
      catch (e) {
        return null
      }
    },
  })

  return {
    thread,
    isPendingThread,
  }
}
