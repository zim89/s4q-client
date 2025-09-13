import { PlusIcon } from 'lucide-react'
import { Button, Input } from '@/shared/components/ui'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/shared/components/ui/breadcrumb'
import { Separator } from '@/shared/components/ui/separator'
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/shared/components/ui/sidebar'
import { WorkspaceSidebar } from './ui'

export const WorkspaceLayout = ({
  children,
}: {
  children: React.ReactNode
}) => {
  return (
    <SidebarProvider>
      <WorkspaceSidebar />
      <SidebarInset className='container'>
        <div className='space-y-4'>
          <div className='flex items-center justify-between gap-2 py-4'>
            <Input className='w-1/3' />
            <Button>
              <PlusIcon />
            </Button>
          </div>
          <header className='flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12'>
            <div className='flex items-center gap-2 px-4'>
              <SidebarTrigger className='-ml-1' />
              <Separator
                orientation='vertical'
                className='mr-2 data-[orientation=vertical]:h-4'
              />
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem className='hidden md:block'>
                    <BreadcrumbLink href='#'>Home</BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator className='hidden md:block' />
                  <BreadcrumbItem>
                    <BreadcrumbPage>Data Fetching</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </div>
          </header>
        </div>

        {children}
      </SidebarInset>
    </SidebarProvider>
  )
}
