import { Input } from '@/components/ui/input'
import { useMail } from '@/hooks/useMail'
import { atom, useAtom } from 'jotai'
import { Loader2, Search, X } from 'lucide-react'

export const searchValueAtom = atom('')
export const isSearchAtom = atom(false)
export default function SearchBar() {
  const [searchValue, setSearchValue] = useAtom(searchValueAtom)
  const [isSearching, setIsSearching] = useAtom(isSearchAtom)
  const { isLoadingThreads } = useMail()

  return (
    <div className="relative px-4 py-2">
      <Search className="absolute left-6 top-[18px] size-4 text-muted-foreground" />
      <Input
        value={searchValue}
        onChange={(e) => {
          setSearchValue(e.target.value)
          if (e.target.value !== '')
            setIsSearching(true)
          else setIsSearching(false)
        }}
        placeholder="Search..."
        className="px-8"
      />
      <div className="absolute right-6 top-[18px] items-center gap-2 flex">
        {isLoadingThreads && (
          <Loader2 className="size-4 text-gray-400 animate-spin" />
        )}
        <button
          onClick={() => {
            setSearchValue('')
            setIsSearching(false)
          }}
          className="rounded-sm hover:bg-gray-400/2"
        >
          <X className="size-4 hover:text-gray-800 text-gray-400" />
        </button>
      </div>
    </div>
  )
}
