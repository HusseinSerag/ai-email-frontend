import axios from 'axios'
import { toast } from 'react-toastify'

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
      if (message !== 'User does not exist')
        toast.error(`Error: ${message}`)
      return null
    },
  )
  return axiosClient
}
