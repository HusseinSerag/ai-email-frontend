import useAccountThreads from '@/api/account/useAccountThreads'
import useThreadCount from '@/api/account/useThreadCount'
import useUserAccounts from '@/api/account/useUserAccounts'

import { atom, useAtom } from 'jotai'

import { useCurrentAccount } from './useCurrentAccount'

export const threadIdAtom = atom<string | null>(null)

export function useMail() {
  const { accounts, isPendingAccounts } = useUserAccounts()
  const { isPendingCount, count } = useThreadCount()
  const { threads, isLoadingThreads, refetchThreads } = useAccountThreads()
  const { value: accountId } = useCurrentAccount()
  const chosenAccount = accounts?.find(acc => acc.id === accountId)
  const [threadId, setThreadId] = useAtom(threadIdAtom)

  const isLoading = isPendingAccounts || isPendingCount

  return {
    accounts: accounts!,
    isLoading,
    count,
    threads,
    isLoadingThreads,
    chosenAccount,
    threadId,
    setThreadId,
    refetchThreads,
  }
}
