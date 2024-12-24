// "/read/:id/:threadId"

import { toast } from '@/hooks/use-toast'

import { useCustomAuth } from '@/hooks/useCustomAuth'
import { useMail } from '@/hooks/useMail'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createAxiosClient } from '../axios'

export default function useToggleReadThread() {
  const { userId, getToken } = useCustomAuth()
  const { chosenAccount } = useMail()
  const queryClient = useQueryClient()

  const accountId = chosenAccount?.id
  const { mutate: toggleRead, isPending: isTogglingRead } = useMutation({
    async mutationFn({ threadId }: { threadId: string }) {
      try {
        if (!accountId || !threadId || !userId) {
          throw new Error('No account ID')
        }
        const token = await getToken()

        return (
          await createAxiosClient(token!).patch<{ unread: boolean }>(
            `/api/threads/read/${accountId}/${threadId}`,
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

      if (data?.unread) {
        toast({
          description: 'marked unread successfully!',
        })
      }
    },
  })

  return {
    toggleRead,
    isTogglingRead,
  }
}
