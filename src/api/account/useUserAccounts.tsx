import type { Account } from '@/lib/types'
import { useCustomAuth } from '@/hooks/useCustomAuth'
import { useQuery } from '@tanstack/react-query'
import { createAxiosClient } from '../axios'

export default function useUserAccounts() {
  const { userId, getToken } = useCustomAuth()
  const { data: accounts, isPending: isPendingAccounts } = useQuery({
    queryKey: ['accounts', userId],

    async queryFn() {
      try {
        if (!userId)
          throw new Error('No userId')
        const token = await getToken()

        return (
          await createAxiosClient(token!).get<Account[]>('/api/accounts/user')
        ).data
      }
      catch (e) {
        return null
      }
    },
    retry: false,
    enabled: navigator.onLine,
  })
  return {
    accounts,
    isPendingAccounts,
  }
}
