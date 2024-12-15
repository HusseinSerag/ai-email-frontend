import type { Done } from '@/lib/globals'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import ThreadList from '@/features/threads/components/ThreadsList'

import { useCurrentDone } from '@/hooks/useCurrentDone'

import { useMail } from '@/hooks/useMail'
import { isInitialized } from '@/lib/types'
import { useDashboard } from '../context/dashboard-context'
import LoadingSyncing from './LoadingSyncing'

export default function ThreadListDashboard() {
  const { progress } = useDashboard()
  const { chosenAccount } = useMail()
  const { done, setDone } = useCurrentDone()
  return (
    <Tabs
      value={done}
      onValueChange={(e) => {
        setDone(e as Done)
      }}
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
  )
}
