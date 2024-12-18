import type { Email } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { useMail } from '@/hooks/useMail'
import { cn } from '@/lib/utils'
import { formatDistanceToNow } from 'date-fns'
import { Reply } from 'lucide-react'
import Avatar from 'react-avatar'
import { Letter } from 'react-letter'

interface DisplayEmailsProps {
  email: Email
  openReply: () => void
  isLast: boolean
}
export function EmailDisplay({ email, openReply, isLast }: DisplayEmailsProps) {
  const { chosenAccount } = useMail()
  const isMe = email.from.address === chosenAccount?.emailAddress

  return (
    <div
      className={cn(
        'border rounded-md p-4 transition-all hover:translate-x-2',
        {
          'border-l-gray-900 border-l-4  dark:border-l-gray-200': isMe,
        },
      )}
    >
      <div className="flex gap-2 justify-between items-center">
        <div className="flex items-center justify-between gap-2">
          {!isMe && (
            <Avatar
              name={email.from.name ?? email.from.address}
              round
              size="35"
              email={email.from.address}
              textSizeRatio={2}
            />
          )}
          <span className="font-medium max-w-[200px] md:max-w-[600px] inline-block overflow-hidden text-ellipsis">
            {isMe ? 'Me' : email.from.address}
            <p className="text-xs  text-muted-foreground">
              {formatDistanceToNow(email?.sentAt, {
                addSuffix: true,
              })}
            </p>
          </span>
        </div>
      </div>
      <div className="h-4"></div>

      <Letter
        className="break-words overflow-y-auto max-w-[calc(100vw-100px)]"
        html={email.body ?? email.bodySnippet ?? ''}
      />

      {email.attachments.length > 0 && (
        <>
          <div className="h-4"></div>
          <div className="flex flex-wrap gap-1">
            {email.attachments.map(attachment => (
              <div
                onClick={() => {
                  const link = document.createElement('a')
                  if (attachment.contentLocation) {
                    link.href = `https://docs.google.com/viewer?url=${attachment.contentLocation}`
                  }
                  else {
                    // TODO
                  }
                  link.target = '_blank'
                  document.body.appendChild(link)
                  link.click()
                  document.body.removeChild(link)
                }}
                className="py-1 px-2 bg-gray-200 hover:scale-105 cursor-pointer text-sm"
              >
                {attachment.name}
              </div>
            ))}
          </div>
        </>
      )}
      {isLast && (
        <div className="mt-2">
          <Button onClick={openReply} variant="outline">
            <Reply />
            {' '}
            reply
          </Button>
        </div>
      )}
    </div>
  )
}
