import { LoadingSpinner } from '@/components/ui/spinner'
import { useCustomAuth } from '@/hooks/useCustomAuth'

import { Outlet } from 'react-router-dom'

export default function LoadUserLayout() {
  const { isLoaded } = useCustomAuth()
  if (!isLoaded) {
    return (
      <LoadingSpinner outerClassName="h-full w-full flex items-center justify-center" />
    )
  }
  else {
    return <Outlet />
  }
}
