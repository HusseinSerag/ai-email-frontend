import AccountSwitcher from '@/components/ui/account-switcher'
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/components/ui/resizable'
import { Separator } from '@/components/ui/separator'
import Sidebar from '@/components/ui/sidebar'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ModeToggle } from '@/components/ui/themeToggle'
import { TooltipProvider } from '@/components/ui/tooltip'
import useIOevents from '@/hooks/useIOevents'
import { useMail } from '@/hooks/useMail'
import { inboxOrDone } from '@/lib/globals'

import useKbarMail from '@/lib/kbar/useKbarMailPage'
import { isInitialized } from '@/lib/types'
import { cn } from '@/lib/utils'
import { UserButton } from '@clerk/clerk-react'
import { useState } from 'react'
import { useLocalStorage } from 'usehooks-ts'
import { ComposeEmail } from './ComposeEmails'
import LoadingSyncing from './LoadingSyncing'
import ThreadDisplay from './ThreadDisplay'
import ThreadList from './ThreadsList'

interface MailProps {
  defaultLayout?: [number, number, number]
  navCollapsedSize: number
}

export default function MailDashboard({
  defaultLayout = [20, 32, 48],
  navCollapsedSize,
}: MailProps) {
  const { chosenAccount } = useMail()
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isDone, setIsDone] = useLocalStorage(inboxOrDone, 'inbox')
  const { progress } = useIOevents()
  useKbarMail()

  return (
    <TooltipProvider delayDuration={0}>
      <ResizablePanelGroup
        direction="horizontal"
        onLayout={() => {}}
        className="items-stretch h-full"
      >
        <ResizablePanel
          defaultSize={defaultLayout[0]}
          collapsedSize={navCollapsedSize}
          collapsible={true}
          minSize={15}
          maxSize={20}
          onCollapse={() => {
            setIsCollapsed(true)
          }}
          onResize={() => {
            setIsCollapsed(false)
          }}
          className={cn({
            isCollapsed: 'min-w-[50px] transition-all duration-300 ease-in-out',
          })}
        >
          <div className="flex flex-col h-full flex-1">
            <div
              className={cn(
                'flex h-[52px] items-center justify-between',
                isCollapsed ? 'h-[52px]' : 'p-2',
              )}
            >
              <AccountSwitcher isCollapsed={isCollapsed} />
            </div>
            <Separator />
            <Sidebar isCollapsed={isCollapsed} />
            <div className="flex-1">
              {/* AI chatbot here */}
              AI Chatbot
            </div>
            <div className="flex items-center gap-2 px-2 py-1">
              <UserButton />
              <ModeToggle />
              <ComposeEmail />
            </div>
          </div>
        </ResizablePanel>
        <ResizableHandle withHandle />

        <ResizablePanel minSize={30} defaultSize={defaultLayout[1]}>
          <Tabs
            value={isDone}
            onValueChange={e => setIsDone(e)}
            className=" h-full "
            defaultValue="inbox"
          >
            <div className="flex items-center  sticky top-0 px-4 py-2">
              <h1 className="text-xl font-bold">Inbox</h1>
              <TabsList className="ml-auto">
                <TabsTrigger
                  value="inbox"
                  className="text-zinc-600 dark:text-zinc-200"
                >
                  Inbox
                </TabsTrigger>
                <TabsTrigger
                  value="done"
                  className="text-zinc-600 dark:text-zinc-200"
                >
                  Done
                </TabsTrigger>
              </TabsList>
            </div>
            <Separator />
            {/* search bar */}

            <ThreadList>
              {chosenAccount
              && chosenAccount.isSyncedInitially === isInitialized.start && (
                <LoadingSyncing progress={progress} />
              )}
            </ThreadList>
          </Tabs>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={defaultLayout[2]} minSize={30}>
          <ThreadDisplay />
        </ResizablePanel>
      </ResizablePanelGroup>
    </TooltipProvider>
  )
}
