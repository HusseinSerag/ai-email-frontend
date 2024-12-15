import type { Action } from 'kbar'
import { useMail } from '@/hooks/useMail'
import {
  chosenTab,
  inboxOrDone,
  localStorageKeyAccountId,
} from '@/lib/globals'
import { Priority, useRegisterActions } from 'kbar'
import { useMemo } from 'react'
import { useLocalStorage } from 'usehooks-ts'

export default function useKbarMail() {
  const [_, setTab] = useLocalStorage<'inbox' | 'draft' | 'sent'>(
    chosenTab,
    'inbox',
  )
  const [___, setDone] = useLocalStorage(inboxOrDone, 'inbox')
  const { accounts } = useMail()
  const [__, setAccountId] = useLocalStorage(localStorageKeyAccountId, '')
  const kbarAccounts = useMemo(() => {
    return accounts?.map(
      account =>
        ({
          id: account.id,
          name: account.emailAddress,
          parent: 'account-switch',
          perform() {
            setAccountId(account.id)
          },
        } as Action),
    )
  }, [accounts])

  const actions = kbarAccounts ?? []
  useRegisterActions(
    [
      {
        id: 'inbox',
        name: 'Inbox',
        shortcut: ['g', 'i'],
        keywords: 'inbox',
        section: 'Navigation',
        subtitle: 'View your inbox',
        perform: () => {
          setTab('inbox')
        },
      },
      {
        id: 'drafts',
        name: 'Drafts',
        shortcut: ['g', 'd'],
        keywords: 'drafts',
        priority: Priority.HIGH,
        subtitle: 'View your drafts',
        section: 'Navigation',
        perform: () => {
          setTab('draft')
        },
      },
      {
        id: 'sent',
        name: 'Sent',
        shortcut: ['g', 's'],
        keywords: 'sent',
        section: 'Navigation',
        subtitle: 'View the sent',
        perform: () => {
          setTab('sent')
        },
      },
      {
        id: 'pending',
        name: 'See done',
        shortcut: ['g', 'd'],
        keywords: 'done',
        section: 'Navigation',
        subtitle: 'View the done emails',
        perform: () => {
          setDone('done')
        },
      },
      {
        id: 'done',
        name: 'See Pending',
        shortcut: ['g', 'u'],
        keywords: 'pending, undone, not done',
        section: 'Navigation',
        subtitle: 'View the pending emails',
        perform: () => {
          setDone('inbox')
        },
      },
      {
        id: 'account-switch',
        name: 'Accounts',
        shortcut: ['a'],
        keywords: 'account switch',
        section: 'Change Account',
      },
      ...actions,
    ],
    [kbarAccounts],
  )
}
