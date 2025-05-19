import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Search, Plus, Filter, X } from 'lucide-react';
import { useChecklist } from '@/context/ChecklistContext';
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from '@/components/ui/popover';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Phase, Owner, Responsibility, DueDate } from '@/types/checklist';

// Extract unique values from the checklist data
const phases: Phase[] = ['Pre-Planning', 'Orientation', 'General Onboarding', 'Employee Assimilation'];
const owners: Owner[] = ['HR', 'Manager', 'IT', 'Buddy', 'Admin'];
const responsibilities: Responsibility[] = ['Local', 'Functional', 'Global'];
const dueDates: DueDate[] = ['Pre-start date', 'First day', 'First week', 'Month 1', 'Month 2', 'Month 3', 'Month 6'];

const ChecklistFilter: React.FC = () => {
  const { 
    filteredPhases, 
    setFilteredPhases, 
    filteredOwners, 
    setFilteredOwners, 
    searchQuery, 
    setSearchQuery, 
    addTask,
    currentRole 
  } = useChecklist();

  const [isAddingTask, setIsAddingTask] = useState(false);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    phase: 'Pre-Planning' as Phase,
    owner: 'Manager' as Owner,
    responsibility: 'Local' as Responsibility,
    suggestedDueDate: 'First week' as DueDate,
    comments: '',
  });

  // Toggle phase filter
  const togglePhaseFilter = (phase: string) => {
    setFilteredPhases(prev => 
      prev.includes(phase) 
        ? prev.filter(p => p !== phase) 
        : [...prev, phase]
    );
  };

  // Toggle owner filter
  const toggleOwnerFilter = (owner: string) => {
    setFilteredOwners(prev => 
      prev.includes(owner) 
        ? prev.filter(o => o !== owner) 
        : [...prev, owner]
    );
  };

  // Reset filters
  const resetFilters = () => {
    setFilteredPhases([]);
    setFilteredOwners([]);
    setSearchQuery('');
  };

  const handleAddTask = () => {
    if (newTask.title.trim() === '') return;

    addTask({
      title: newTask.title,
      description: newTask.description || 'No description provided',
      phase: newTask.phase,
      owner: newTask.owner,
      responsibility: newTask.responsibility,
      suggestedDueDate: newTask.suggestedDueDate,
      comments: newTask.comments
    });

    setNewTask({
      title: '',
      description: '',
      phase: 'Pre-Planning',
      owner: 'Manager',
      responsibility: 'Local',
      suggestedDueDate: 'First week',
      comments: '',
    });

    setIsAddingTask(false);
  };

  return (
    <div className="mb-6 space-y-4">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Search tasks..."
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="flex gap-2">
                <Filter className="h-4 w-4" />
                <span>Filter</span>
                {(filteredPhases.length > 0 || filteredOwners.length > 0) && (
                  <Badge className="bg-merck-purple ml-1 px-1.5 rounded-full">
                    {filteredPhases.length + filteredOwners.length}
                  </Badge>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Phase</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {phases.map(phase => (
                      <div key={phase} className="flex items-center space-x-2">
                        <Checkbox 
                          id={`phase-${phase}`} 
                          checked={filteredPhases.includes(phase)}
                          onCheckedChange={() => togglePhaseFilter(phase)}
                        />
                        <label htmlFor={`phase-${phase}`} className="text-sm cursor-pointer">
                          {phase}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Owner</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {owners.map(owner => (
                      <div key={owner} className="flex items-center space-x-2">
                        <Checkbox 
                          id={`owner-${owner}`} 
                          checked={filteredOwners.includes(owner)}
                          onCheckedChange={() => toggleOwnerFilter(owner)}
                        />
                        <label htmlFor={`owner-${owner}`} className="text-sm cursor-pointer">
                          {owner}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button variant="outline" size="sm" onClick={resetFilters}>
                    Reset Filters
                  </Button>
                </div>
              </div>
            </PopoverContent>
          </Popover>

          {(currentRole === 'HR Admin' || currentRole === 'Manager') && (
            <Button onClick={() => setIsAddingTask(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Task
            </Button>
          )}
        </div>
      </div>

      {/* Active filters display */}
      {(filteredPhases.length > 0 || filteredOwners.length > 0) && (
        <div className="flex flex-wrap gap-2">
          {filteredPhases.map(phase => (
            <Badge 
              key={`badge-phase-${phase}`} 
              variant="secondary"
              className="pl-2"
            >
              {phase}
              <button 
                className="ml-1 text-xs hover:bg-muted p-0.5 rounded"
                onClick={() => togglePhaseFilter(phase)}
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
          {filteredOwners.map(owner => (
            <Badge 
              key={`badge-owner-${owner}`} 
              variant="secondary"
              className="pl-2"
            >
              {owner}
              <button 
                className="ml-1 text-xs hover:bg-muted p-0.5 rounded"
                onClick={() => toggleOwnerFilter(owner)}
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}

      {/* Add Task Dialog */}
      <Dialog open={isAddingTask} onOpenChange={setIsAddingTask}>
        <DialogContent className="sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle>Add New Task</DialogTitle>
            <DialogDescription>
              Create a new onboarding task to add to the checklist.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="task-title">Task Title</Label>
              <Input
                id="task-title"
                placeholder="Enter task title"
                value={newTask.title}
                onChange={(e) => setNewTask({...newTask, title: e.target.value})}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="task-description">Description</Label>
              <Textarea
                id="task-description"
                placeholder="Enter task description"
                value={newTask.description}
                onChange={(e) => setNewTask({...newTask, description: e.target.value})}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="task-phase">Phase</Label>
                <Select 
                  value={newTask.phase}
                  onValueChange={(value) => setNewTask({...newTask, phase: value as Phase})}
                >
                  <SelectTrigger id="task-phase">
                    <SelectValue placeholder="Select phase" />
                  </SelectTrigger>
                  <SelectContent>
                    {phases.map(phase => (
                      <SelectItem key={phase} value={phase}>{phase}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="task-owner">Owner</Label>
                <Select 
                  value={newTask.owner}
                  onValueChange={(value) => setNewTask({...newTask, owner: value as Owner})}
                >
                  <SelectTrigger id="task-owner">
                    <SelectValue placeholder="Select owner" />
                  </SelectTrigger>
                  <SelectContent>
                    {owners.map(owner => (
                      <SelectItem key={owner} value={owner}>{owner}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="task-responsibility">Responsibility</Label>
                <Select 
                  value={newTask.responsibility}
                  onValueChange={(value) => setNewTask({...newTask, responsibility: value as Responsibility})}
                >
                  <SelectTrigger id="task-responsibility">
                    <SelectValue placeholder="Select responsibility" />
                  </SelectTrigger>
                  <SelectContent>
                    {responsibilities.map(responsibility => (
                      <SelectItem key={responsibility} value={responsibility}>{responsibility}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="task-due-date">Due Date</Label>
                <Select 
                  value={newTask.suggestedDueDate}
                  onValueChange={(value) => setNewTask({...newTask, suggestedDueDate: value as DueDate})}
                >
                  <SelectTrigger id="task-due-date">
                    <SelectValue placeholder="Select due date" />
                  </SelectTrigger>
                  <SelectContent>
                    {dueDates.map(dueDate => (
                      <SelectItem key={dueDate} value={dueDate}>{dueDate}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="task-comments">Initial Comments</Label>
              <Textarea
                id="task-comments"
                placeholder="Optional comments"
                value={newTask.comments}
                onChange={(e) => setNewTask({...newTask, comments: e.target.value})}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddingTask(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddTask}>
              Add Task
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ChecklistFilter;
