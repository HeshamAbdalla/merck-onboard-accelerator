
import React from 'react';
import { NavLink } from 'react-router-dom';
import { useChecklist } from '@/context/ChecklistContext';
import { Sidebar, SidebarContent, SidebarMenu, SidebarMenuItem, SidebarMenuButton } from '@/components/ui/sidebar';
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
    <Sidebar className="bg-white border-r border-gray-100 shadow-sm">
      <SidebarContent>
        <div className="px-3 pt-4 pb-6">
          <div className="flex items-center mb-6">
            <div className="w-10 h-10 bg-merck-purple rounded-sm flex items-center justify-center mr-2">
              <span className="text-white font-bold text-lg">M</span>
            </div>
            <h2 className="text-xl font-bold text-merck-purple-dark font-intervention">Merck Onboarding</h2>
          </div>
          
          <div className="mb-6">
            <Select
              value={currentRole}
              onValueChange={(value: UserRole) => setCurrentRole(value)}
            >
              <SelectTrigger className="w-full border-merck-purple/30 focus:ring-merck-purple/50 rounded-sm">
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Manager">Manager</SelectItem>
                <SelectItem value="HR Admin">HR Admin</SelectItem>
                <SelectItem value="Buddy">Buddy</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <h3 className="text-xs uppercase text-gray-500 font-medium mb-3 tracking-wider font-intervention">Main Navigation</h3>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <NavLink to="/" className={({ isActive }) => 
                  `flex items-center gap-3 rounded-sm px-3 py-2 text-sm font-medium ${
                    isActive ? 'bg-merck-purple text-white' : 'hover:bg-merck-purple/5 text-merck-purple-dark'
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
                  `flex items-center gap-3 rounded-sm px-3 py-2 text-sm font-medium ${
                    isActive ? 'bg-merck-purple text-white' : 'hover:bg-merck-purple/5 text-merck-purple-dark'
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
                  `flex items-center gap-3 rounded-sm px-3 py-2 text-sm font-medium ${
                    isActive ? 'bg-merck-purple text-white' : 'hover:bg-merck-purple/5 text-merck-purple-dark'
                  }`
                }>
                  <FileText className="h-4 w-4" />
                  <span>Templates</span>
                </NavLink>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
          
          {/* Merck.com-inspired footer */}
          <div className="absolute bottom-4 left-0 right-0 px-3">
            <div className="border-t border-gray-100 pt-4 mt-2">
              <div className="flex items-center text-xs text-gray-500">
                <div className="mr-3">© {new Date().getFullYear()} Merck</div>
                <div>All rights reserved</div>
              </div>
            </div>
          </div>
        </div>
      </SidebarContent>
    </Sidebar>
  );
};

export default AppSidebar;
