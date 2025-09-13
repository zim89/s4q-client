'use client'

import type { ComponentProps } from 'react'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from '@/shared/components/ui/sidebar'
import {
  workspaceNavMain,
  workspaceProjects,
  workspaceTeams,
  workspaceUser,
} from '../lib/constants'
import { NavMain } from './nav-main'
import { NavProjects } from './nav-projects'
import { NavUser } from './nav-user'
import { TeamSwitcher } from './team-switcher'

export const WorkspaceSidebar = ({
  ...props
}: ComponentProps<typeof Sidebar>) => {
  return (
    <Sidebar collapsible='icon' {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={workspaceTeams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={workspaceNavMain} />
        <NavProjects projects={workspaceProjects} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={workspaceUser} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
