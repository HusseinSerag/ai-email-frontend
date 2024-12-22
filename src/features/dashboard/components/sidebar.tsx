import { Nav } from '@/components/ui/nav'

import { useCurrentTab } from '@/hooks/useCurrentTab'

import { useMail } from '@/hooks/useMail'
import { Archive, File, Inbox, Send, Star } from 'lucide-react'

interface SidebarProps {
  isCollapsed: boolean
}

export default function Sidebar({ isCollapsed }: SidebarProps) {
  const { tab } = useCurrentTab()
  const { count } = useMail()

  return (
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
  )
}
