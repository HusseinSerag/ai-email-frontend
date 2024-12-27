import { createAxiosClient } from '@/api/axios'
import { useCustomAuth } from '@/hooks/useCustomAuth'
import { useQuery } from '@tanstack/react-query'

export function useGetSubscription() {
  const { getToken, userId } = useCustomAuth()
  const { data, isPending } = useQuery({
    queryKey: ['subscription', userId],
    queryFn: async () => {
      const token = await getToken()
      if (!token) {
        throw new Error('No token!')
      }
      const res = (
        await createAxiosClient(token).get<boolean>(
          `/api/checkout/subscription`,
        )
      ).data
      return res
    },
  })
  return {
    data,
    isPending,
  }
}
