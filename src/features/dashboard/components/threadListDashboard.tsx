import type { Unread } from '@/lib/globals'

import { Separator } from '@/components/ui/separator'
import { SidebarTrigger } from '@/components/ui/sidebar'

import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import ThreadList from '@/features/threads/components/ThreadsList'

import { useCurrentDone } from '@/hooks/useCurrentDone'
import { useCurrentTab } from '@/hooks/useCurrentTab'
import { useMail } from '@/hooks/useMail'
import { isInitialized } from '@/lib/types'
import { useAtom } from 'jotai'
import useIOevents from '../hooks/useIOevents'
import LoadingSyncing from './LoadingSyncing'
import SearchBar, { searchValueAtom } from './Searchbar'
import SearchDisplay from './SearchDisplay'

interface Props {
  children: React.ReactNode
}
export default function ThreadListDashboard({ children }: Props) {
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
        <div className="flex justify-between  items-center sticky top-0 px-2 py-2">
          <h1 className="text-xl ml-2 flex items-center font-bold">
            <SidebarTrigger />
            {tab[0].toLocaleUpperCase() + tab.slice(1)}
          </h1>
          <TabsList>
            <TabsTrigger
              value="all"
              className="text-zinc-600 dark:text-zinc-200"
            >
              All
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

      {children}
    </Tabs>
  )
}
