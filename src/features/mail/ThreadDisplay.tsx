import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Separator } from '@/components/ui/separator'
import { useMail } from '@/hooks/useMail'
import { format } from 'date-fns'

import {
  Archive,
  ArchiveX,
  Clock,
  MoreVertical,
  Trash2Icon,
} from 'lucide-react'
import { EmailDisplay } from './EmailDisplay'
import ReplyBox from './ReplyBox'

export default function ThreadDisplay() {
  const { threadId, threads } = useMail()
  const thread = threads?.find(thread => thread.id === threadId)

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center p-2">
        <div className="flex h-full gap-2">
          <Button variant="ghost" size="icon" disabled={!thread}>
            <Archive className="size-4" />
          </Button>
          <Button variant="ghost" size="icon" disabled={!thread}>
            <ArchiveX className="size-4" />
          </Button>
          <Button variant="ghost" size="icon" disabled={!thread}>
            <Trash2Icon className="size-4" />
          </Button>
          <Separator orientation="vertical" className="ml-2" />
          <Button
            variant="ghost"
            size="icon"
            className="ml-2"
            disabled={!thread}
          >
            <Clock className="size-4" />
          </Button>
        </div>
        <div className="flex items-center ml-auto">
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Button variant="ghost" size="icon" disabled={!thread}>
                <MoreVertical className="size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>Mark as unread</DropdownMenuItem>
              <DropdownMenuItem>Star thread</DropdownMenuItem>
              <DropdownMenuItem>Add label</DropdownMenuItem>
              <DropdownMenuItem>Mute thread</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <Separator />
      {thread
        ? (
            <>
              <div className="flex flex-col flex-1 overflow-scroll">
                <div className="flex items-center p-4">
                  <div className="flex items-center gap-4 text-sm">
                    <Avatar>
                      <AvatarImage alt="avatar" />
                      <AvatarFallback>
                        {thread.emails[0].from.name
                          ?.split(' ')
                          .map(str => str[0])
                          .join('')
                          || thread.emails[0].from.address
                            .split(' ')
                            .map(str => str[0])
                            .join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="grid gap-1">
                      <div className="font-semibold">
                        {thread.emails[0].from?.name
                        || thread.emails[0].from.address}
                        <div className="text-xs line-clamp-1">
                          {thread.emails[0]?.subject}
                        </div>
                        <div className="text-xs line-clamp-1">
                          <span className="font-medium">To: </span>
                          {thread.emails[0].to.map(to => to.address).join(', ')}
                        </div>
                        {thread.emails[0].replyTo.length > 0 && (
                          <div className="text-xs line-clamp-1">
                            <span className="font-medium">Reply-To: </span>
                            {thread.emails[0].replyTo
                              .map(to => to.address)
                              .join(', ')}
                          </div>
                        )}
                        {thread.emails[0].cc.length > 0 && (
                          <div className="text-xs line-clamp-1">
                            <span className="font-medium">cc: </span>
                            {thread.emails[0].cc.map(to => to.address).join(', ')}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  {thread.emails[0].sentAt && (
                    <div className="ml-auto text-xs text-muted-foreground">
                      {format(thread.emails[0].sentAt, 'PPpp')}
                      {' '}
                    </div>
                  )}
                </div>
                <Separator />
                <div className="max-h-[calc(100vh-400px)] overflow-scroll flex flex-col">
                  <div className="p-6 flex flex-col gap-4">
                    {thread.emails.map(email => (
                      <EmailDisplay email={email} key={email.id} />
                    ))}
                  </div>
                </div>
                <div className="flex-1"></div>
                <Separator className="mt-auto" />
                <ReplyBox />
              </div>
            </>
          )
        : (
            <>
              <div className="p-8 text-center text-muted-foreground">
                No message selected
              </div>
            </>
          )}
    </div>
  )
}
