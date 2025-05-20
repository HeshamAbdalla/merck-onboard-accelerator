
import React from 'react';
import { Badge } from '@/components/ui/badge';
import ChecklistCard from './ChecklistCard';
import { ChecklistItem, Phase } from '@/types/checklist';
import { CircleCheck } from 'lucide-react';

interface ChecklistSectionProps {
  phase: Phase;
  items: ChecklistItem[];
}

const ChecklistSection: React.FC<ChecklistSectionProps> = ({ phase, items }) => {
  // Count completed tasks in this phase
  const completedCount = items.filter(item => item.completed).length;
  const totalCount = items.length;
  const progressPercentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
  
  if (items.length === 0) {
    return null;
  }

  return (
    <section className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-semibold text-gray-800">{phase}</h2>
          <Badge variant="outline" className="ml-2 text-sm bg-gray-100">
            {completedCount}/{totalCount} tasks
          </Badge>
        </div>
        {progressPercentage === 100 && (
          <div className="flex items-center gap-1 text-green-600">
            <CircleCheck className="h-5 w-5" />
            <span className="text-sm font-medium">Complete</span>
          </div>
        )}
      </div>

      {/* Progress bar */}
      <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4 dark:bg-gray-700">
        <div 
          className="bg-merck-primary h-2.5 rounded-full transition-all duration-500 ease-in-out" 
          style={{ width: `${progressPercentage}%` }}
        ></div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {items.map(item => (
          <ChecklistCard key={item.id} item={item} />
        ))}
      </div>
    </section>
  );
};

export default ChecklistSection;
