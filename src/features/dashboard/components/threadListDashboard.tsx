import type { Unread } from '@/lib/globals'

import { Separator } from '@/components/ui/separator'
import { SidebarTrigger } from '@/components/ui/sidebar'

import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'

import { ComposeEmail } from '@/features/mail/components/ComposeEmails'
import ThreadList from '@/features/threads/components/ThreadsList'

import { useCurrentDone } from '@/hooks/useCurrentDone'
import { useCurrentTab } from '@/hooks/useCurrentTab'
import { useMail } from '@/hooks/useMail'
import { isInitialized } from '@/lib/types'
import { UserButton } from '@clerk/clerk-react'
import { useAtom } from 'jotai'

import useIOevents from '../hooks/useIOevents'
import AskAI from './AskAI'
import LoadingSyncing from './LoadingSyncing'
import SearchBar, { searchValueAtom } from './Searchbar'

import SearchDisplay from './SearchDisplay'

export default function ThreadListDashboard() {
  const { progress } = useIOevents()
  const { chosenAccount } = useMail()
  const { done, setDone } = useCurrentDone()
  const { tab } = useCurrentTab()
  const [searchValue] = useAtom(searchValueAtom)
  return (
    <Tabs
      value={done}
      onValueChange={(e) => {
        setDone(e as Unread)
      }}
      className=" h-full max-h-screen overflow-y-auto flex flex-col w-full relative "
      defaultValue="inbox"
    >
      <div className="sticky z-10 bg-white dark:bg-black top-0">
        <div className="flex items-center sticky top-0 px-4 py-2">
          <SidebarTrigger />
          <h1 className="text-xl ml-2 font-bold">
            {tab[0].toLocaleUpperCase() + tab.slice(1)}
          </h1>
          <TabsList className="ml-auto">
            <TabsTrigger
              value="all"
              className="text-zinc-600 dark:text-zinc-200"
            >
              All mails
            </TabsTrigger>
            <TabsTrigger
              value="unread"
              className="text-zinc-600 dark:text-zinc-200"
            >
              unread
            </TabsTrigger>
          </TabsList>
        </div>
        <div>
          <Separator />

          <SearchBar />
        </div>
      </div>

      {searchValue && (
        <div className="md:hidden block">
          <SearchDisplay />
        </div>
      )}
      <div
        className={`${searchValue ? 'hidden md:block' : 'block overflow-y-auto relative'}`}
      >
        <ThreadList>
          {chosenAccount
          && chosenAccount.isSyncedInitially === isInitialized.start && (
            <LoadingSyncing progress={progress} />
          )}
        </ThreadList>
      </div>

      <div className="sticky py-1 bg-white dark:bg-black  flex items-center justify-center mt-3 gap-4  bottom-0">
        <UserButton />
        <AskAI />
        <ComposeEmail />
      </div>
    </Tabs>
  )
}
