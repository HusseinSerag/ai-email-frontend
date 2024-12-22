// /suggestions/:id

import type { EmailParticipant } from '@/lib/types'
import { useCustomAuth } from '@/hooks/useCustomAuth'
import { useMail } from '@/hooks/useMail'
import { useQuery } from '@tanstack/react-query'
import { createAxiosClient } from '../axios'

export default function useSuggestions() {
  const { userId, getToken } = useCustomAuth()
  const { chosenAccount } = useMail()
  const { data: suggestions, isPending: isPendingSuggestions } = useQuery({
    queryKey: ['suggestions', userId, chosenAccount?.id],
    async queryFn() {
      if (!userId || !chosenAccount)
        throw new Error('No userId')
      try {
        const token = await getToken()

        return (
          await createAxiosClient(token!).get<
            Omit<EmailParticipant, 'accountId'>[]
          >(`/api/email/suggestions/${chosenAccount.id}`)
        ).data
      }
      catch (e) {
        return null
      }
    },
  })
  return {
    suggestions,
    isPendingSuggestions,
  }
}
