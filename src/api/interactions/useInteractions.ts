import type { Interaction } from './types'
import { useCustomAuth } from '@/hooks/useCustomAuth'
import { useQuery } from '@tanstack/react-query'
import { createAxiosClient } from '../axios'

export default function useInteraction() {
  const { userId, getToken } = useCustomAuth()
  const { data: interaction } = useQuery({
    queryKey: ['interaction', userId],

    async queryFn() {
      try {
        if (!userId)
          throw new Error('No userId')
        const token = await getToken()

        return (
          await createAxiosClient(token!).get<Interaction>(
            '/api/ai/interactions',
          )
        ).data
      }
      catch (e) {
        return null
      }
    },
    retry: false,
    enabled: navigator.onLine,
  })

  if (interaction) {
    return transformData(interaction)
  }
  return null
}

function transformData(interaction: Interaction) {
  interaction.count
    = new Date(
      new Date(interaction?.firstInteraction).getTime() + 24 * 60 * 60 * 1000,
    ) < new Date()
      ? 0
      : interaction.count
  return interaction
}
