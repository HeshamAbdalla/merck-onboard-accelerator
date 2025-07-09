
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, Clock, CheckCircle, AlertTriangle, Calendar } from 'lucide-react';
import { format, differenceInDays, addDays } from 'date-fns';
import { ChecklistItem, Milestone, ProgressMetrics, Phase } from '@/types/checklist';
import { cn } from '@/lib/utils';

interface ProgressDashboardProps {
  tasks: ChecklistItem[];
  milestones: Milestone[];
  startDate: string;
}

const ProgressDashboard: React.FC<ProgressDashboardProps> = ({
  tasks,
  milestones,
  startDate
}) => {
  // Calculate comprehensive progress metrics
  const metrics: ProgressMetrics = React.useMemo(() => {
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(task => task.completed).length;
    const overdueTasks = tasks.filter(task => 
      !task.completed && task.actualDueDate && new Date(task.actualDueDate) < new Date()
    ).length;
    const upcomingTasks = tasks.filter(task => 
      !task.completed && task.actualDueDate && 
      differenceInDays(new Date(task.actualDueDate), new Date()) <= 7
    ).length;
    
    const completionPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
    
    // Calculate phase progress
    const phaseProgress: Record<Phase, number> = {
      'Pre-Planning': 0,
      'Orientation': 0,
      'General Onboarding': 0,
      'Employee Assimilation': 0
    };
    
    Object.keys(phaseProgress).forEach(phase => {
      const phaseTasks = tasks.filter(task => task.phase === phase);
      const completedPhaseTasks = phaseTasks.filter(task => task.completed);
      phaseProgress[phase as Phase] = phaseTasks.length > 0 
        ? Math.round((completedPhaseTasks.length / phaseTasks.length) * 100) 
        : 0;
    });
    
    // Calculate milestone progress
    const milestoneProgress: Record<string, boolean> = {};
    milestones.forEach(milestone => {
      milestoneProgress[milestone.id] = milestone.completed;
    });
    
    // Estimate completion date based on current progress
    const remainingTasks = totalTasks - completedTasks;
    const averageTasksPerWeek = completedTasks > 0 ? completedTasks / (differenceInDays(new Date(), new Date(startDate)) / 7) : 1;
    const estimatedWeeksRemaining = remainingTasks > 0 ? Math.ceil(remainingTasks / averageTasksPerWeek) : 0;
    const estimatedCompletionDate = addDays(new Date(), estimatedWeeksRemaining * 7).toISOString();
    
    return {
      totalTasks,
      completedTasks,
      overdueTasks,
      upcomingTasks,
      completionPercentage,
      estimatedCompletionDate,
      timeToCompletion: estimatedWeeksRemaining,
      phaseProgress,
      milestoneProgress
    };
  }, [tasks, milestones, startDate]);

  const getPhaseColor = (phase: Phase) => {
    switch (phase) {
      case 'Pre-Planning':
        return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'Orientation':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'General Onboarding':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'Employee Assimilation':
        return 'text-purple-600 bg-purple-50 border-purple-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const completedMilestones = milestones.filter(m => m.completed).length;
  const totalMilestones = milestones.length;

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overall Progress</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.completionPercentage}%</div>
            <p className="text-xs text-muted-foreground">
              {metrics.completedTasks} of {metrics.totalTasks} tasks completed
            </p>
            <Progress value={metrics.completionPercentage} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overdue Tasks</CardTitle>
            <AlertTriangle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{metrics.overdueTasks}</div>
            <p className="text-xs text-muted-foreground">
              Need immediate attention
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Upcoming Tasks</CardTitle>
            <Clock className="h-4 w-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{metrics.upcomingTasks}</div>
            <p className="text-xs text-muted-foreground">
              Due within 7 days
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Estimated Completion</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {metrics.timeToCompletion}w
            </div>
            <p className="text-xs text-muted-foreground">
              {format(new Date(metrics.estimatedCompletionDate), 'MMM d, yyyy')}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Phase Progress */}
      <Card>
        <CardHeader>
          <CardTitle>Phase Progress</CardTitle>
          <CardDescription>
            Track completion progress across all onboarding phases
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Object.entries(metrics.phaseProgress).map(([phase, progress]) => (
              <div key={phase} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge 
                      variant="outline" 
                      className={cn("text-xs", getPhaseColor(phase as Phase))}
                    >
                      {phase}
                    </Badge>
                    <span className="text-sm font-medium">{progress}%</span>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {tasks.filter(t => t.phase === phase && t.completed).length} / {tasks.filter(t => t.phase === phase).length} tasks
                  </span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Milestone Progress */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Milestone Progress
            </CardTitle>
            <CardDescription>
              Key achievements and their completion status
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Overall Milestone Progress</span>
                <span className="text-sm text-muted-foreground">
                  {completedMilestones} / {totalMilestones}
                </span>
              </div>
              <Progress 
                value={totalMilestones > 0 ? (completedMilestones / totalMilestones) * 100 : 0} 
                className="h-3"
              />
              
              <div className="space-y-2 mt-4">
                {milestones.slice(0, 5).map(milestone => (
                  <div key={milestone.id} className="flex items-center justify-between p-2 rounded-lg border">
                    <div className="flex items-center gap-2">
                      <div 
                        className={cn(
                          "w-3 h-3 rounded-full",
                          milestone.completed ? "bg-green-500" : "bg-gray-300"
                        )}
                      />
                      <span className="text-sm">{milestone.title}</span>
                    </div>
                    <Badge 
                      variant={milestone.completed ? "default" : "secondary"}
                      className="text-xs"
                    >
                      {milestone.completed ? "Complete" : "Pending"}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Recent Activity
            </CardTitle>
            <CardDescription>
              Latest completed tasks and achievements
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {tasks
                .filter(task => task.completed && task.completedDate)
                .sort((a, b) => new Date(b.completedDate!).getTime() - new Date(a.completedDate!).getTime())
                .slice(0, 5)
                .map(task => (
                  <div key={task.id} className="flex items-center gap-3 p-2 rounded-lg border">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">{task.title}</p>
                      <p className="text-xs text-muted-foreground">
                        Completed {task.completedDate ? format(new Date(task.completedDate), 'MMM d') : 'recently'}
                      </p>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {task.phase}
                    </Badge>
                  </div>
                ))}
              
              {tasks.filter(task => task.completed).length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No completed tasks yet
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProgressDashboard;
