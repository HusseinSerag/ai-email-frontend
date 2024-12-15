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

        const res = await createAxiosClient(token!).get<{
          data: Omit<EmailParticipant, 'accountId'>[]
        }>(`/api/accounts/suggestions/${chosenAccount.id}`)

        return res.data.data
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
