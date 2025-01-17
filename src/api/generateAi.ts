import type { Message } from '@/features/dashboard/hooks/useChat'

export async function generateEmail(
  { context, prompt }: { context: string, prompt: string },
  getToken: () => Promise<string | null>,
) {
  try {
    const token = await getToken()

    if (!token)
      throw new Error('Unauthenticated')

    const response = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/api/ai/generate`,
      {
        method: 'POST',
        body: JSON.stringify({
          context,
          prompt,
        }),
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-type': 'application/json',
        },
      },
    )
    return response
  }
  catch (e) {
    throw e
  }
}

export async function generateChat(
  token: string,
  message: Message[],
  accountId: string,
  cb?: (message: string) => void,
) {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/api/ai/chat/${accountId}`,
      {
        method: 'POST',
        body: JSON.stringify({
          messages: message,
        }),
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-type': 'application/json',
        },
      },
    )

    if (!response.ok) {
      const res = await response.json()
      const message = res.message

      if (response.status === 402) {
        cb?.(message)
      }
      throw new Error(message)
    }
    return response
  }
  catch (e) {
    throw e
  }
}
