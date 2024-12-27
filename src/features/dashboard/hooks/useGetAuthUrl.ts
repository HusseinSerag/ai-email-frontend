import { createAxiosClient } from '@/api/axios'
import { subscriptionAtom } from '@/features/subscription/components/ManageSubscription'
import { toast } from '@/hooks/use-toast'
import { useCustomAuth } from '@/hooks/useCustomAuth'
import { isAxiosError } from 'axios'
import { useAtom } from 'jotai'
import { useState } from 'react'

export function useGetAuthUrl() {
  const { getToken } = useCustomAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [_, setSubscription] = useAtom(subscriptionAtom)

  async function getAuthUrl() {
    try {
      const token = await getToken()
      setIsLoading(true)
      setError('')
      const res = await createAxiosClient(token!, false).get<string>(
        'api/email/auth/url',
      )

      window.location.replace(res.data)
      setTimeout(() => {
        setIsLoading(false)
      }, 2500)
    }
    catch (e) {
      if (isAxiosError(e) && e.response?.status === 403) {
        setIsLoading(false)
        toast({
          description: 'You have reached the maximum number of accounts',
        })
      }
      else if (isAxiosError(e) && e.response?.status === 400) {
        setIsLoading(false)
        setSubscription(true)
      }
      else {
        setIsLoading(false)
        setError((e as Error).message)
      }
    }
  }
  return {
    isGettingUrl: isLoading,
    errorGettingUrl: error,
    getAuthUrl,
  }
}
