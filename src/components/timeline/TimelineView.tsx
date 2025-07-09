
import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Calendar, Clock, Users, Target } from 'lucide-react';
import { format, parseISO, differenceInDays, startOfWeek, endOfWeek, eachWeekOfInterval } from 'date-fns';
import { ChecklistItem, Milestone, Phase } from '@/types/checklist';
import { cn } from '@/lib/utils';

interface TimelineViewProps {
  tasks: ChecklistItem[];
  milestones: Milestone[];
  startDate: string;
  endDate: string;
  onTaskClick?: (taskId: string) => void;
}

const TimelineView: React.FC<TimelineViewProps> = ({
  tasks,
  milestones,
  startDate,
  endDate,
  onTaskClick
}) => {
  // Calculate timeline data
  const timelineData = useMemo(() => {
    const start = parseISO(startDate);
    const end = parseISO(endDate);
    const totalDays = differenceInDays(end, start);
    const weeks = eachWeekOfInterval({ start, end });

    // Group tasks by phase
    const phaseGroups: Record<Phase, ChecklistItem[]> = {
      'Pre-Planning': [],
      'Orientation': [],
      'General Onboarding': [],
      'Employee Assimilation': []
    };

    tasks.forEach(task => {
      phaseGroups[task.phase].push(task);
    });

    return {
      start,
      end,
      totalDays,
      weeks,
      phaseGroups
    };
  }, [tasks, startDate, endDate]);

  // Calculate task position and width on timeline
  const getTaskPosition = (task: ChecklistItem) => {
    if (!task.actualDueDate) return { left: 0, width: 0 };

    const taskDate = parseISO(task.actualDueDate);
    const daysFromStart = differenceInDays(taskDate, timelineData.start);
    const left = Math.max(0, (daysFromStart / timelineData.totalDays) * 100);
    const width = Math.max(2, (task.estimatedHours || 8) / 8 * 2); // Minimum 2% width

    return { left: `${left}%`, width: `${width}%` };
  };

  // Get milestone position
  const getMilestonePosition = (milestone: Milestone) => {
    const milestoneDate = parseISO(milestone.targetDate);
    const daysFromStart = differenceInDays(milestoneDate, timelineData.start);
    const left = (daysFromStart / timelineData.totalDays) * 100;
    return `${left}%`;
  };

  const getPriorityColor = (priority?: string) => {
    switch (priority) {
      case 'Critical':
        return 'bg-red-500';
      case 'High':
        return 'bg-orange-500';
      case 'Medium':
        return 'bg-yellow-500';
      case 'Low':
        return 'bg-green-500';
      default:
        return 'bg-gray-400';
    }
  };

  const getPhaseColor = (phase: Phase) => {
    switch (phase) {
      case 'Pre-Planning':
        return 'bg-blue-100 border-blue-300';
      case 'Orientation':
        return 'bg-green-100 border-green-300';
      case 'General Onboarding':
        return 'bg-yellow-100 border-yellow-300';
      case 'Employee Assimilation':
        return 'bg-purple-100 border-purple-300';
      default:
        return 'bg-gray-100 border-gray-300';
    }
  };

  return (
    <div className="space-y-6">
      {/* Timeline Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Onboarding Timeline
          </CardTitle>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              {format(timelineData.start, 'MMM d')} - {format(timelineData.end, 'MMM d, yyyy')}
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              {timelineData.totalDays} days
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Timeline Chart */}
      <Card>
        <CardContent className="p-6">
          {/* Time scale */}
          <div className="mb-6">
            <div className="flex justify-between text-xs text-muted-foreground mb-2">
              {timelineData.weeks.map((week, index) => (
                <div key={index} className="text-center">
                  {format(week, 'MMM d')}
                </div>
              ))}
            </div>
            <div className="h-px bg-border"></div>
          </div>

          {/* Phases and Tasks */}
          <div className="space-y-6">
            {Object.entries(timelineData.phaseGroups).map(([phase, phaseTasks]) => (
              <div key={phase} className="space-y-2">
                <div className="flex items-center gap-2 mb-3">
                  <h3 className="font-medium text-sm">{phase}</h3>
                  <Badge variant="outline" className="text-xs">
                    {phaseTasks.length} tasks
                  </Badge>
                  <Progress 
                    value={(phaseTasks.filter(t => t.completed).length / phaseTasks.length) * 100} 
                    className="flex-1 h-2"
                  />
                </div>

                <div className={cn("relative p-4 rounded-lg border-2", getPhaseColor(phase as Phase))}>
                  <div className="relative h-8">
                    {phaseTasks.map(task => {
                      const position = getTaskPosition(task);
                      return (
                        <div
                          key={task.id}
                          className={cn(
                            "absolute h-6 rounded cursor-pointer hover:opacity-80 transition-opacity",
                            getPriorityColor(task.priority),
                            task.completed && "opacity-50"
                          )}
                          style={{
                            left: position.left,
                            width: position.width
                          }}
                          onClick={() => onTaskClick?.(task.id)}
                          title={`${task.title} - ${task.actualDueDate ? format(parseISO(task.actualDueDate), 'MMM d') : 'No date'}`}
                        >
                          <div className="h-full w-full flex items-center justify-center text-white text-xs font-medium truncate px-1">
                            {task.title.substring(0, 20)}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Milestones */}
          {milestones.length > 0 && (
            <div className="mt-8">
              <h3 className="font-medium text-sm mb-3 flex items-center gap-2">
                <Target className="h-4 w-4" />
                Milestones
              </h3>
              <div className="relative h-12 bg-muted/30 rounded-lg">
                {milestones.map(milestone => {
                  const position = getMilestonePosition(milestone);
                  return (
                    <div
                      key={milestone.id}
                      className="absolute top-0 h-full flex items-center justify-center"
                      style={{ left: position }}
                    >
                      <div
                        className={cn(
                          "w-3 h-3 rounded-full border-2 border-white shadow-lg",
                          milestone.completed ? "bg-green-500" : milestone.color || "bg-blue-500"
                        )}
                        title={`${milestone.title} - ${format(parseISO(milestone.targetDate), 'MMM d')}`}
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Legend */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Legend</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="font-medium text-sm">Priority Levels</h4>
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-xs">
                  <div className="w-3 h-3 bg-red-500 rounded"></div>
                  <span>Critical</span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <div className="w-3 h-3 bg-orange-500 rounded"></div>
                  <span>High</span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <div className="w-3 h-3 bg-yellow-500 rounded"></div>
                  <span>Medium</span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <div className="w-3 h-3 bg-green-500 rounded"></div>
                  <span>Low</span>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium text-sm">Phases</h4>
              <div className="space-y-1">
                {Object.keys(timelineData.phaseGroups).map(phase => (
                  <div key={phase} className="flex items-center gap-2 text-xs">
                    <div className={cn("w-3 h-3 rounded border", getPhaseColor(phase as Phase))}></div>
                    <span>{phase}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TimelineView;
