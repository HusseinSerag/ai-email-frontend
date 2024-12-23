import type { Action } from 'kbar'
import { useCurrentAccount } from '@/hooks/useCurrentAccount'

import { useCurrentDone } from '@/hooks/useCurrentDone'
import { useCurrentTab } from '@/hooks/useCurrentTab'

import { useMail } from '@/hooks/useMail'
import { Priority, useRegisterActions } from 'kbar'
import { useMemo } from 'react'

export default function useKbarMail() {
  const { setTab } = useCurrentTab()
  const { setDone } = useCurrentDone()
  const { accounts } = useMail()
  const { setValue: setAccountId } = useCurrentAccount()
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
        }) as Action,
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
        name: 'See all',
        shortcut: ['g', 'd'],
        keywords: 'done',
        section: 'Navigation',
        subtitle: 'View the all emails',
        perform: () => {
          setDone('all')
        },
      },
      {
        id: 'done',
        name: 'See unread',
        shortcut: ['g', 'u'],
        keywords: 'unread, undone, not done',
        section: 'Navigation',
        subtitle: 'View the unread emails',
        perform: () => {
          setDone('unread')
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
