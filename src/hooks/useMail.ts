import useUserAccounts from '@/api/account/useUserAccounts'
import useThreadCount from '@/api/threads/useThreadCount'
import useAccountThreads from '@/api/threads/useThreads'

import { SearchThreadAtom } from '@/features/dashboard/components/SearchDisplay'

import { useAtom } from 'jotai'
import { useCurrentAccount } from './useCurrentAccount'

export function useMail() {
  const { accounts, isPendingAccounts } = useUserAccounts()
  const { isPendingCount, count } = useThreadCount()
  const {
    threads: info,
    isLoadingThreads,
    refetchThreads,
  } = useAccountThreads()
  const { value: accountId } = useCurrentAccount()
  const chosenAccount = accounts?.find(acc => acc.id === accountId)

  const [searchId] = useAtom(SearchThreadAtom)

  const isLoading = isPendingAccounts || isPendingCount

  const threadId = searchId
  return {
    accounts: accounts!,
    isLoading,
    count,
    threads: info?.data,
    meta: info?.meta,
    isLoadingThreads,
    chosenAccount,
    threadId,
    refetchThreads,
  }
}
