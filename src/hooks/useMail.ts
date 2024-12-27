import useUserAccounts from '@/api/account/useUserAccounts'
import useInteraction from '@/api/interactions/useInteractions'
import useThreadCount from '@/api/threads/useThreadCount'

import useAccountThreads from '@/api/threads/useThreads'

import { SearchThreadAtom } from '@/features/dashboard/components/SearchDisplay'
import { useGetSubscription } from '@/features/subscription/api/useGetSubscription'
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
  const { isPending: isPendingSubscription } = useGetSubscription()
  useInteraction()
  const chosenAccount = accounts?.find(acc => acc.id === accountId)

  const [searchId] = useAtom(SearchThreadAtom)

  const isLoading
    = isPendingAccounts || isPendingCount || isPendingSubscription

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
