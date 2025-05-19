
import React from 'react';
import { NavLink } from 'react-router-dom';
import { useChecklist } from '@/context/ChecklistContext';
import { Sidebar, SidebarContent, SidebarMenu, SidebarMenuItem, SidebarMenuButton } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { 
  CheckSquare, 
  Users, 
  FileText,
  Settings
} from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { UserRole } from '@/types/checklist';

const AppSidebar = () => {
  const { currentRole, setCurrentRole } = useChecklist();

  return (
    <Sidebar>
      <SidebarContent>
        <div className="px-3 pt-4 pb-6">
          <h2 className="text-xl font-bold text-merck-purple mb-2">Merck Onboarding</h2>
          <div className="mb-4">
            <Select
              value={currentRole}
              onValueChange={(value: UserRole) => setCurrentRole(value)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Manager">Manager</SelectItem>
                <SelectItem value="HR Admin">HR Admin</SelectItem>
                <SelectItem value="Buddy">Buddy</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <h3 className="text-xs uppercase text-gray-500 font-medium mb-2">Main Navigation</h3>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <NavLink to="/" className={({ isActive }) => 
                  `flex items-center gap-3 rounded-md px-3 py-2 text-sm ${
                    isActive ? 'bg-merck-purple text-white' : 'hover:bg-gray-100'
                  }`
                }>
                  <CheckSquare className="h-4 w-4" />
                  <span>Dashboard</span>
                </NavLink>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <NavLink to="/employees" className={({ isActive }) => 
                  `flex items-center gap-3 rounded-md px-3 py-2 text-sm ${
                    isActive ? 'bg-merck-purple text-white' : 'hover:bg-gray-100'
                  }`
                }>
                  <Users className="h-4 w-4" />
                  <span>Employees</span>
                </NavLink>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <NavLink to="/templates" className={({ isActive }) => 
                  `flex items-center gap-3 rounded-md px-3 py-2 text-sm ${
                    isActive ? 'bg-merck-purple text-white' : 'hover:bg-gray-100'
                  }`
                }>
                  <FileText className="h-4 w-4" />
                  <span>Templates</span>
                </NavLink>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </div>
      </SidebarContent>
    </Sidebar>
  );
};

export default AppSidebar;
