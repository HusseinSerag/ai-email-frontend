import type { SearchThread } from './types'

import { searchValueAtom } from '@/features/dashboard/components/Searchbar'
import { useCustomAuth } from '@/hooks/useCustomAuth'
import { useMail } from '@/hooks/useMail'
import { useQuery } from '@tanstack/react-query'
import { useAtom } from 'jotai'
import { useDebounceValue } from 'usehooks-ts'
import { createAxiosClient } from '../axios'

export default function useSearchThreads() {
  const { userId, getToken } = useCustomAuth()
  const { chosenAccount } = useMail()
  const [searchValue] = useAtom(searchValueAtom)
  const [debouncedSearchValue] = useDebounceValue(searchValue, 500)
  const accountId = chosenAccount?.id
  const { data: hits, isPending: isLoadingHits } = useQuery<SearchThread[]>({
    queryKey: ['threads-search', userId, accountId, searchValue],
    retry: false,

    async queryFn() {
      try {
        const token = await getToken()
        if (!accountId || !userId || !debouncedSearchValue || !token) {
          return null
        }

        return (
          await createAxiosClient(token).get(
            `/api/threads/search/${accountId}?query=${debouncedSearchValue}`,
          )
        ).data
      }
      catch (e) {
        return null
      }
    },
    enabled: navigator.onLine,
  })

  return {
    hits,
    isLoadingHits,
  }
}
