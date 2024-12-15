import { useToast } from '@/hooks/use-toast'

import { useCustomAuth } from '@/hooks/useCustomAuth'

import { useMail } from '@/hooks/useMail'

import { useMutation } from '@tanstack/react-query'
import { createAxiosClient } from '../axios'

export default function useSendEmail() {
  const { getToken } = useCustomAuth()
  const { toast } = useToast()
  const { chosenAccount } = useMail()
  const { mutate: sendEmail, isPending: isSendingEmail } = useMutation({
    mutationFn: async (body: FormData) => {
      try {
        const token = await getToken()
        if (!token || !chosenAccount)
          throw new Error('Unauthenticated!')
        await createAxiosClient(token).post(
          `/api/accounts/send/${chosenAccount.id}`,
          body,
        )
      }
      catch (e) {
        throw e
      }
    },

    onSuccess: () => {
      toast({
        title: 'Email sent!',
      })
    },
    onError: (e) => {
      toast({
        title: e.message,
      })
    },
  })

  return {
    sendEmail,
    isSendingEmail,
  }
}
