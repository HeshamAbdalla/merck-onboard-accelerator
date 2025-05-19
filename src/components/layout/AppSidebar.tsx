
import React from 'react';
import { NavLink } from 'react-router-dom';
import { useChecklist } from '@/context/ChecklistContext';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger
} from '@/components/ui/sidebar';
import { 
  CheckCircle, 
  ListChecks, 
  UserCheck, 
  Users, 
  Settings
} from 'lucide-react';

const AppSidebar = () => {
  const { currentRole, setCurrentRole } = useChecklist();

  return (
    <Sidebar defaultCollapsed={false}>
      <SidebarHeader className="pb-4">
        <div className="flex items-center">
          <CheckCircle className="h-6 w-6 text-merck-purple" />
          <span className="ml-2 text-lg font-semibold">Merck Onboarding</span>
        </div>
        <SidebarTrigger />
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <NavLink
                    to="/"
                    className={({ isActive }) =>
                      `flex items-center gap-3 ${isActive ? 'text-merck-purple font-semibold' : ''}`
                    }
                  >
                    <ListChecks className="h-5 w-5" />
                    <span>Dashboard</span>
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
              
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <NavLink
                    to="/employees"
                    className={({ isActive }) =>
                      `flex items-center gap-3 ${isActive ? 'text-merck-purple font-semibold' : ''}`
                    }
                  >
                    <Users className="h-5 w-5" />
                    <span>Employees</span>
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
              
              {currentRole === "HR Admin" && (
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to="/templates"
                      className={({ isActive }) =>
                        `flex items-center gap-3 ${isActive ? 'text-merck-purple font-semibold' : ''}`
                      }
                    >
                      <Settings className="h-5 w-5" />
                      <span>Templates</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        
        <SidebarGroup>
          <SidebarGroupLabel>View As</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <button 
                    onClick={() => setCurrentRole('Manager')}
                    className={`flex items-center gap-3 w-full text-left ${
                      currentRole === 'Manager' ? 'text-merck-purple font-semibold' : ''
                    }`}
                  >
                    <UserCheck className="h-5 w-5" />
                    <span>Manager</span>
                  </button>
                </SidebarMenuButton>
              </SidebarMenuItem>
              
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <button 
                    onClick={() => setCurrentRole('HR Admin')}
                    className={`flex items-center gap-3 w-full text-left ${
                      currentRole === 'HR Admin' ? 'text-merck-purple font-semibold' : ''
                    }`}
                  >
                    <Users className="h-5 w-5" />
                    <span>HR Admin</span>
                  </button>
                </SidebarMenuButton>
              </SidebarMenuItem>
              
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <button 
                    onClick={() => setCurrentRole('Buddy')}
                    className={`flex items-center gap-3 w-full text-left ${
                      currentRole === 'Buddy' ? 'text-merck-purple font-semibold' : ''
                    }`}
                  >
                    <UserCheck className="h-5 w-5" />
                    <span>Buddy</span>
                  </button>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      
      <SidebarFooter className="px-3 py-2">
        <div className="text-xs text-muted-foreground">
          Merck Manager Onboarding v1.0
        </div>
      </SidebarFooter>
    </Sidebar>
  );
};

export default AppSidebar;
