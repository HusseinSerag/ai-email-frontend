import type { ReplyToInformation } from '@/lib/types'

// /thread/:id/:threadId
import { useCustomAuth } from '@/hooks/useCustomAuth'

import { useMail } from '@/hooks/useMail'
import { useQuery } from '@tanstack/react-query'
import { createAxiosClient } from '../axios'

export default function useReplyToInfo() {
  const { userId, getToken } = useCustomAuth()
  const { chosenAccount, threadId } = useMail()

  const accountId = chosenAccount?.id
  const { data: details, isPending: isLoadingDetails } = useQuery({
    queryKey: ['threads', userId, accountId, threadId],

    async queryFn() {
      try {
        if (!accountId || !threadId || !userId) {
          throw new Error('No account ID')
        }
        const token = await getToken()

        return (
          await createAxiosClient(token!).get<ReplyToInformation>(
            `/api/accounts/thread/${accountId}/${threadId}`,
            {},
          )
        ).data
      }
      catch (e) {
        return null
      }
    },
  })

  return {
    details,
    isLoadingDetails,
  }
}
