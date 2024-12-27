import type { ReplyToInformation } from '@/lib/types'

import { useCustomAuth } from '@/hooks/useCustomAuth'

import { useMail } from '@/hooks/useMail'
import { useQuery } from '@tanstack/react-query'
import { createAxiosClient } from '../axios'

export default function useReplyToInfo() {
  const { userId, getToken } = useCustomAuth()
  const { chosenAccount, threadId } = useMail()

  const accountId = chosenAccount?.id
  const { data: details, isPending: isLoadingDetails } = useQuery({
    queryKey: ['threads-info', userId, accountId, threadId],

    async queryFn() {
      try {
        const token = await getToken()
        if (!accountId || !threadId || !userId || !token) {
          throw new Error('No account ID')
        }

        return (
          await createAxiosClient(token).get<ReplyToInformation>(
            `/api/threads/info/${accountId}/${threadId}`,
            {},
          )
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
    details,
    isLoadingDetails,
  }
}
