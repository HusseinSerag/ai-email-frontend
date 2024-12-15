import { useMail } from '@/hooks/useMail'
import { chosenTab } from '@/lib/globals'
import { File, Inbox, Send } from 'lucide-react'
import { useLocalStorage } from 'usehooks-ts'
import { Nav } from './nav'

interface SidebarProps {
  isCollapsed: boolean
}

export default function Sidebar({ isCollapsed }: SidebarProps) {
  const [tab] = useLocalStorage<'inbox' | 'draft' | 'sent'>(chosenTab, 'inbox')
  const { count } = useMail()

  return (
    <Nav
      isCollapsed={isCollapsed}
      links={[
        {
          label: count?.inbox.toString(),
          icon: Inbox,
          title: 'Inbox',
          variant: tab === 'inbox' ? 'default' : 'ghost',
        },
        {
          title: 'Draft',
          label: count?.draft.toString(),
          icon: File,
          variant: tab === 'draft' ? 'default' : 'ghost',
        },
        {
          title: 'Sent',
          label: count?.sent.toString(),
          icon: Send,
          variant: tab === 'sent' ? 'default' : 'ghost',
        },
      ]}
    />
  )
}
