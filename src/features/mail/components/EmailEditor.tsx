import { generateEmail } from '@/api/generateAi'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { useToast } from '@/hooks/use-toast'

import { useCustomAuth } from '@/hooks/useCustomAuth'
import { useFiles } from '@/hooks/useFiles'

import { useMail } from '@/hooks/useMail'
import { turndown } from '@/lib/turndown'
import { Text } from '@tiptap/extension-text'
import { EditorContent, useEditor } from '@tiptap/react'

import StarterKit from '@tiptap/starter-kit'
import { Bot, X } from 'lucide-react'
import { useState } from 'react'
import AiComposeButton from './ai-composeButton'
import EditorMenuBar from './EditorMenuBar'
import SelectInput from './ToInput'

interface EmailEditorProps {
  isEditorOpened?: boolean
  subject: string
  setSubject: (value: string) => void
  toValue: {
    label: string
    value: string
  }[]
  setToValue: (
    value: {
      label: string
      value: string
    }[]
  ) => void

  ccValue: {
    label: string
    value: string
  }[]
  setCCValue: (
    value: {
      label: string
      value: string
    }[]
  ) => void

  to: string[]
  handleSend: (value: string, file: File[]) => Promise<void>
  isSending: boolean
  defaultToolBarExpanded: boolean
  takeThread?: boolean
}
export default function EmailEditor({
  ccValue,
  setCCValue,
  setSubject,
  setToValue,
  subject,
  toValue,
  defaultToolBarExpanded,
  handleSend,
  isSending,
  to,
  takeThread = true,
  isEditorOpened,
}: EmailEditorProps) {
  const [value, setValue] = useState('')

  const customText = Text.extend({
    addKeyboardShortcuts() {
      return {
        'alt-j': () => {
          onGenerate(this.editor.getText())
          return true
        },
      }
    },
  })
  const editor = useEditor({
    autofocus: false,
    extensions: [StarterKit, customText],
    onUpdate({ editor }) {
      setValue(editor?.getHTML())
    },
  })
  const [expanded, setExpanded] = useState(defaultToolBarExpanded)
  const { threads, threadId, chosenAccount } = useMail()
  const { getToken } = useCustomAuth()
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  const { addFile, files, removeFile } = useFiles()
  async function onGenerate(prompt: string) {
    const thread = threads?.find(thread => thread.id === threadId)

    let context = ''
    if (thread && takeThread) {
      for (const email of thread?.emails) {
        context += `
        subject: ${email.subject}
        From: ${email.from.name}
        from email: ${email.from.address}
        Sent: ${new Date(email.sentAt).toLocaleString()}
        Body: ${turndown.turndown(email.body ?? email.bodySnippet ?? '')}
        `
      }
    }
    context += `
    My name is ${chosenAccount?.name} and my email is ${chosenAccount?.emailAddress}`

    try {
      setIsLoading(true)

      const response = await generateEmail(
        {
          context,
          prompt,
        },
        getToken,
      )
      const reader = response.body
        ?.pipeThrough(new TextDecoderStream())
        .getReader()
      setIsLoading(false)
      while (true) {
        if (!reader)
          break
        const { value: newChunk, done } = await reader.read()
        if (done)
          break

        editor?.commands.insertContent(newChunk)
      }
    }
    catch (e) {
      toast({
        title: 'Error getting response!',
      })
      setIsLoading(false)
    }
  }

  if (editor && isEditorOpened) {
    return (
      <>
        <div>
          <div className="flex p-4 py-2 border-b">
            <EditorMenuBar addFile={addFile} editor={editor} />
          </div>
          <div className="p-4 pb-0 space-y-2">
            {expanded && (
              <div className="flex flex-col gap-1">
                <SelectInput
                  label="To"
                  onChange={setToValue}
                  placeholder="Add Recipients"
                  // @ts-ignore
                  value={toValue}
                />
                <SelectInput
                  label="CC"
                  onChange={setCCValue}
                  placeholder="Add Recipients"
                  // @ts-ignore
                  value={ccValue}
                />
                <Input
                  id="subject"
                  placeholder="Subject"
                  value={subject}
                  onChange={e => setSubject(e.target.value)}
                />
              </div>
            )}
            <div className="flex flex-col ">
              <div className="flex items-center justify-between w-full">
                <div
                  className="cursor-pointer flex gap-1"
                  onClick={() => setExpanded(t => !t)}
                >
                  <div className="text-green-600 font-medium">Draft to: </div>
                </div>

                <AiComposeButton
                  isComposing={defaultToolBarExpanded}
                  onGenerate={onGenerate}
                />
              </div>
              {to.length > 0 && (
                <div className="max-w-[300px] text-sm md:max-w-[600px] break-words">
                  {to.join(', ')}
                </div>
              )}
            </div>
          </div>
          <div className="prose max-h-[200px] overflow-y-auto w-full px-4">
            {!isLoading
              ? (
                  <EditorContent
                    editor={editor}
                    value={value}
                    placeholder="Write your email here..."
                    className="!w-full  dark:!text-white"
                  />
                )
              : (
                  <div className="flex w-full justify-center py-3">
                    <Bot className="animate-fastRotatePause" />
                  </div>
                )}
          </div>
          {files.length > 0 && (
            <div className="px-1 py-1 gap-1 flex flex-col">
              {files.map((file) => {
                return (
                  <div className="text-[12px] px-1 cursor-pointer flex justify-between gap-4 py-1.5 bg-gray-200">
                    <div
                      onClick={() => {
                        const url = URL.createObjectURL(file)
                        const link = document.createElement('a')
                        link.href = url
                        link.download = file.name
                        document.body.appendChild(link)
                        link.click()
                        document.body.removeChild(link)
                        URL.revokeObjectURL(url)
                      }}
                      className="font-semibold hover:underline flex-1"
                    >
                      {file.name.length > 30
                        ? `${file.name.slice(0, 30)}...`
                        : file.name}
                    </div>

                    <button onClick={() => removeFile(file.name)}>
                      <X className="size-4" />
                    </button>
                  </div>
                )
              })}
            </div>
          )}
          <Separator />
          <div className="py-3 px-4 flex md:items-center flex-col md:flex-row gap-4 justify-between">
            <span className="text-sm">
              Tip: Press
              {' '}
              <kbd className="text-gray-800 font-semibold text-xs bg-gray-100 border border-gray-200 rounded-lg px-2 py-1.5">
                alt + J
              </kbd>
              {' '}
              for AI autocomplete
            </span>
            <Button
              onClick={() => {
                handleSend(value, files).then(() => {
                  editor.commands.clearContent()
                })
              }}
              disabled={isSending || isLoading}
            >
              Send
            </Button>
          </div>
        </div>
      </>
    )
  }
  return null
}
