import SidebarDashboard from '@/features/dashboard/components/sidebarDashboard'
import ThreadListDashboard from '@/features/dashboard/components/threadListDashboard'
import { useDashboard } from '@/features/dashboard/context/dashboard-context'

import ThreadDisplay from '@/features/threads/components/ThreadDisplay'
import { cn } from '@/lib/utils'
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '../../../components/ui/resizable'
import { TooltipProvider } from '../../../components/ui/tooltip'

interface DashboardProps {
  defaultLayout?: [number, number, number]
  navCollapsedSize: number
}
export function Dashboard({
  defaultLayout = [20, 32, 48],
  navCollapsedSize,
}: DashboardProps) {
  const { setIsCollapsed } = useDashboard()
  return (
    <TooltipProvider delayDuration={0}>
      <ResizablePanelGroup
        direction="horizontal"
        onLayout={() => {}}
        className="items-stretch h-full"
      >
        <ResizablePanel
          defaultSize={defaultLayout[0]}
          collapsedSize={navCollapsedSize}
          collapsible={true}
          minSize={15}
          maxSize={20}
          onCollapse={() => {
            setIsCollapsed(true)
          }}
          onResize={() => {
            setIsCollapsed(false)
          }}
          className={cn({
            isCollapsed: 'min-w-[50px] transition-all duration-300 ease-in-out',
          })}
        >
          <SidebarDashboard />
        </ResizablePanel>
        <ResizableHandle withHandle />

        <ResizablePanel minSize={30} defaultSize={defaultLayout[1]}>
          <ThreadListDashboard />
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={defaultLayout[2]} minSize={30}>
          <ThreadDisplay />
        </ResizablePanel>
      </ResizablePanelGroup>
    </TooltipProvider>
  )
}
