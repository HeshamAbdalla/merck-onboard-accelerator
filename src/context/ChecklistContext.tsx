
import React, { createContext, useContext, useState, useEffect } from 'react';
import { ChecklistItem, UserRole, Notification, NotificationType, Milestone, ViewMode } from '../types/checklist';
import { initialChecklistData } from '../data/checklistData';
import { toast } from '@/hooks/use-toast';
import { sortTasksByCriticalPath } from '../utils/taskReordering';

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
  sortByCriticalPath: boolean;
  setSortByCriticalPath: React.Dispatch<React.SetStateAction<boolean>>;
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp'>) => void;
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  clearAllNotifications: () => void;
  // New milestone functionality
  milestones: Milestone[];
  addMilestone: (milestone: Omit<Milestone, 'id'>) => void;
  updateMilestone: (id: string, updates: Partial<Milestone>) => void;
  deleteMilestone: (id: string) => void;
  // View mode
  currentView: ViewMode;
  setCurrentView: React.Dispatch<React.SetStateAction<ViewMode>>;
}

const ChecklistContext = createContext<ChecklistContextType | undefined>(undefined);

export const ChecklistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [checklist, setChecklist] = useState<ChecklistItem[]>(initialChecklistData);
  const [currentRole, setCurrentRole] = useState<UserRole>('Manager');
  const [filteredPhases, setFilteredPhases] = useState<string[]>([]);
  const [filteredOwners, setFilteredOwners] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortByCriticalPath, setSortByCriticalPath] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [currentView, setCurrentView] = useState<ViewMode>('checklist');

  const toggleItemCompletion = (id: string) => {
    setChecklist(prevList =>
      prevList.map(item =>
        item.id === id ? { 
          ...item, 
          completed: !item.completed,
          completedDate: !item.completed ? new Date().toISOString() : undefined
        } : item
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

  // Milestone functions
  const addMilestone = (milestone: Omit<Milestone, 'id'>) => {
    const newMilestone = {
      ...milestone,
      id: `milestone-${Date.now()}`
    };
    
    setMilestones(prev => [...prev, newMilestone]);
    
    toast({
      title: "Milestone added",
      description: "New milestone has been created.",
      duration: 3000,
    });
  };

  const updateMilestone = (id: string, updates: Partial<Milestone>) => {
    setMilestones(prev =>
      prev.map(milestone =>
        milestone.id === id ? { ...milestone, ...updates } : milestone
      )
    );
    
    toast({
      title: "Milestone updated",
      description: "The milestone has been updated.",
      duration: 3000,
    });
  };

  const deleteMilestone = (id: string) => {
    setMilestones(prev => prev.filter(milestone => milestone.id !== id));
    
    toast({
      title: "Milestone deleted",
      description: "The milestone has been removed.",
      duration: 3000,
    });
  };

  // Notification functions
  const addNotification = (notification: Omit<Notification, 'id' | 'timestamp'>) => {
    const newNotification: Notification = {
      ...notification,
      id: `notification-${Date.now()}`,
      timestamp: new Date(),
    };
    
    setNotifications(prev => [newNotification, ...prev]);
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id 
          ? { ...notification, read: true }
          : notification
      )
    );
  };

  const markAllNotificationsAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    );
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  // Auto-generate notifications for overdue and pending tasks
  useEffect(() => {
    const checkOverdueTasks = () => {
      const now = new Date();
      checklist.forEach(task => {
        if (!task.completed && task.actualDueDate) {
          const dueDate = new Date(task.actualDueDate);
          const isOverdue = now > dueDate;
          const daysDiff = Math.ceil((dueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
          
          // Check if we already have a notification for this task
          const existingNotification = notifications.find(
            n => n.taskId === task.id && (n.type === 'overdue' || n.type === 'pending')
          );
          
          if (isOverdue && !existingNotification) {
            addNotification({
              type: 'overdue',
              title: 'Task Overdue',
              message: `"${task.title}" is overdue and needs immediate attention.`,
              read: false,
              taskId: task.id
            });
          } else if (daysDiff <= 3 && daysDiff >= 0 && !existingNotification) {
            addNotification({
              type: 'pending',
              title: 'Upcoming Deadline',
              message: `"${task.title}" is due in ${daysDiff} day${daysDiff !== 1 ? 's' : ''}.`,
              read: false,
              taskId: task.id
            });
          }
        }
      });
    };

    // Check immediately and then every hour
    checkOverdueTasks();
    const interval = setInterval(checkOverdueTasks, 60 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, [checklist, notifications]);

  return (
    <ChecklistContext.Provider
      value={{
        checklist: sortByCriticalPath ? sortTasksByCriticalPath(checklist) : checklist,
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
        setSearchQuery,
        sortByCriticalPath,
        setSortByCriticalPath,
        notifications,
        addNotification,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        clearAllNotifications,
        milestones,
        addMilestone,
        updateMilestone,
        deleteMilestone,
        currentView,
        setCurrentView
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
