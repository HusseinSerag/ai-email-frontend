import useGetThread from '@/api/threads/useGetThread'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Separator } from '@/components/ui/separator'
import { LoadingSpinner } from '@/components/ui/spinner'

import { isSearchAtom } from '@/features/dashboard/components/Searchbar'
import SearchDisplay, {
  SearchThreadAtom,
} from '@/features/dashboard/components/SearchDisplay'
import { useMail } from '@/hooks/useMail'
import { format } from 'date-fns'
import { useAtom } from 'jotai'
import {
  Archive,
  ArchiveX,
  Clock,
  MoreVertical,
  Trash2Icon,
  X,
} from 'lucide-react'
import { useEffect, useState } from 'react'
import { EmailDisplay } from '../../mail/components/EmailDisplay'
import ReplyBox from '../../mail/components/ReplyBox'

export default function ThreadDisplay() {
  const { threadId, threads, setThreadId } = useMail()
  const [openReplyBox, setOpenReplyBox] = useState(false)
  const [isSearching] = useAtom(isSearchAtom)

  const [searchId, setSearchId] = useAtom(SearchThreadAtom)
  useEffect(() => {
    setOpenReplyBox(false)
  }, [threadId])
  const { isPendingThread, thread: foundThread } = useGetThread()

  const thread = searchId
    ? foundThread
    : threads?.find(thread => thread.id === threadId)
  const disabled = !thread || isSearching || isPendingThread

  return (
    <div className="flex w-full flex-col max-h-screen h-full">
      <div className="flex items-center p-2">
        <div className="flex h-full gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              setThreadId('')
              setSearchId('')
            }}
            className="md:hidden block"
          >
            <X className=" ml-4 size-4" />
          </Button>
          <Button variant="ghost" size="icon" disabled={disabled}>
            <Archive className="size-4" />
          </Button>
          <Button variant="ghost" size="icon" disabled={disabled}>
            <ArchiveX className="size-4" />
          </Button>
          <Button variant="ghost" size="icon" disabled={disabled}>
            <Trash2Icon className="size-4" />
          </Button>
          <Separator orientation="vertical" className="ml-2" />
          <Button
            variant="ghost"
            size="icon"
            className="ml-2"
            disabled={disabled}
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
      {isSearching
        ? (
            <SearchDisplay />
          )
        : (
            <>
              {isPendingThread
                ? (
                    <LoadingSpinner outerClassName="w-full h-full flex items-center justify-center" />
                  )
                : thread
                  ? (
                      <>
                        <div className="flex flex-col flex-1 overflow-scroll">
                          <div className="flex gap-2  justify-between items-center p-4">
                            <div className="flex   items-center gap-4 text-sm">
                              <Avatar>
                                <AvatarImage alt="avatar" />
                                <AvatarFallback>
                                  {(
                                    thread.emails[0].from.name
                                      ?.split(' ')
                                      .map(str => str[0])
                                      .join('')
                                      || thread.emails[0].from.address
                                        .split(' ')
                                        .map(str => str[0])
                                        .join('')
                                  ).slice(0, 3)}
                                </AvatarFallback>
                              </Avatar>
                              <div className="grid max-w-[90%] gap-1">
                                <div className="font-semibold">
                                  {thread.emails[0].from?.name
                                  || thread.emails[0].from.address}
                                  <div className="text-xs text-wrap line-clamp-1">
                                    {thread.emails[0]?.subject}
                                  </div>
                                  <div className="text-xs line-clamp-1">
                                    <span className="font-medium">To: </span>
                                    <span className="text-wrap">
                                      {thread.emails[0].to
                                        .map(to => to.address)
                                        .join(', ')}
                                    </span>
                                  </div>
                                  {thread.emails[0].replyTo.length > 0 && (
                                    <div className="text-xs flex items-center gap-1 ">
                                      <span className="font-medium">Reply-To: </span>
                                      <span className="text-ellipsis overflow-hidden max-w-[200px] inline-block">
                                        {thread.emails[0].replyTo
                                          .map(to => to.address)
                                          .join(', ')}
                                      </span>
                                    </div>
                                  )}
                                  {thread.emails[0].cc.length > 0 && (
                                    <div className="text-xs line-clamp-1">
                                      <span className="font-medium">cc: </span>
                                      {thread.emails[0].cc
                                        .map(to => to.address)
                                        .join(', ')}
                                    </div>
                                  )}
                                  {thread.emails[0].sentAt && (
                                    <div className=" text-xs mt-2 text-muted-foreground">
                                      {format(thread.emails[0].sentAt, 'PPpp')}
                                      {' '}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                          <Separator />
                          <div className="max-h-full overflow-scroll flex flex-col">
                            <div className="p-6 flex flex-col gap-4">
                              {thread.emails.map((email, index) => (
                                <EmailDisplay
                                  openReply={() => setOpenReplyBox(o => !o)}
                                  email={email}
                                  key={email.id}
                                  isLast={index === thread.emails.length - 1}
                                />
                              ))}
                            </div>
                          </div>
                          <div className="flex-1"></div>
                          <div className="flex flex-col relative">
                            {openReplyBox && (
                              <div className=" border-[1px] ml-2 border-b-0  cursor-pointer absolute -top-8 p-2">
                                <X
                                  onClick={() => setOpenReplyBox(false)}
                                  className="size-4  "
                                />
                              </div>
                            )}
                            <Separator />
                            <ReplyBox isEditorOpened={openReplyBox} />
                          </div>
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
            </>
          )}
    </div>
  )
}
