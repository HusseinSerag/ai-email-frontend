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
  return axiosClient
}
