import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { LoadingSpinner } from '@/components/ui/spinner'

import { useGetAuthUrl } from '@/features/dashboard/hooks/useGetAuthUrl'

import { useGetSubscription } from '@/features/subscription/api/useGetSubscription'

import { useCurrentAccount } from '@/hooks/useCurrentAccount'
import { useMail } from '@/hooks/useMail'
import { FREE_ACCOUNTS_PER_USER, PRO_ACCOUNTS_PER_USER } from '@/lib/globals'
import { cn } from '@/lib/utils'
import { useAtom } from 'jotai'
import { Plus, RotateCcw } from 'lucide-react'
import { SearchThreadAtom } from './SearchDisplay'

export default function AccountSwitcher() {
  const { accounts } = useMail()
  const { value, setValue } = useCurrentAccount()
  const [_, setThreadId] = useAtom(SearchThreadAtom)
  const { data: isSubscribed } = useGetSubscription()
  const { errorGettingUrl, getAuthUrl, isGettingUrl } = useGetAuthUrl()
  return (
    <div className="flex flex-col">
      <Select
        defaultValue={value}
        onValueChange={(e) => {
          setValue(e)
          setThreadId('')
        }}
      >
        <SelectTrigger
          className={cn(
            'flex w-full flex-1 items-center gap-2 [&>span]:line-clamp-1 [&>span]:flex [&>span]:w-full [&>span]:items-center [&>span]:gap-1 [&>span]:truncate [&_svg]:h-4 [&_svg]:w-4 [&_svg]:shrink-0',
          )}
          aria-label="Select account"
        >
          <SelectValue placeholder="Select an account">
            <span className={` ml-2`}>
              {accounts?.find(account => account.id === value)?.emailAddress}
            </span>
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {accounts?.map(account => (
            <SelectItem value={account.id} key={account.id}>
              <div className="flex items-center gap-3 [&_svg]:h-4 [&_svg]:w-4 [&_svg]:shrink-0 [&_svg]:text-foreground">
                {account.emailAddress}
              </div>
            </SelectItem>
          ))}

          {isGettingUrl
            ? (
                <LoadingSpinner outerClassName="flex justify-center py-1.5 items-center w-full" />
              )
            : (
                <button
                  onClick={getAuthUrl}
                  className="flex items-center w-full hover:bg-gray-50 rounded-sm py-1.5 pl-2 pr-8 text-sm outline-none hover:cursor-pointer focus:bg-accent"
                >
                  {errorGettingUrl
                    ? (
                        <>
                          <RotateCcw className="size-4 mr-1" />
                          <span>Try again</span>
                        </>
                      )
                    : (
                        <>
                          <Plus className="size-4 mr-1" />
                          <span>Add Account</span>
                        </>
                      )}
                  {' '}
                </button>
              )}
          {}
        </SelectContent>
      </Select>

      {accounts && (
        <div className="text-xs mt-1 text-muted-foreground text-center font-semibold">
          {!isSubscribed
            ? `${FREE_ACCOUNTS_PER_USER - accounts.length} free accounts left`
            : `${PRO_ACCOUNTS_PER_USER - accounts.length} accounts left`}
        </div>
      )}
    </div>
  )
}
