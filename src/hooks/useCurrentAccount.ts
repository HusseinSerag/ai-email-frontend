import { useLocalStorage } from 'usehooks-ts'

const currentAccount = 'current-chosen-account'
export function useCurrentAccount() {
  const [value, setValue] = useLocalStorage<string>(currentAccount, '')
  return { value, setValue }
}
