import { Separator } from '@/components/ui/separator'

import { SidebarProvider } from '@/components/ui/sidebar'
import ThreadListDashboard from '@/features/dashboard/components/threadListDashboard'

import useKbarMail from '@/features/kbar/useKbarMailPage'
import ThreadDisplay from '@/features/threads/components/ThreadDisplay'

import { useMail } from '@/hooks/useMail'
import { cn } from '@/lib/utils'
import { TooltipProvider } from '../../../components/ui/tooltip'
import SidebarDashboard from './sidebarDashboard'

export function Dashboard() {
  const { threadId } = useMail()
  useKbarMail()

  return (
    <SidebarProvider>
      <SidebarDashboard />

      <TooltipProvider>
        <div className="relative w-full h-full">
          <div
            className={cn(
              'h-full flex-1 overflow-hidden relative flex w-full md:grid md:grid-cols-3  ',
            )}
          >
            <div
              className={cn(
                `flex-1 md:flex h-full w-full col-span-1 hidden ${!threadId ? 'block' : 'hidden'} `,
              )}
            >
              <ThreadListDashboard />
            </div>

            <div
              className={cn(
                `flex-1 md:flex min-w-full hidden col-span-2 ${threadId ? 'block' : 'hidden'}`,
              )}
            >
              <Separator className="md:block hidden" orientation="vertical" />
              <ThreadDisplay />
            </div>
          </div>
        </div>
      </TooltipProvider>
    </SidebarProvider>
  )
}
