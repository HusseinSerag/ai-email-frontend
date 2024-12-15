import { toast } from '@/hooks/use-toast'
import axios from 'axios'

export function createAxiosClient(token: string) {
  const backendUrl = import.meta.env.VITE_BACKEND_URL
  const axiosClient = axios.create({
    baseURL: backendUrl,
    headers: {
      Authorization: `Bearer ${token}`,
    },
    withCredentials: true,
  })
  // for better error and response handling
  axiosClient.interceptors.response.use(
    response => response.data,
    (error) => {
      const message = error.response?.data?.message || error.message
      toast({
        title: 'Error',
        description: message,
      })
      return null
    },
  )
  return axiosClient
}
