
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, User, Calendar, UserCheck } from 'lucide-react';
import ChecklistFilter from '@/components/checklist/ChecklistFilter';
import ChecklistSection from '@/components/checklist/ChecklistSection';
import NotificationCenter from '@/components/notifications/NotificationCenter';
import OverdueAlerts from '@/components/alerts/OverdueAlerts';
import WelcomeEmailGenerator from '@/components/email/WelcomeEmailGenerator';
import { useChecklist } from '@/context/ChecklistContext';
import { Phase } from '@/types/checklist';

// Mock employee data (this would normally come from a database)
const employees = [
  {
    id: "1",
    name: "Alex Johnson",
    position: "Software Developer",
    startDate: "2025-06-01",
    status: "In Progress",
    progress: 35,
    manager: "Sarah Miller"
  },
  {
    id: "2",
    name: "Morgan Smith",
    position: "Marketing Specialist",
    startDate: "2025-05-15",
    status: "Not Started",
    progress: 0,
    manager: "Sarah Miller"
  },
  {
    id: "3",
    name: "Jamie Williams",
    position: "Product Manager",
    startDate: "2025-06-15",
    status: "In Progress",
    progress: 72,
    manager: "Robert Chen"
  },
  {
    id: "4",
    name: "Casey Taylor",
    position: "UX Designer",
    startDate: "2025-05-01",
    status: "Completed",
    progress: 100,
    manager: "Sarah Miller"
  },
  {
    id: "5",
    name: "Riley Brown",
    position: "Data Analyst",
    startDate: "2025-07-01",
    status: "Not Started",
    progress: 0,
    manager: "Robert Chen"
  }
];

const EmployeeChecklist: React.FC = () => {
  const { employeeId } = useParams<{ employeeId: string }>();
  const navigate = useNavigate();
  const { 
    checklist, 
    filteredPhases, 
    filteredOwners, 
    searchQuery,
    notifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    clearAllNotifications
  } = useChecklist();

  const employee = employees.find(emp => emp.id === employeeId);

  if (!employee) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Employee Not Found</h1>
        <p className="text-gray-600 mb-6">The employee you're looking for doesn't exist.</p>
        <Button onClick={() => navigate('/employees')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Employees
        </Button>
      </div>
    );
  }

  // Filter checklist items based on current filters
  const filteredChecklist = checklist.filter(item => {
    const matchesSearch = searchQuery === '' || 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesPhase = filteredPhases.length === 0 || filteredPhases.includes(item.phase);
    const matchesOwner = filteredOwners.length === 0 || filteredOwners.includes(item.owner);
    
    return matchesSearch && matchesPhase && matchesOwner;
  });

  // Group filtered items by phase
  const groupedItems = filteredChecklist.reduce((acc, item) => {
    if (!acc[item.phase]) {
      acc[item.phase] = [];
    }
    acc[item.phase].push(item);
    return acc;
  }, {} as Record<Phase, typeof checklist>);

  const phases: Phase[] = ['Pre-Planning', 'Orientation', 'General Onboarding', 'Employee Assimilation'];

  // Calculate progress
  const completedTasks = checklist.filter(item => item.completed).length;
  const totalTasks = checklist.length;
  const progressPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/employees')}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
            <h1 className="text-2xl font-bold text-merck-primary-dark">
              {employee.name}'s Onboarding Checklist
            </h1>
          </div>
          <p className="text-gray-500">Track and manage onboarding progress</p>
        </div>
        <div className="flex items-center gap-2">
          <WelcomeEmailGenerator 
            employeeData={{
              employeeName: employee.name,
              position: employee.position,
              startDate: employee.startDate,
              manager: employee.manager
            }}
          />
          <NotificationCenter
            notifications={notifications}
            onMarkAsRead={markNotificationAsRead}
            onMarkAllAsRead={markAllNotificationsAsRead}
            onClearAll={clearAllNotifications}
          />
        </div>
      </div>

      {/* Employee Info Card */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Employee Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-gray-500" />
              <div>
                <p className="text-sm text-gray-500">Position</p>
                <p className="font-medium">{employee.position}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-gray-500" />
              <div>
                <p className="text-sm text-gray-500">Start Date</p>
                <p className="font-medium">{new Date(employee.startDate).toLocaleDateString()}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <UserCheck className="h-4 w-4 text-gray-500" />
              <div>
                <p className="text-sm text-gray-500">Manager</p>
                <p className="font-medium">{employee.manager}</p>
              </div>
            </div>
            <div>
              <p className="text-sm text-gray-500">Progress</p>
              <div className="flex items-center gap-2">
                <Badge
                  className={`
                    ${employee.status === "Completed" ? "bg-green-100 text-green-800" :
                      employee.status === "In Progress" ? "bg-blue-100 text-blue-800" :
                        "bg-gray-100 text-gray-800"}
                  `}
                >
                  {employee.status}
                </Badge>
                <span className="text-sm font-medium">{progressPercentage}%</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Overdue Alerts */}
      <OverdueAlerts 
        tasks={checklist} 
        employeeName={employee.name}
        onTaskClick={(taskId) => {
          // Scroll to task or highlight it
          const element = document.getElementById(`task-${taskId}`);
          element?.scrollIntoView({ behavior: 'smooth' });
        }}
      />

      {/* Filters */}
      <ChecklistFilter />

      {/* Checklist Sections */}
      <div className="space-y-6">
        {phases.map(phase => (
          <ChecklistSection 
            key={phase} 
            phase={phase} 
            items={groupedItems[phase] || []} 
          />
        ))}
      </div>

      {filteredChecklist.length === 0 && (
        <Card className="text-center py-8">
          <CardContent>
            <p className="text-gray-500">No tasks match your current filters.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default EmployeeChecklist;
