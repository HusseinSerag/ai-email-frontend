import { useNetworkStatus } from '@/hooks/useNetworkStatus'

export default function OnlineStatus() {
  const isOnline = useNetworkStatus()
  if (!isOnline) {
    return (
      <div className="bg-red-500 sticky top-0 text-white p-2">
        You are offline, please reconnect to internet.
      </div>
    )
  }
}
