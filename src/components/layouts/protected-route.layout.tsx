import { useCurrentAccount } from '@/hooks/useCurrentAccount'
import { useCurrentDone } from '@/hooks/useCurrentDone'
import { useCurrentTab } from '@/hooks/useCurrentTab'
import { useCustomAuth } from '@/hooks/useCustomAuth'
import { useEffect } from 'react'
import { Navigate, Outlet, useNavigate } from 'react-router-dom'

export default function ProtectedRoutes() {
  const { isSignedIn } = useCustomAuth()
  const { setValue } = useCurrentAccount()
  const { setDone } = useCurrentDone()
  const { setTab } = useCurrentTab()
  const navigate = useNavigate()
  useEffect(() => {
    if (!isSignedIn) {
      navigate('/')
      setValue('')
      setDone('')
      setTab('')
    }
  })
  return isSignedIn ? <Outlet /> : <Navigate to="/" replace />
}
