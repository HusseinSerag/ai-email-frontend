import { useAuth } from '@clerk/clerk-react'
import { useQueryClient } from '@tanstack/react-query'
import { useEffect } from 'react'

export function useCustomAuth() {
  const { getToken, isSignedIn, signOut, isLoaded, userId } = useAuth()
  const queryClient = useQueryClient()
  useEffect(
    () => {
      queryClient.resetQueries()
      queryClient.cancelQueries()
      queryClient.removeQueries()
    },
    [userId],
  )

  return { getToken, isSignedIn, signOut, isLoaded, userId }
}
