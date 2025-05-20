
import React from 'react';
import { useChecklist } from '@/context/ChecklistContext';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';

const DashboardHeader: React.FC = () => {
  const { checklist, currentRole } = useChecklist();

  // Calculate overall progress
  const totalTasks = checklist.length;
  const completedTasks = checklist.filter(item => item.completed).length;
  const progressPercentage = Math.round((completedTasks / totalTasks) * 100);

  // Group by owner for stats
  const tasksByOwner = checklist.reduce((acc, item) => {
    acc[item.owner] = (acc[item.owner] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Group by phase for stats
  const tasksByPhase = checklist.reduce((acc, item) => {
    acc[item.phase] = (acc[item.phase] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="mb-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Onboarding Checklist {currentRole === 'HR Admin' ? 'Templates' : 'Dashboard'}
          </h1>
          <p className="text-gray-500">
            {currentRole === 'HR Admin' 
              ? 'Manage and customize onboarding templates and track completion metrics'
              : 'Track and manage onboarding tasks for new employees'}
          </p>
        </div>
        <Badge className="mt-2 md:mt-0 bg-merck-primary text-white py-1 px-3 text-sm">
          {currentRole}
        </Badge>
      </div>

      <div className="bg-white p-4 rounded-lg shadow-sm border mb-6">
        <div className="flex flex-col sm:flex-row justify-between mb-2">
          <h3 className="text-lg font-medium">Overall Progress</h3>
          <p className="text-lg font-bold text-merck-primary">{progressPercentage}% Complete</p>
        </div>
        <Progress value={progressPercentage} className="h-2.5" />
        
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-gray-50 p-3 rounded-md">
            <p className="text-sm text-gray-600">Total Tasks</p>
            <p className="text-2xl font-bold text-gray-800">{totalTasks}</p>
          </div>
          <div className="bg-green-50 p-3 rounded-md">
            <p className="text-sm text-gray-600">Completed</p>
            <p className="text-2xl font-bold text-green-600">{completedTasks}</p>
          </div>
          <div className="bg-amber-50 p-3 rounded-md">
            <p className="text-sm text-gray-600">In Progress</p>
            <p className="text-2xl font-bold text-amber-600">{totalTasks - completedTasks}</p>
          </div>
          <div className="bg-merck-primary bg-opacity-10 p-3 rounded-md">
            <p className="text-sm text-gray-600">Phases</p>
            <p className="text-2xl font-bold text-merck-primary">{Object.keys(tasksByPhase).length}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHeader;
