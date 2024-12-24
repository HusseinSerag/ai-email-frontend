import { Nav } from '@/components/ui/nav'
import { Separator } from '@/components/ui/separator'

import { useCurrentTab } from '@/hooks/useCurrentTab'

import { useMail } from '@/hooks/useMail'
import {
  Archive,
  CircleAlert,
  File,
  GlobeLock,
  Inbox,
  Send,
  Star,
  UsersRound,
} from 'lucide-react'

interface SidebarProps {
  isCollapsed: boolean
}

export default function Sidebar({ isCollapsed }: SidebarProps) {
  const { tab } = useCurrentTab()
  const { count } = useMail()

  return (
    <>
      <Nav
        isCollapsed={isCollapsed}
        links={[
          {
            label: count?.inbox.toString(),
            icon: Inbox,
            title: 'inbox',
            variant: tab === 'inbox' ? 'default' : 'ghost',
            display: 'Inbox',
          },
          {
            title: 'draft',
            label: count?.draft.toString(),
            icon: File,
            variant: tab === 'draft' ? 'default' : 'ghost',
            display: 'Draft',
          },
          {
            title: 'sent',
            label: count?.sent.toString(),
            icon: Send,
            variant: tab === 'sent' ? 'default' : 'ghost',
            display: 'Sent',
          },
          {
            title: 'starred',
            label: count?.starred.toString(),
            icon: Star,
            variant: tab === 'starred' ? 'default' : 'ghost',
            display: 'Starred',
          },
          {
            title: 'archived',
            icon: Archive,
            variant: tab === 'archived' ? 'default' : 'ghost',
            display: 'Archived',
          },
        ]}
      />
      <Separator />
      <Nav
        isCollapsed={isCollapsed}
        links={[
          {
            label: count?.social.toString(),
            icon: UsersRound,
            title: 'social',
            variant: tab === 'social' ? 'default' : 'ghost',
            display: 'Social',
          },
          {
            title: 'updates',
            label: count?.updates.toString(),
            icon: CircleAlert,
            variant: tab === 'updates' ? 'default' : 'ghost',
            display: 'Updates',
          },
          {
            title: 'personal',
            label: count?.personal.toString(),
            icon: GlobeLock,
            variant: tab === 'personal' ? 'default' : 'ghost',
            display: 'Personal',
          },
          {
            title: 'promotions',
            label: count?.promotions.toString(),
            icon: Archive,
            variant: tab === 'promotions' ? 'default' : 'ghost',
            display: 'Promotions',
          },
        ]}
      />
    </>
  )
}
