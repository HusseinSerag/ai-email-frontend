import type { EmailThreadArray } from '@/lib/types'
import { useCurrentAccount } from '@/hooks/useCurrentAccount'

import { useCurrentDone } from '@/hooks/useCurrentDone'

import { useCurrentTab } from '@/hooks/useCurrentTab'
import { useCustomAuth } from '@/hooks/useCustomAuth'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useSearchParams } from 'react-router-dom'
import { createAxiosClient } from '../axios'

export default function useAccountThreads() {
  const { userId, getToken } = useCustomAuth()
  const { value: accountId } = useCurrentAccount()
  const { tab } = useCurrentTab()
  const { done } = useCurrentDone()
  const [searchParams] = useSearchParams()
  const page = +(searchParams.get('page') || 0)
  const offset = +(searchParams.get('offset') || 10)
  const queryClient = useQueryClient()
  const fn = async (page: number) => {
    try {
      if (!accountId || !tab || !userId) {
        throw new Error('No account ID')
      }
      const token = await getToken()

      return (
        await createAxiosClient(token!).get<{
          data: EmailThreadArray
          meta: {
            currentPage: number
            totalPages: number
            totalCount: number
          }
        }>(`/api/threads/${accountId}`, {
          params: {
            isDone: done,
            tab,
            page,
            offset,
          },
        })
      ).data
    }
    catch (e) {
      return null
    }
  }
  const {
    data: threads,
    isPending: isLoadingThreads,
    refetch: refetchThreads,
  } = useQuery({
    retry: false,
    queryKey: ['threads', userId, accountId, tab, done, page],
    queryFn: () => fn(page),
    enabled: navigator.onLine,
  })
  if (page - 1 >= 0) {
    queryClient.prefetchQuery({
      queryKey: ['threads', userId, accountId, tab, done, page - 1],
      queryFn: () => fn(page - 1),

      retry: false,
    })
  }
  if (threads && page + 1 < threads?.meta.totalPages) {
    queryClient.prefetchQuery({
      queryKey: ['threads', userId, accountId, tab, done, page + 1],
      queryFn: () => fn(page + 1),

      retry: false,
    })
  }

  return {
    threads,
    isLoadingThreads,
    refetchThreads,
  }
}
