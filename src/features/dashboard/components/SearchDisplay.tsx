import useSearchThreads from '@/api/threads/useSearchThreads'
import { useMail } from '@/hooks/useMail'
import DOMPurify from 'dompurify'
import { atom, useAtom } from 'jotai'
import { Loader2 } from 'lucide-react'
import { isSearchAtom, searchValueAtom } from './Searchbar'

export const SearchThreadAtom = atom<string>('')
export default function SearchDisplay() {
  const [searchValue, setSearchValue] = useAtom(searchValueAtom)
  const { hits, isLoadingHits } = useSearchThreads()
  const { setThreadId } = useMail()
  const [__, setSearchId] = useAtom(SearchThreadAtom)
  const [_, setIsSearching] = useAtom(isSearchAtom)

  return (
    <div className="p-4 max-h-[70vh] md:max-h-[calc(100vh-120px)] overflow-y-auto">
      <div className="flex items-center gap-2 mb-4">
        <h2 className="text-gray-600 text-sm dark:text-gray-400">
          Your search with &quot;
          {searchValue}
          &quot; came back with...
        </h2>
      </div>
      {isLoadingHits
        ? (
            <div className="flex justify-center w-full">
              <Loader2 className="animate-spin " />
            </div>
          )
        : (hits?.length === 0 || !hits) && searchValue
            ? (
                <p className="text-sm text-muted-foreground">No results found.</p>
              )
            : (
                <ul className="flex flex-col gap-2">
                  {hits?.map((hit, index) => (
                    <li
                      key={index}
                      className="border list-none rounded-md p-4 hover:bg-gray-100 cursor-pointer transition-all dark:hover:bg-gray-900"
                      onClick={() => {
                        setThreadId('')
                        setSearchId(hit.threadId)
                        setSearchValue('')
                        setIsSearching(false)
                      }}
                    >
                      <h3 className="text-base font-medium">{hit.subject}</h3>
                      <p className="text-sm text-gray-500">
                        From:
                        {hit.from}
                      </p>
                      <p className="text-sm text-gray-500">
                        to:
                        {hit.to.join(', ')}
                      </p>
                      <p
                        className="text-sm mt-2"
                        dangerouslySetInnerHTML={{
                          __html: DOMPurify.sanitize(hit.rawBody, {
                            USE_PROFILES: { html: true },
                          }),
                        }}
                      >
                      </p>
                    </li>
                  ))}
                </ul>
              )}
    </div>
  )
}
