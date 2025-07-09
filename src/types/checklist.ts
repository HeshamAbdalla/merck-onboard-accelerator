
export type Phase = 
  | 'Pre-Planning'
  | 'Orientation'
  | 'General Onboarding'
  | 'Employee Assimilation';

export type Owner = 
  | 'HR'
  | 'Manager'
  | 'IT'
  | 'Buddy'
  | 'Admin';

export type Responsibility = 
  | 'Local'
  | 'Functional'
  | 'Global';

export type DueDate = 
  | 'Pre-start date'
  | 'First day'
  | 'First week'
  | 'Month 1'
  | 'Month 2'
  | 'Month 3'
  | 'Month 6';

export type ChecklistItem = {
  id: string;
  phase: Phase;
  title: string;
  description: string;
  owner: Owner;
  responsibility: Responsibility;
  suggestedDueDate: DueDate;
  comments: string;
  completed: boolean;
  attachments?: string[];
  actualDueDate?: string;
  isOverdue?: boolean;
  isPending?: boolean;
  priority?: 'Low' | 'Medium' | 'High' | 'Critical';
  dependencies?: string[];
  estimatedHours?: number;
  isTemplate?: boolean;
  templateCategory?: string;
};

export type UserRole = 'Manager' | 'HR Admin' | 'Buddy';

export type NotificationType = 'overdue' | 'pending' | 'completed' | 'assigned' | 'reminder';

export type Notification = {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  taskId?: string;
  employeeId?: string;
};

export type TaskTemplate = {
  id: string;
  title: string;
  description: string;
  phase: Phase;
  owner: Owner;
  responsibility: Responsibility;
  suggestedDueDate: DueDate;
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  estimatedHours?: number;
  category: string;
  dependencies?: string[];
};
