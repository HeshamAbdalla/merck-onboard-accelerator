import React from 'react';
import { AlertTriangle, Clock, Calendar } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChecklistItem } from '@/types/checklist';
import { formatDistanceToNow, isAfter, parseISO, startOfDay } from 'date-fns';

interface OverdueAlertsProps {
  tasks: ChecklistItem[];
  employeeName?: string;
  onTaskClick?: (taskId: string) => void;
}

const OverdueAlerts: React.FC<OverdueAlertsProps> = ({ 
  tasks, 
  employeeName,
  onTaskClick 
}) => {
  // Calculate overdue and pending tasks
  const today = startOfDay(new Date());
  
  const overdueTasks = tasks.filter(task => {
    if (task.completed || !task.actualDueDate) return false;
    return isAfter(today, parseISO(task.actualDueDate));
  });

  const pendingTasks = tasks.filter(task => {
    if (task.completed || !task.actualDueDate) return false;
    const dueDate = parseISO(task.actualDueDate);
    const daysDiff = Math.ceil((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return daysDiff <= 3 && daysDiff >= 0; // Due within 3 days
  });

  if (overdueTasks.length === 0 && pendingTasks.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4 mb-6">
      {overdueTasks.length > 0 && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>
            Overdue Tasks {employeeName && `for ${employeeName}`}
          </AlertTitle>
          <AlertDescription>
            <div className="mt-2 space-y-2">
              <p>
                {overdueTasks.length} task{overdueTasks.length > 1 ? 's are' : ' is'} overdue and require immediate attention.
              </p>
              <div className="space-y-1">
                {overdueTasks.slice(0, 3).map(task => (
                  <div 
                    key={task.id} 
                    className="flex items-center justify-between p-2 bg-destructive/10 rounded border"
                  >
                    <div className="flex-1">
                      <p className="font-medium text-sm">{task.title}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className="text-xs">
                          {task.phase}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          Due: {task.actualDueDate && formatDistanceToNow(parseISO(task.actualDueDate), { addSuffix: true })}
                        </span>
                      </div>
                    </div>
                    {onTaskClick && (
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => onTaskClick(task.id)}
                      >
                        View
                      </Button>
                    )}
                  </div>
                ))}
                {overdueTasks.length > 3 && (
                  <p className="text-sm text-muted-foreground">
                    And {overdueTasks.length - 3} more overdue task{overdueTasks.length - 3 > 1 ? 's' : ''}...
                  </p>
                )}
              </div>
            </div>
          </AlertDescription>
        </Alert>
      )}

      {pendingTasks.length > 0 && (
        <Alert>
          <Clock className="h-4 w-4" />
          <AlertTitle>
            Upcoming Deadlines {employeeName && `for ${employeeName}`}
          </AlertTitle>
          <AlertDescription>
            <div className="mt-2 space-y-2">
              <p>
                {pendingTasks.length} task{pendingTasks.length > 1 ? 's are' : ' is'} due within the next 3 days.
              </p>
              <div className="space-y-1">
                {pendingTasks.slice(0, 3).map(task => (
                  <div 
                    key={task.id} 
                    className="flex items-center justify-between p-2 bg-muted/50 rounded border"
                  >
                    <div className="flex-1">
                      <p className="font-medium text-sm">{task.title}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className="text-xs">
                          {task.phase}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          Due: {task.actualDueDate && formatDistanceToNow(parseISO(task.actualDueDate), { addSuffix: true })}
                        </span>
                      </div>
                    </div>
                    {onTaskClick && (
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => onTaskClick(task.id)}
                      >
                        View
                      </Button>
                    )}
                  </div>
                ))}
                {pendingTasks.length > 3 && (
                  <p className="text-sm text-muted-foreground">
                    And {pendingTasks.length - 3} more pending task{pendingTasks.length - 3 > 1 ? 's' : ''}...
                  </p>
                )}
              </div>
            </div>
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default OverdueAlerts;