import { Button } from '@/components/ui/button'

export function MainErrorFallback({ error }: { error: Error }) {
  return (
    <div
      className="flex h-screen w-screen flex-col items-center justify-center text-red-500"
      role="alert"
    >
      {error.message}
      <h2 className="text-lg font-semibold">Ooops, something went wrong :( </h2>
      <Button className="mt-4" onClick={() => window.location.replace('/mail')}>
        Refresh
      </Button>
    </div>
  )
}
