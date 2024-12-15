import { Separator } from '@/components/ui/separator'
import { ModeToggle } from '@/components/ui/themeToggle'
import AccountSwitcher from '@/features/dashboard/components/account-switcher'
import Sidebar from '@/features/dashboard/components/sidebar'
import { ComposeEmail } from '@/features/mail/components/ComposeEmails'
import { cn } from '@/lib/utils'
import { UserButton } from '@clerk/clerk-react'
import { useDashboard } from '../context/dashboard-context'

export default function SidebarDashboard() {
  const { isCollapsed } = useDashboard()
  return (
    <div className="flex flex-col h-full flex-1">
      <div
        className={cn(
          'flex h-[52px] items-center justify-between',
          isCollapsed ? 'h-[52px]' : 'p-2',
        )}
      >
        <AccountSwitcher isCollapsed={isCollapsed} />
      </div>
      <Separator />
      <Sidebar isCollapsed={isCollapsed} />
      <div className="flex-1">AI Chatbot</div>
      <div className="flex items-center gap-2 px-2 py-1">
        <UserButton />
        <ModeToggle />
        <ComposeEmail />
      </div>
    </div>
  )
}
