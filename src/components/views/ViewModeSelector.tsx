
import React from 'react';
import { Button } from '@/components/ui/button';
import { List, Calendar, Timeline, BarChart3 } from 'lucide-react';
import { ViewMode } from '@/types/checklist';
import { cn } from '@/lib/utils';

interface ViewModeSelectorProps {
  currentView: ViewMode;
  onViewChange: (view: ViewMode) => void;
}

const ViewModeSelector: React.FC<ViewModeSelectorProps> = ({
  currentView,
  onViewChange
}) => {
  const viewOptions = [
    {
      mode: 'checklist' as ViewMode,
      label: 'Checklist',
      icon: List,
      description: 'Traditional task list view'
    },
    {
      mode: 'calendar' as ViewMode,
      label: 'Calendar',
      icon: Calendar,
      description: 'Calendar-based task view'
    },
    {
      mode: 'timeline' as ViewMode,
      label: 'Timeline',
      icon: Timeline,
      description: 'Gantt chart timeline view'
    },
    {
      mode: 'gantt' as ViewMode,
      label: 'Dashboard',
      icon: BarChart3,
      description: 'Progress analytics view'
    }
  ];

  return (
    <div className="flex items-center gap-1 p-1 bg-muted rounded-lg">
      {viewOptions.map(({ mode, label, icon: Icon, description }) => (
        <Button
          key={mode}
          variant={currentView === mode ? "default" : "ghost"}
          size="sm"
          onClick={() => onViewChange(mode)}
          className={cn(
            "flex items-center gap-2 transition-all",
            currentView === mode && "shadow-sm"
          )}
          title={description}
        >
          <Icon className="h-4 w-4" />
          <span className="hidden sm:inline">{label}</span>
        </Button>
      ))}
    </div>
  );
};

export default ViewModeSelector;
