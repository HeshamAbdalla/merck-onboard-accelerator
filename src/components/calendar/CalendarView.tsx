
import React, { useState, useMemo } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock, AlertTriangle } from 'lucide-react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, parseISO } from 'date-fns';
import { ChecklistItem, CalendarEvent, Milestone } from '@/types/checklist';
import { cn } from '@/lib/utils';

interface CalendarViewProps {
  tasks: ChecklistItem[];
  milestones: Milestone[];
  onTaskClick?: (taskId: string) => void;
  onDateSelect?: (date: Date) => void;
}

const CalendarView: React.FC<CalendarViewProps> = ({
  tasks,
  milestones,
  onTaskClick,
  onDateSelect
}) => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());

  // Convert tasks and milestones to calendar events
  const calendarEvents = useMemo(() => {
    const events: CalendarEvent[] = [];

    // Add task events
    tasks.forEach(task => {
      if (task.actualDueDate) {
        events.push({
          id: `task-${task.id}`,
          title: task.title,
          date: task.actualDueDate,
          type: 'task',
          priority: task.priority,
          completed: task.completed,
          taskId: task.id
        });
      }
    });

    // Add milestone events
    milestones.forEach(milestone => {
      events.push({
        id: `milestone-${milestone.id}`,
        title: milestone.title,
        date: milestone.targetDate,
        type: 'milestone',
        completed: milestone.completed,
        milestoneId: milestone.id
      });
    });

    return events;
  }, [tasks, milestones]);

  // Get events for a specific date
  const getEventsForDate = (date: Date) => {
    return calendarEvents.filter(event => 
      isSameDay(parseISO(event.date), date)
    );
  };

  // Get events for selected date
  const selectedDateEvents = getEventsForDate(selectedDate);

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      setSelectedDate(date);
      onDateSelect?.(date);
    }
  };

  const getPriorityColor = (priority?: string) => {
    switch (priority) {
      case 'Critical':
        return 'destructive';
      case 'High':
        return 'secondary';
      case 'Medium':
        return 'outline';
      case 'Low':
        return 'outline';
      default:
        return 'outline';
    }
  };

  const getEventTypeIcon = (type: string) => {
    switch (type) {
      case 'task':
        return <Clock className="h-3 w-3" />;
      case 'milestone':
        return <AlertTriangle className="h-3 w-3" />;
      default:
        return <CalendarIcon className="h-3 w-3" />;
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Calendar */}
      <div className="lg:col-span-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CalendarIcon className="h-5 w-5" />
              Onboarding Calendar
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={handleDateSelect}
              month={currentMonth}
              onMonthChange={setCurrentMonth}
              className="rounded-md border pointer-events-auto"
              modifiers={{
                hasEvents: (date) => getEventsForDate(date).length > 0,
                hasOverdue: (date) => getEventsForDate(date).some(event => 
                  !event.completed && new Date(event.date) < new Date()
                ),
                hasMilestone: (date) => getEventsForDate(date).some(event => 
                  event.type === 'milestone'
                )
              }}
              modifiersStyles={{
                hasEvents: { 
                  backgroundColor: 'hsl(var(--primary) / 0.1)',
                  fontWeight: 'bold'
                },
                hasOverdue: { 
                  backgroundColor: 'hsl(var(--destructive) / 0.1)',
                  color: 'hsl(var(--destructive))'
                },
                hasMilestone: { 
                  backgroundColor: 'hsl(var(--secondary) / 0.2)',
                  border: '2px solid hsl(var(--secondary))'
                }
              }}
            />
          </CardContent>
        </Card>
      </div>

      {/* Selected Date Events */}
      <div>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">
              {format(selectedDate, 'MMMM d, yyyy')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {selectedDateEvents.length === 0 ? (
              <p className="text-muted-foreground text-sm">No events on this date</p>
            ) : (
              <div className="space-y-3">
                {selectedDateEvents.map(event => (
                  <div
                    key={event.id}
                    className={cn(
                      "p-3 rounded-lg border cursor-pointer hover:bg-muted/50 transition-colors",
                      event.completed && "opacity-60"
                    )}
                    onClick={() => event.taskId && onTaskClick?.(event.taskId)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-2">
                        {getEventTypeIcon(event.type)}
                        <div className="flex-1">
                          <h4 className="font-medium text-sm">{event.title}</h4>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge 
                              variant={event.type === 'milestone' ? 'secondary' : 'outline'}
                              className="text-xs"
                            >
                              {event.type}
                            </Badge>
                            {event.priority && (
                              <Badge 
                                variant={getPriorityColor(event.priority)}
                                className="text-xs"
                              >
                                {event.priority}
                              </Badge>
                            )}
                            {event.completed && (
                              <Badge variant="outline" className="text-xs text-green-600">
                                Completed
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Calendar Legend */}
        <Card className="mt-4">
          <CardHeader>
            <CardTitle className="text-base">Legend</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <div className="w-4 h-4 rounded bg-primary/10 border border-primary/20"></div>
              <span>Has Events</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <div className="w-4 h-4 rounded bg-destructive/10 border border-destructive"></div>
              <span>Overdue Tasks</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <div className="w-4 h-4 rounded bg-secondary/20 border-2 border-secondary"></div>
              <span>Milestones</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CalendarView;
