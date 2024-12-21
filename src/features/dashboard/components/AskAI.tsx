import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowDown, BotMessageSquare, Send, SparklesIcon } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { useChat } from '../hooks/useChat'

export default function AskAI() {
  const {
    handleInputChange,
    handleSubmit,
    input,
    messages,
    isLoading,
    setMessages,
    isGenerating,
    setInput,
  } = useChat()

  const messageContainerRef = useRef<HTMLDivElement>(null)
  const [isAtBottom, setIsAtBottom] = useState(true)
  const [showScrollButton, setShowScrollButton] = useState(false)

  // Check if user is at the bottom of the container
  const handleScroll = () => {
    const container = messageContainerRef.current
    if (!container)
      return

    const isBottom
      = Math.ceil(container.scrollTop + container.clientHeight)
      >= container.scrollHeight

    setIsAtBottom(isBottom)
    setShowScrollButton(!isBottom)
  }

  // Scroll to the bottom when messages change, if user is already at the bottom
  useEffect(() => {
    if (isAtBottom && messageContainerRef.current) {
      messageContainerRef.current.scrollTo({
        top: messageContainerRef.current.scrollHeight,
        behavior: 'smooth',
      })
    }
  }, [messages, isAtBottom])

  const scrollToBottom = () => {
    if (messageContainerRef.current) {
      messageContainerRef.current.scrollTo({
        top: messageContainerRef.current.scrollHeight,
        behavior: 'smooth',
      })
    }
  }

  const handleClearMessages = () => {
    setMessages([])
    setIsAtBottom(true)
  }

  return (
    <Dialog>
      <DialogTrigger>
        <Button variant="outline">
          <BotMessageSquare className="size-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="w-[90%] rounded-2xl bg-gray-100 shadow-inner dark:bg-gray-900">
        <DialogTitle>Talk with AI</DialogTitle>
        <div className="flex flex-col items-end pb-1 rounded-lg relative">
          <div
            ref={messageContainerRef}
            className="max-h-[50vh] h-[50vh] overflow-y-scroll w-full flex flex-col gap-2"
            onScroll={handleScroll}
          >
            <AnimatePresence>
              {messages.length === 0 && (
                <div className="w-full h-full flex-col flex items-center justify-center">
                  <div className="flex items-center gap-4">
                    <SparklesIcon className="size-6 text-gray-600" />
                    <div>
                      <p className="text-gray-900 dark:text-gray-100">
                        Ask AI anything about your emails
                      </p>
                      <p className="text-gray-500 dark:text-gray-400 ">
                        Get answers to your questions about your emails
                      </p>
                    </div>
                  </div>
                  <div className="mt-4 flex-wrap justify-center flex gap-2">
                    <span
                      onClick={() => setInput('What can I ask?')}
                      className="px-2 py-1 bg-gray-800 cursor-pointer text-gray-200 rounded-md text-xs"
                    >
                      What can I ask?
                    </span>
                    <span
                      onClick={() => setInput('When is my next flight?')}
                      className="px-2 py-1 bg-gray-800 cursor-pointer text-gray-200 rounded-md text-xs"
                    >
                      When is my next flight?
                    </span>
                    <span
                      onClick={() =>
                        setInput('What is my last food order price?')}
                      className="px-2 py-1 bg-gray-800 cursor-pointer text-gray-200 rounded-md text-xs"
                    >
                      What is my last food order price?
                    </span>
                  </div>
                </div>
              )}
              {messages.map(message => (
                <motion.div
                  key={message.id}
                  layout="position"
                  className={cn(
                    'z-10 mt-2 max-w-[250px] break-words rounded-2xl bg-gray-200 dark:bg-gray-800',
                    {
                      'self-end text-gray-900 dark:text-gray-100':
                        message.role === 'user',
                      'self-start bg-blue-500 text-white':
                        message.role === 'system',
                    },
                  )}
                  transition={{
                    type: 'easeOut',
                    duration: 0.2,
                  }}
                >
                  <div className="px-3 py-2 text-sm leading-[15px]">
                    {message.content}
                  </div>
                </motion.div>
              ))}

              {isLoading && (
                <motion.div
                  layout="position"
                  className={cn(
                    'z-10 mt-2 max-w-[250px] break-words rounded-2xl dark:bg-gray-800 self-start bg-blue-500 text-white',
                  )}
                  transition={{
                    type: 'easeOut',
                    duration: 0.2,
                  }}
                >
                  <div className="px-3 py-2">
                    <div className="loader"></div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Scroll to Bottom Button */}
          {showScrollButton && !isGenerating && (
            <div
              onClick={scrollToBottom}
              className="absolute bottom-16 z-[20] right-4 cursor-pointer bg-gray-300 dark:bg-gray-700 text-white p-2 rounded-full shadow-md hover:bg-gray-600 transition"
            >
              <ArrowDown className="h-5 w-5" />
            </div>
          )}

          {messages.find(message => message.role === 'system')
          && !isLoading && (
            <div
              onClick={handleClearMessages}
              className="w-full flex my-1 justify-center"
            >
              <div className="flex items-center justify-center cursor-pointer font-semibold text-black dark:text-white dark:bg-gray-800 px-1.5 py-1 bg-gray-200 text-xs rounded-2xl">
                clear messages
              </div>
            </div>
          )}

          {/* Input and send button */}
          <div className="w-full mt-1">
            <form onSubmit={handleSubmit} className="w-full gap-2 flex">
              <Input
                type="text"
                className="py-1 relative h-9 placeholder:text-[13px] placeholder:font-semibold flex-grow rounded-full border border-gray-200 px-3 text-[15px] outline-none"
                placeholder="Ask AI about your emails"
                value={input}
                onChange={handleInputChange}
                disabled={isLoading}
              />

              <Button
                type="submit"
                size="icon"
                variant="outline"
                className="rounded-full bg-gray-200 dark:bg-gray-800"
                disabled={isLoading}
              >
                <Send className="text-gray-500 dark:text-gray-300" />
              </Button>
            </form>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
