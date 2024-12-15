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
