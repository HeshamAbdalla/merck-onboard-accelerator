
import React, { createContext, useContext, useState } from 'react';
import { ChecklistItem, UserRole } from '../types/checklist';
import { initialChecklistData } from '../data/checklistData';
import { toast } from '@/hooks/use-toast';

interface ChecklistContextType {
  checklist: ChecklistItem[];
  currentRole: UserRole;
  setCurrentRole: (role: UserRole) => void;
  toggleItemCompletion: (id: string) => void;
  addComment: (id: string, comment: string) => void;
  addTask: (task: Omit<ChecklistItem, 'id' | 'completed'>) => void;
  removeTask: (id: string) => void;
  filteredPhases: string[];
  setFilteredPhases: React.Dispatch<React.SetStateAction<string[]>>;
  filteredOwners: string[];
  setFilteredOwners: React.Dispatch<React.SetStateAction<string[]>>;
  searchQuery: string;
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
}

const ChecklistContext = createContext<ChecklistContextType | undefined>(undefined);

export const ChecklistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [checklist, setChecklist] = useState<ChecklistItem[]>(initialChecklistData);
  const [currentRole, setCurrentRole] = useState<UserRole>('Manager');
  const [filteredPhases, setFilteredPhases] = useState<string[]>([]);
  const [filteredOwners, setFilteredOwners] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  const toggleItemCompletion = (id: string) => {
    setChecklist(prevList =>
      prevList.map(item =>
        item.id === id ? { ...item, completed: !item.completed } : item
      )
    );
    
    const item = checklist.find(item => item.id === id);
    if (item) {
      toast({
        title: item.completed ? "Task marked as incomplete" : "Task completed!",
        description: item.title,
        duration: 3000,
      });
    }
  };

  const addComment = (id: string, comment: string) => {
    setChecklist(prevList =>
      prevList.map(item =>
        item.id === id
          ? { ...item, comments: item.comments ? `${item.comments}\n${comment}` : comment }
          : item
      )
    );
    
    toast({
      title: "Comment added",
      description: "Your comment has been added to the task.",
      duration: 3000,
    });
  };

  const addTask = (task: Omit<ChecklistItem, 'id' | 'completed'>) => {
    const newTask = {
      ...task,
      id: `task-${Date.now()}`,
      completed: false,
    };

    setChecklist(prevList => [...prevList, newTask]);
    
    toast({
      title: "Task added",
      description: "New task has been added to the checklist.",
      duration: 3000,
    });
  };

  const removeTask = (id: string) => {
    setChecklist(prevList => prevList.filter(item => item.id !== id));
    
    toast({
      title: "Task removed",
      description: "The task has been removed from the checklist.",
      duration: 3000,
    });
  };

  return (
    <ChecklistContext.Provider
      value={{
        checklist,
        currentRole,
        setCurrentRole,
        toggleItemCompletion,
        addComment,
        addTask,
        removeTask,
        filteredPhases,
        setFilteredPhases,
        filteredOwners, 
        setFilteredOwners,
        searchQuery,
        setSearchQuery
      }}
    >
      {children}
    </ChecklistContext.Provider>
  );
};

export const useChecklist = () => {
  const context = useContext(ChecklistContext);
  if (!context) {
    throw new Error('useChecklist must be used within a ChecklistProvider');
  }
  return context;
};
