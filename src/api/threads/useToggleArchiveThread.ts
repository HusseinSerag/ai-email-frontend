// /thread/archive/:id/:threadId
import { toast } from '@/hooks/use-toast'

import { useCustomAuth } from '@/hooks/useCustomAuth'
import { useMail } from '@/hooks/useMail'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createAxiosClient } from '../axios'

export default function useToggleArchiveThread() {
  const { userId, getToken } = useCustomAuth()
  const { chosenAccount, threadId } = useMail()
  const queryClient = useQueryClient()

  const accountId = chosenAccount?.id
  const { mutate: archiveThread, isPending: isArchiving } = useMutation({
    async mutationFn() {
      try {
        if (!accountId || !threadId || !userId) {
          throw new Error('No account ID')
        }
        const token = await getToken()

        return (
          await createAxiosClient(token!).patch<{ archived: boolean }>(
            `/api/accounts/thread/archive/${accountId}/${threadId}`,
            {},
          )
        ).data
      }
      catch (e) {
        return null
      }
    },
    async onSuccess(data) {
      await queryClient.invalidateQueries({
        queryKey: ['threads'],
      })
      await queryClient.invalidateQueries({
        queryKey: ['thread-count'],
      })

      toast({
        description: data?.archived
          ? 'Thread archived successfully!'
          : 'Thread unarchived successfully',
      })
    },
  })

  return {
    archiveThread,
    isArchiving,
  }
}
