// /thread/star/:id/:threadId

import { toast } from '@/hooks/use-toast'

import { useCustomAuth } from '@/hooks/useCustomAuth'
import { useMail } from '@/hooks/useMail'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createAxiosClient } from '../axios'

export default function useToggleStarThread() {
  const { userId, getToken } = useCustomAuth()
  const { chosenAccount, threadId } = useMail()
  const queryClient = useQueryClient()

  const accountId = chosenAccount?.id
  const { mutate: toggleThread, isPending: isToggling } = useMutation({
    async mutationFn() {
      try {
        const token = await getToken()
        if (!accountId || !threadId || !userId || !token) {
          throw new Error('No account ID')
        }

        return (
          await createAxiosClient(token).patch<{ starred: boolean }>(
            `/api/threads/star/${accountId}/${threadId}`,
            {},
          )
        ).data
      }
      catch (e) {
        return null
      }
    },
    async onSuccess(data) {
      await queryClient.refetchQueries({
        queryKey: ['thread'],
      })
      await queryClient.invalidateQueries({
        queryKey: ['thread'],
      })
      await queryClient.invalidateQueries({
        queryKey: ['thread-count'],
      })

      toast({
        description: data?.starred
          ? 'Thread starred successfully!'
          : 'Thread unstarred successfully',
      })
    },
  })

  return {
    toggleThread,
    isToggling,
  }
}
