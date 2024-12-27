import type { ChangeEvent } from 'react'
import { generateChat } from '@/api/generateAi'
import { subscriptionAtom } from '@/features/subscription/components/ManageSubscription'
import { toast } from '@/hooks/use-toast'
import { useCustomAuth } from '@/hooks/useCustomAuth'
import { useMail } from '@/hooks/useMail'
import { useQueryClient } from '@tanstack/react-query'
import { useAtom } from 'jotai'
import { useState } from 'react'
import { v4 as uuid } from 'uuid'

export interface Message {
  content: string
  id: string
  role: 'user' | 'system'
}
interface Props {
  initialMessages?: Message[]
}
export function useChat(props?: Props) {
  const [messages, setMessages] = useState<Message[]>(
    props?.initialMessages ?? [],
  )
  const [input, setInput] = useState<string>('')
  const [isLoading, setIsLoading] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState('')
  const { getToken } = useCustomAuth()
  const { chosenAccount } = useMail()
  const [_, setSubscription] = useAtom(subscriptionAtom)
  const queryClient = useQueryClient()

  interface FormEvent {
    preventDefault: () => void
  }
  async function handleSubmit(e: FormEvent, content?: string) {
    e.preventDefault()
    if (isLoading)
      return
    if (!input && !content)
      return
    setError('')
    const id = uuid()
    const userMessage: Message = {
      content: content || input,
      role: 'user',
      id,
    }
    setMessages(messages => [...messages, userMessage])
    setIsLoading(true)
    const message: Message = {
      role: 'system',
      id: uuid(),
      content: '',
    }

    try {
      const token = await getToken()
      if (!token || !chosenAccount)
        throw new Error('unauthorized')
      const res = await generateChat(
        token,
        [...messages, userMessage],
        chosenAccount.id,
        (message) => {
          setSubscription(true)
          toast({
            title: 'Subscription required',
            description: message,
          })
        },
      )
      const reader = res.body?.pipeThrough(new TextDecoderStream()).getReader()
      setInput('')

      while (true) {
        if (!reader)
          break
        const { value: newChunk, done } = await reader.read()
        if (done)
          break

        message.content += newChunk
        setIsLoading(false)
        setIsGenerating(true)
        setMessages((messages) => {
          const updatedMessages = [...messages]
          const lastMessage = updatedMessages.findIndex(
            searchMessage => searchMessage.id === message.id,
          )
          if (lastMessage !== -1) {
            updatedMessages[lastMessage] = { ...message }
          }
          else {
            updatedMessages.push(message)
          }
          return updatedMessages
        })
      }
    }
    catch (e) {
      setError((e as Error).message)
    }
    setIsLoading(false)
    setIsGenerating(false)
    await queryClient.invalidateQueries({ queryKey: ['interaction'] })
  }

  function handleInputChange(e: ChangeEvent<HTMLInputElement>) {
    const valueWritten = e.target.value
    setInput(valueWritten)
  }

  return {
    handleInputChange,
    handleSubmit,
    messages,
    setMessages,
    input,
    isLoading,
    error,
    setInput,
    isGenerating,
  }
}
