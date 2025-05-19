
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
};

export type UserRole = 'Manager' | 'HR Admin' | 'Buddy';
