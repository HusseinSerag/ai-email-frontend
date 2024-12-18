import { Separator } from '@/components/ui/separator'
import { Sidebar, SidebarFooter, SidebarHeader } from '@/components/ui/sidebar'
import { ModeToggle } from '@/components/ui/themeToggle'
import AccountSwitcher from '@/features/dashboard/components/account-switcher'
import SidebarC from '@/features/dashboard/components/sidebar'

import { cn } from '@/lib/utils'

export default function SidebarDashboard() {
  return (
    <Sidebar>
      <div className="flex pb-2 flex-col px-2 h-full flex-1">
        <SidebarHeader>
          <div className={cn('flex h-[52px] items-center justify-between')}>
            <AccountSwitcher isCollapsed={false} />
          </div>
        </SidebarHeader>
        <Separator />
        <SidebarC isCollapsed={false} />
        <div className="flex-1">d</div>
        <SidebarFooter>
          <div className={cn('flex items-center gap-2 px-2 py-1', {})}>
            <ModeToggle />
          </div>
        </SidebarFooter>
      </div>
    </Sidebar>
  )
}
