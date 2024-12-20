import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'
import { useMail } from '@/hooks/useMail'
import { Range } from '@/lib/range'
import { useSearchParams } from 'react-router-dom'

export default function PaginationThreads() {
  const { meta, isLoadingThreads } = useMail()
  const [searchParams, setSearchParams] = useSearchParams()
  const page = +(searchParams.get('page') || 0)
  // const offset = +(searchParams.get("offset") || 0);
  if (isLoadingThreads)
    return
  const range = new Range(
    Array.from({ length: meta?.totalPages ?? 0 }).map((_, i) => i),
  )
  const myRange = range.getRange(page)
  const start = range.start

  return (
    <div className="py-1">
      <Pagination>
        <PaginationContent>
          <PaginationPrevious
            disabled={page === 0}
            onClick={() => {
              if (page > 0) {
                searchParams.set('page', (page - 1).toString())
                setSearchParams(searchParams)
              }
            }}
          />
          {!myRange.includes(start) && <PaginationEllipsis />}
          {myRange.map((i: number) => (
            <PaginationItem
              onClick={() => {
                searchParams.set('page', i.toString())
                setSearchParams(searchParams)
              }}
            >
              <PaginationLink className={`${page === i && 'bg-gray-200'}`}>
                {i + 1}
              </PaginationLink>
            </PaginationItem>
          ))}
          {!myRange.includes(range.end ?? 0) && <PaginationEllipsis />}
          <PaginationNext
            disabled={page + 1 >= (meta?.totalPages ?? 0)}
            onClick={() => {
              if (page < (meta?.totalPages ?? 0) - 1) {
                searchParams.set('page', (page + 1).toString())
                setSearchParams(searchParams)
              }
            }}
          />
        </PaginationContent>
      </Pagination>
    </div>
  )
}
