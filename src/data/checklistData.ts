
import { ChecklistItem } from '../types/checklist';

export const initialChecklistData: ChecklistItem[] = [
  // Pre-Planning Phase
  {
    id: '001',
    phase: 'Pre-Planning',
    title: 'Create onboarding plan',
    description: 'Define role-specific onboarding plan including meetings and learning resources',
    owner: 'Manager',
    responsibility: 'Local',
    suggestedDueDate: 'Pre-start date',
    comments: 'Use onboarding plan template from HR portal',
    completed: false
  },
  {
    id: '002',
    phase: 'Pre-Planning',
    title: 'Prepare workspace',
    description: 'Ensure physical or virtual workspace is ready for new employee',
    owner: 'Manager',
    responsibility: 'Local',
    suggestedDueDate: 'Pre-start date',
    comments: 'Coordinate with facilities team',
    completed: false
  },
  {
    id: '003',
    phase: 'Pre-Planning',
    title: 'Request equipment',
    description: 'Order necessary computer, phone, and other equipment',
    owner: 'IT',
    responsibility: 'Functional',
    suggestedDueDate: 'Pre-start date',
    comments: 'Allow 2 weeks for delivery and setup',
    completed: false
  },
  {
    id: '004',
    phase: 'Pre-Planning',
    title: 'Assign a Buddy',
    description: 'Select experienced team member to serve as onboarding buddy',
    owner: 'Manager',
    responsibility: 'Local',
    suggestedDueDate: 'Pre-start date',
    comments: 'Use buddy guide link for instructions',
    completed: false
  },
  
  // Orientation Phase
  {
    id: '005',
    phase: 'Orientation',
    title: 'Welcome meeting',
    description: 'Conduct first-day welcome and introduction meeting',
    owner: 'Manager',
    responsibility: 'Local',
    suggestedDueDate: 'First day',
    comments: 'Include team introductions',
    completed: false
  },
  {
    id: '006',
    phase: 'Orientation',
    title: 'HR paperwork completion',
    description: 'Ensure all required employment forms are completed',
    owner: 'HR',
    responsibility: 'Global',
    suggestedDueDate: 'First day',
    comments: 'Verify tax forms, benefits selection, and I-9 documentation',
    completed: false
  },
  {
    id: '007',
    phase: 'Orientation',
    title: 'Building tour and access',
    description: 'Provide tour of facilities and issue access credentials',
    owner: 'Buddy',
    responsibility: 'Local',
    suggestedDueDate: 'First day',
    comments: 'Include safety procedures review',
    completed: false
  },
  
  // General Onboarding Phase
  {
    id: '008',
    phase: 'General Onboarding',
    title: 'Company overview training',
    description: 'Complete required company history and policy overview',
    owner: 'HR',
    responsibility: 'Global',
    suggestedDueDate: 'First week',
    comments: 'Available via Learning Management System',
    completed: false
  },
  {
    id: '009',
    phase: 'General Onboarding',
    title: 'Systems access and training',
    description: 'Set up accounts and provide training for core systems',
    owner: 'IT',
    responsibility: 'Functional',
    suggestedDueDate: 'First week',
    comments: 'Include email, internal systems, and role-specific applications',
    completed: false
  },
  {
    id: '010',
    phase: 'General Onboarding',
    title: 'Role expectations meeting',
    description: 'Detailed discussion of role responsibilities and goals',
    owner: 'Manager',
    responsibility: 'Local',
    suggestedDueDate: 'First week',
    comments: 'Set 30/60/90 day performance expectations',
    completed: false
  },
  
  // Employee Assimilation Phase
  {
    id: '011',
    phase: 'Employee Assimilation',
    title: '30-day check-in',
    description: 'First formal performance and adaptation discussion',
    owner: 'Manager',
    responsibility: 'Local',
    suggestedDueDate: 'Month 1',
    comments: 'Review initial goals and address any concerns',
    completed: false
  },
  {
    id: '012',
    phase: 'Employee Assimilation',
    title: 'Department-specific training',
    description: 'Complete specialized training relevant to role and department',
    owner: 'Manager',
    responsibility: 'Functional',
    suggestedDueDate: 'Month 1',
    comments: 'Coordinate with departmental trainers',
    completed: false
  },
  {
    id: '013',
    phase: 'Employee Assimilation',
    title: '60-day review',
    description: 'Progress assessment and feedback discussion',
    owner: 'Manager',
    responsibility: 'Local',
    suggestedDueDate: 'Month 2',
    comments: 'Include development opportunities assessment',
    completed: false
  },
  {
    id: '014',
    phase: 'Employee Assimilation',
    title: '90-day performance evaluation',
    description: 'Formal review of first three months performance',
    owner: 'Manager',
    responsibility: 'Local',
    suggestedDueDate: 'Month 3',
    comments: 'Complete standard evaluation form from HR',
    completed: false
  },
  {
    id: '015',
    phase: 'Employee Assimilation',
    title: 'Six-month career development discussion',
    description: 'Long-term career path and development plan creation',
    owner: 'Manager',
    responsibility: 'Local',
    suggestedDueDate: 'Month 6',
    comments: 'Use career development template',
    completed: false
  }
];
