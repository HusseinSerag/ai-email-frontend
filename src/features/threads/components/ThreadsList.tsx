import type { EmailThread } from '@/lib/types'
import type { ReactNode } from 'react'
import useToggleReadThread from '@/api/threads/useToggleReadThread'
import { Badge } from '@/components/ui/badge'
import { LoadingSpinner } from '@/components/ui/spinner'

import { SearchThreadAtom } from '@/features/dashboard/components/SearchDisplay'
import { useCurrentDone } from '@/hooks/useCurrentDone'

import { useCurrentTab } from '@/hooks/useCurrentTab'
import { useMail } from '@/hooks/useMail'

import { cn } from '@/lib/utils'
import { format, formatDistanceToNow } from 'date-fns'
import DOMPurify from 'dompurify'

import { useAtom } from 'jotai'
import { Fragment } from 'react/jsx-runtime'
import { getBadgeVariantFromLabel } from '../util/getBageVariant'

interface ThreadListProps {
  children?: ReactNode
}
export default function ThreadList({ children }: ThreadListProps) {
  const { threads, isLoadingThreads, threadId } = useMail()
  const { tab } = useCurrentTab()
  const [_, setSearchId] = useAtom(SearchThreadAtom)
  const { isTogglingRead, toggleRead } = useToggleReadThread()
  const { done } = useCurrentDone()
  if (isLoadingThreads) {
    return (
      <LoadingSpinner outerClassName="w-full h-full flex items-center justify-center" />
    )
  }
  const groupedThreads = new Map<string, EmailThread[]>()

  for (const thread of threads || []) {
    const date = format(
      thread.emails.at(-1)?.sentAt ?? new Date(),
      'yyyy-MM-dd',
    )

    const otherThreads = groupedThreads.get(date) || []
    groupedThreads.set(date, [...otherThreads, thread])
  }
  const entries = Array.from(groupedThreads.entries())

  return (
    <div className="max-w-full pb-4">
      <div className="flex flex-col gap-2 p-4 pt-0">
        {groupedThreads.size === 0
          ? (
              <div className="p-8 text-center text-muted-foreground">
                No threads yet
              </div>
            )
          : (
              entries.map((entry) => {
                return (
                  <Fragment key={entry[0]}>
                    <div className="text-xs font-medium text-muted-foreground mt-4 first:mt-0">
                      {entry[0]}
                    </div>
                    {entry[1].map((thread) => {
                      return (
                        <button
                          onClick={() => {
                            setSearchId(prev =>
                              prev === thread.id ? '' : thread.id,
                            )

                            if (
                              thread.emails.some(email =>
                                email.sysLabels.includes('unread'),
                              )
                              && !isTogglingRead
                            ) {
                              toggleRead({
                                threadId: thread.id,
                              })
                            }
                          }}
                          key={thread.id}
                          className={cn(
                            'flex flex-col items-start gap-2 rounded-lg border p-3 text-left overflow-hidden text-sm transition-all relative',
                            {
                              'bg-accent': thread.id === threadId,
                            },
                          )}
                        >
                          <div className="flex flex-col overflow-hidden text-ellipsis w-full gap-2">
                            <div className="flex items-center">
                              <div className="flex items-center gap-2">
                                <div className="font-semibold  text-[12px] md:text-base">
                                  {tab !== 'sent'
                                  && (thread.emails.at(-1)?.from?.name
                                    || thread.emails.at(-1)?.from?.address)}
                                  {tab === 'sent' && (
                                    <div className="w-full text-[14px]">
                                      {`To: ${
                                        thread.emails.at(-1)?.to.at(-1)?.name
                                        || thread.emails.at(-1)?.to.at(-1)?.address
                                      }`}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                            <div
                              className={cn(
                                'text-muted-foreground font-medium text-xs',
                              )}
                            >
                              {formatDistanceToNow(
                                thread.emails.at(-1)?.sentAt ?? new Date(),
                                {
                                  addSuffix: true,
                                },
                              )}
                            </div>
                            <div className="text-sm font-semibold">
                              {thread.subject}
                            </div>
                          </div>
                          <div
                            dangerouslySetInnerHTML={{
                              __html: DOMPurify.sanitize(
                                thread.emails.at(-1)?.bodySnippet || '',
                                {
                                  USE_PROFILES: {
                                    html: true,
                                  },
                                },
                              ),
                            }}
                            className="text-xs line-clamp-2  text-muted-foreground"
                          >
                          </div>
                          {thread.emails[0]?.sysLabels.length > 0 && (
                            <div className="flex items-center gap-2">
                              {thread.emails[0]?.sysLabels
                                .filter(
                                  label =>
                                    (done === 'unread' && label !== 'unread')
                                    || done === 'all',
                                )
                                .map((label) => {
                                  return (
                                    <Badge
                                      variant={getBadgeVariantFromLabel(label)}
                                      key={label}
                                      className="text-xs font-medium"
                                    >
                                      {label}
                                    </Badge>
                                  )
                                })}
                            </div>
                          )}
                        </button>
                      )
                    })}
                  </Fragment>
                )
              })
            )}
      </div>
      {children}
    </div>
  )
}
