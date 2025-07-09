
import React from 'react';
import { useChecklist } from '@/context/ChecklistContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  CheckSquare, 
  Users, 
  Clock, 
  AlertTriangle,
  TrendingUp,
  Calendar
} from 'lucide-react';
import { ProgressDashboard } from '@/components/progress/ProgressDashboard';
import { NotificationCenter } from '@/components/notifications/NotificationCenter';
import { OverdueAlerts } from '@/components/alerts/OverdueAlerts';

const Dashboard: React.FC = () => {
  const { currentRole, checklist, notifications } = useChecklist();

  const completedTasks = checklist.filter(task => task.completed).length;
  const totalTasks = checklist.length;
  const overdueTasks = checklist.filter(task => {
    if (!task.actualDueDate || task.completed) return false;
    return new Date(task.actualDueDate) < new Date();
  }).length;

  const unreadNotifications = notifications.filter(n => !n.read).length;

  const getRoleSpecificContent = () => {
    switch (currentRole) {
      case 'Manager':
        return {
          title: 'Manager Dashboard',
          description: 'Monitor team onboarding progress and performance',
          primaryAction: 'View Team Progress',
          primaryRoute: '/employees'
        };
      case 'Buddy':
        return {
          title: 'Buddy Dashboard',
          description: 'Support and guide your assigned new team members',
          primaryAction: 'View My Buddies',
          primaryRoute: '/employees'
        };
      case 'HR Admin':
        return {
          title: 'HR Admin Dashboard',
          description: 'Manage onboarding processes and compliance tracking',
          primaryAction: 'Manage Employees',
          primaryRoute: '/employees'
        };
      default:
        return {
          title: 'Dashboard',
          description: 'Welcome to your onboarding dashboard',
          primaryAction: 'Get Started',
          primaryRoute: '/employees'
        };
    }
  };

  const roleContent = getRoleSpecificContent();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-merck-primary-dark font-intervention">
            {roleContent.title}
          </h1>
          <p className="text-gray-600 mt-1">
            {roleContent.description}
          </p>
        </div>
        <Badge variant="outline" className="text-merck-primary border-merck-primary">
          {currentRole}
        </Badge>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Tasks</CardTitle>
            <CheckSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalTasks}</div>
            <p className="text-xs text-muted-foreground">
              {completedTasks} completed
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0}%
            </div>
            <p className="text-xs text-muted-foreground">
              {completedTasks}/{totalTasks} tasks
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overdue Tasks</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{overdueTasks}</div>
            <p className="text-xs text-muted-foreground">
              Need attention
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Notifications</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{unreadNotifications}</div>
            <p className="text-xs text-muted-foreground">
              Unread updates
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="flex gap-4">
        <Button 
          className="bg-merck-primary hover:bg-merck-primary-dark"
          onClick={() => window.location.href = roleContent.primaryRoute}
        >
          {roleContent.primaryAction}
        </Button>
        <Button 
          variant="outline"
          onClick={() => window.location.href = '/templates'}
        >
          <Calendar className="h-4 w-4 mr-2" />
          View Resources
        </Button>
      </div>

      {/* Alerts */}
      {overdueTasks > 0 && (
        <OverdueAlerts />
      )}

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ProgressDashboard />
        </div>
        <div>
          <NotificationCenter />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
