import { createAxiosClient } from '@/api/axios'
import { useCustomAuth } from '@/hooks/useCustomAuth'
import { useState } from 'react'
import { toast } from 'react-toastify'

export function useCheckoutSession() {
  const [isLoading, setIsLoading] = useState(false)

  const { getToken } = useCustomAuth()
  async function getCheckoutUrl() {
    try {
      setIsLoading(true)
      const token = await getToken()
      if (!token)
        throw new Error('No token!')

      const url = (
        await createAxiosClient(token).post<string>('/api/checkout/pay')
      ).data
      window.location.replace(url)
      setTimeout(() => setIsLoading(false), 2000)
    }
    catch (e) {
      toast((e as Error).message)
    }
  }
  return {
    getCheckoutUrl,
    isLoading,
  }
}
