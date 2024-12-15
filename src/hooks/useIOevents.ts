import { useCustomAuth } from '@/hooks/useCustomAuth'
import { useMail } from '@/hooks/useMail'
import { localStorageKeyAccountId } from '@/lib/globals'
import { MySocket } from '@/lib/socket'
import { useQueryClient } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { useLocalStorage } from 'usehooks-ts'
import { useToast } from './use-toast'

export default function useIOevents() {
  const { toast } = useToast()
  const { accounts, refetchThreads } = useMail()
  const [accountId] = useLocalStorage(localStorageKeyAccountId, '')
  const chosenAcc = accounts?.find(acc => acc.id === accountId)
  const { userId } = useCustomAuth()
  const queryClient = useQueryClient()
  const [progress, setProgress] = useState<{
    done: number
    total: number
  }>({
    done: 0,
    total: 0,
  })
  useEffect(() => {
    const socket = MySocket.getSocket(userId!)
    socket.addListener(
      'sync-done',
      async (values: { status: 'completed', accountId: string }) => {
        if (values.accountId === chosenAcc?.id) {
          // TODO:
        }
        else {
          const emailAddress = accounts?.find(
            acc => acc.id === values.accountId,
          )?.emailAddress
          if (emailAddress) {
            toast({
              description: `Syncing for ${emailAddress} is done`,
            })
          }
        }
        setProgress({
          done: 0,
          total: 0,
        })
        await queryClient.invalidateQueries({
          queryKey: ['accounts'],
        })
        await queryClient.invalidateQueries({
          queryKey: ['thread-count'],
        })
      },
    )
    socket.addListener(
      'sync-progress',
      async (values: {
        done: number
        total: number
        status: 'sync-progress'
        accountId: string
      }) => {
        if (values.accountId !== chosenAcc?.id) {
          const emailAddress = accounts?.find(
            acc => acc.id === values.accountId,
          )?.emailAddress

          if (emailAddress) {
            toast({
              description: `${values.done} out of ${values.total} emails synced`,
              title: `Syncing for ${emailAddress} in progress`,
            })
          }
        }
        setProgress({
          done: values.done,
          total: values.total,
        })
        await queryClient.invalidateQueries({
          queryKey: ['thread-count'],
        })
        refetchThreads()
      },
    )
  }, [])

  return {
    progress,
  }
}
