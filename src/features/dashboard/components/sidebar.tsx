import { Nav } from '@/components/ui/nav'

import { useCurrentTab } from '@/hooks/useCurrentTab'

import { useMail } from '@/hooks/useMail'
import { File, Inbox, Send } from 'lucide-react'

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
      ]}
    />
  )
}
