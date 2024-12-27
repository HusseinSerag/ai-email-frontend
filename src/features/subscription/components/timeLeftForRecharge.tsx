import { formatDate } from '@/helpers/formatDate'
import { useQueryClient } from '@tanstack/react-query'
import { useEffect, useState } from 'react'

interface Props {
  time: string
}
export default function TimeLeftForRecharge({ time }: Props) {
  const [currentTime, setCurrentTime] = useState(new Date().getTime())
  const newTime = new Date(new Date(time).getTime() + 24 * 60 * 60 * 1000)
  const queryClient = useQueryClient()

  useEffect(() => {
    const interval = setInterval(async () => {
      setCurrentTime(new Date().getTime())
      if (newTime.getTime() < currentTime) {
        setTimeout(async () => {
          await queryClient.invalidateQueries({ queryKey: ['interaction'] })
        })
        clearInterval(interval)
      }
    }, 1000)
    return () => clearInterval(interval)
  }, [])
  const hoursLeft = (newTime.getTime() - currentTime) / 1000 / 60 / 60
  const minutesLeft = (newTime.getTime() - currentTime) / 1000 / 60
  const secondsLeft = (newTime.getTime() - currentTime) / 1000
  if (newTime.getTime() < currentTime) {
    return
  }
  return (
    <div className="text-sm font-semibold flex flex-col text-gray-800 md:max-w-full dark:text-gray-400">
      <div>
        {' '}
        credit recharge in
        {' '}
        {formatDate(Math.floor(hoursLeft))}
        :
        {formatDate(Math.floor(minutesLeft % 60))}
        :
        {formatDate(Math.floor(secondsLeft % 60))}
      </div>
    </div>
  )
}
