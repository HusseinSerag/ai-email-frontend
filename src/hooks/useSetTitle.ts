import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { useMail } from './useMail'

export function useSetTitle() {
  const { chosenAccount } = useMail()
  const { pathname } = useLocation()
  useEffect(
    () => {
      if (pathname === '/mail' && chosenAccount)
        document.title = chosenAccount.emailAddress
      else document.title = 'AI Email'
    },
    [chosenAccount],
  )
}
