import { Head } from '@/app/seo/head'
import { LoadingSpinner } from '@/components/ui/spinner'
import { Dashboard } from '@/features/dashboard/components/Dashboard'

import { useMail } from '@/hooks/useMail'

export default function Mail() {
  const { isLoading } = useMail()
  if (isLoading) {
    return (
      <LoadingSpinner outerClassName="h-full w-full flex items-center justify-center" />
    )
  }
  return (
    <>
      <Head title={document.title} description="" />

      <Dashboard />
    </>
  )
}
