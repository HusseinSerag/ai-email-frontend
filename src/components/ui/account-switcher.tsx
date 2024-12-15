import { useGetAuthUrl } from '@/features/dashboard/hooks/useGetAuthUrl'
import { useMail } from '@/hooks/useMail'
import { localStorageKeyAccountId } from '@/lib/globals'
import { cn } from '@/lib/utils'

import { Plus, RotateCcw } from 'lucide-react'
import { useLocalStorage } from 'usehooks-ts'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './select'
import { LoadingSpinner } from './spinner'

interface AccountSwitcherProps {
  isCollapsed: boolean
}

export default function AccountSwitcher({ isCollapsed }: AccountSwitcherProps) {
  const { accounts, setThreadId } = useMail()
  const [value, setValue] = useLocalStorage<string>(
    localStorageKeyAccountId,
    '',
  )

  const { errorGettingUrl, getAuthUrl, isGettingUrl } = useGetAuthUrl()
  return (
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
          isCollapsed
          && 'flex h-9 w-9 shrink-0 items-center justify-center p-0 [&>span]:w-auto [&>svg]:hidden',
        )}
        aria-label="Select account"
      >
        <SelectValue placeholder="Select an account">
          <span className={`${!isCollapsed && 'hidden'}`}>
            {accounts?.find(account => account.id === value)?.emailAddress[0]}
          </span>
          <span className={`${isCollapsed && 'hidden'} ml-2`}>
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
  )
}
