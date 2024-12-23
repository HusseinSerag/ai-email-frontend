import { createAxiosClient } from '@/api/axios'
import { useCustomAuth } from '@/hooks/useCustomAuth'
import { useState } from 'react'

export function useGetAuthUrl() {
  const { getToken } = useCustomAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  async function getAuthUrl() {
    try {
      const token = await getToken()
      setIsLoading(true)
      setError('')
      const res = await createAxiosClient(token!).get<string>(
        'api/email/auth/url',
      )
      window.location.replace(res.data)
      setTimeout(() => {
        setIsLoading(false)
      }, 2500)
    }
    catch (e) {
      setIsLoading(false)
      setError((e as Error).message)
    }
  }
  return {
    isGettingUrl: isLoading,
    errorGettingUrl: error,
    getAuthUrl,
  }
}
