
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

  return (
    <div>
      <DashboardHeader />
      <ChecklistFilter />
      
      {filteredChecklist.length === 0 ? (
        <div className="text-center py-10">
          <h3 className="text-xl font-semibold mb-2">No tasks match your filters</h3>
          <p className="text-gray-500">Try adjusting your filters or search term</p>
        </div>
      ) : (
        itemsByPhase.map(({ phase, items }) => (
          items.length > 0 && <ChecklistSection key={phase} phase={phase} items={items} />
        ))
      )}
    </div>
  );
};

export default Dashboard;
