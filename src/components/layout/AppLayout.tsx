
import React from 'react';
import AppSidebar from './AppSidebar';
import { SidebarProvider } from '@/components/ui/sidebar';
import { ChecklistProvider } from '@/context/ChecklistContext';

interface AppLayoutProps {
  children: React.ReactNode;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  return (
    <SidebarProvider>
      <ChecklistProvider>
        <div className="min-h-screen flex w-full">
          <AppSidebar />
          <main className="flex-1 p-6">
            {children}
          </main>
        </div>
      </ChecklistProvider>
    </SidebarProvider>
  );
};

export default AppLayout;
