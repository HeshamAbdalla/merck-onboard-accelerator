
import React from 'react';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import ChecklistFilter from '@/components/checklist/ChecklistFilter';
import ChecklistSection from '@/components/checklist/ChecklistSection';
import { useChecklist } from '@/context/ChecklistContext';
import { Phase } from '@/types/checklist';

const Dashboard: React.FC = () => {
  const { 
    checklist, 
    filteredPhases, 
    filteredOwners,
    searchQuery
  } = useChecklist();

  // Filter the checklist based on selected filters
  const filteredChecklist = checklist.filter(item => {
    // Apply phase filter if any selected
    const phaseMatch = filteredPhases.length === 0 || filteredPhases.includes(item.phase);
    
    // Apply owner filter if any selected
    const ownerMatch = filteredOwners.length === 0 || filteredOwners.includes(item.owner);
    
    // Apply search filter
    const searchMatch = !searchQuery || 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      item.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    return phaseMatch && ownerMatch && searchMatch;
  });

  // Group checklist items by phase
  const phases: Phase[] = ['Pre-Planning', 'Orientation', 'General Onboarding', 'Employee Assimilation'];
  
  const itemsByPhase = phases.map(phase => ({
    phase,
    items: filteredChecklist.filter(item => item.phase === phase)
  }));
  
  // Calculate overall progress
  const totalItems = filteredChecklist.length;
  const completedItems = filteredChecklist.filter(item => item.completed).length;
  const overallProgress = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8 bg-white p-6 rounded-md border border-gray-100 shadow-sm">
        <DashboardHeader />
        
        {/* Overall progress bar */}
        <div className="mt-6 mb-2">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-sm font-medium text-gray-700">Overall Progress</h3>
            <span className="text-sm font-medium text-merck-primary">{overallProgress}%</span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-2">
            <div 
              className="bg-merck-primary h-2 rounded-full transition-all duration-500 ease-in-out" 
              style={{ width: `${overallProgress}%` }}
            ></div>
          </div>
        </div>
      </div>
      
      <div className="bg-white p-6 rounded-md border border-gray-100 shadow-sm mb-8">
        <ChecklistFilter />
      </div>
      
      {filteredChecklist.length === 0 ? (
        <div className="text-center py-10 bg-white p-6 rounded-md border border-gray-100 shadow-sm">
          <h3 className="text-xl font-semibold mb-2 text-gray-800">No tasks match your filters</h3>
          <p className="text-gray-500">Try adjusting your filters or search term</p>
        </div>
      ) : (
        <div className="space-y-8">
          {itemsByPhase.map(({ phase, items }) => (
            items.length > 0 && (
              <div key={phase} className="bg-white p-6 rounded-md border border-gray-100 shadow-sm">
                <ChecklistSection key={phase} phase={phase} items={items} />
              </div>
            )
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
