import { createAxiosClient } from '@/api/axios'
import { useCustomAuth } from '@/hooks/useCustomAuth'
import { useState } from 'react'
import { toast } from 'react-toastify'
import { useGetSubscription } from './useGetSubscription'

export function useCheckoutSession() {
  const [isLoading, setIsLoading] = useState(false)

  const { getToken } = useCustomAuth()
  const { data } = useGetSubscription()
  async function getCheckoutUrl() {
    try {
      setIsLoading(true)
      const token = await getToken()
      if (!token)
        throw new Error('No token!')

      const url = (
        await createAxiosClient(token).post<{
          paymentURL: string
          billingURL: string
        }>('/api/checkout/pay')
      ).data
      window.location.replace(data ? url.billingURL : url.paymentURL)
    }
    catch (e) {
      toast((e as Error).message)
    }
    setTimeout(() => setIsLoading(false), 2000)
  }
  return {
    getCheckoutUrl,
    isLoading,
  }
}
