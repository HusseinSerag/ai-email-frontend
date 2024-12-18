import type { Done } from '@/lib/globals'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { SidebarTrigger } from '@/components/ui/sidebar'

import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'

import { ComposeEmail } from '@/features/mail/components/ComposeEmails'
import ThreadList from '@/features/threads/components/ThreadsList'

import { useCurrentDone } from '@/hooks/useCurrentDone'
import { useCurrentTab } from '@/hooks/useCurrentTab'
import { useMail } from '@/hooks/useMail'
import { isInitialized } from '@/lib/types'
import { BotMessageSquare } from 'lucide-react'
import useIOevents from '../hooks/useIOevents'
import LoadingSyncing from './LoadingSyncing'

export default function ThreadListDashboard() {
  const { progress } = useIOevents()
  const { chosenAccount } = useMail()
  const { done, setDone } = useCurrentDone()
  const { tab } = useCurrentTab()
  return (
    <Tabs
      value={done}
      onValueChange={(e) => {
        setDone(e as Done)
      }}
      className=" h-full w-full relative overflow-y-hidden"
      defaultValue="inbox"
    >
      <div className="flex items-center px-4 py-2">
        <SidebarTrigger />
        <h1 className="text-xl ml-2 font-bold">
          {tab[0].toLocaleUpperCase() + tab.slice(1)}
        </h1>
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

      <div className="sticky  flex items-center justify-center mt-3 gap-4  bottom-0">
        <Button variant="outline">
          <BotMessageSquare className="size-4" />
        </Button>
        <ComposeEmail />
      </div>
    </Tabs>
  )
}
