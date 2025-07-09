
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Welcome from "./pages/Welcome";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";
import Employees from "./pages/Employees";
import EmployeeChecklist from "./pages/EmployeeChecklist";
import Templates from "./pages/Templates";
import AppLayout from "./components/layout/AppLayout";
import { ChecklistProvider } from "./context/ChecklistContext";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <ChecklistProvider>
          <Routes>
            <Route path="/" element={<Welcome />} />
            <Route path="/dashboard" element={
              <AppLayout>
                <Dashboard />
              </AppLayout>
            } />
            <Route path="/employees" element={
              <AppLayout>
                <Employees />
              </AppLayout>
            } />
            <Route path="/employees/:employeeId/checklist" element={
              <AppLayout>
                <EmployeeChecklist />
              </AppLayout>
            } />
            <Route path="/templates" element={
              <AppLayout>
                <Templates />
              </AppLayout>
            } />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </ChecklistProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
