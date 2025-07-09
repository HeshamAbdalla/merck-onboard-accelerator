import { ChecklistItem } from '@/types/checklist';
import { parseISO, isAfter } from 'date-fns';

// Priority weights for sorting
const PRIORITY_WEIGHTS = {
  'Critical': 4,
  'High': 3,
  'Medium': 2,
  'Low': 1
};

// Phase order weights
const PHASE_WEIGHTS = {
  'Pre-Planning': 1,
  'Orientation': 2,
  'General Onboarding': 3,
  'Employee Assimilation': 4
};

// Due date urgency weights
const DUE_DATE_WEIGHTS = {
  'Pre-start date': 1,
  'First day': 2,
  'First week': 3,
  'Month 1': 4,
  'Month 2': 5,
  'Month 3': 6,
  'Month 6': 7
};

/**
 * Calculates a task's criticality score based on multiple factors
 */
export const calculateTaskScore = (task: ChecklistItem): number => {
  let score = 0;
  
  // Priority weight (40% of score)
  const priorityWeight = PRIORITY_WEIGHTS[task.priority || 'Medium'];
  score += priorityWeight * 0.4;
  
  // Phase weight (20% of score) - earlier phases get higher priority
  const phaseWeight = 5 - PHASE_WEIGHTS[task.phase]; // Invert so earlier phases score higher
  score += phaseWeight * 0.2;
  
  // Due date urgency (25% of score)
  const dueDateWeight = 8 - DUE_DATE_WEIGHTS[task.suggestedDueDate]; // Invert so sooner dates score higher
  score += dueDateWeight * 0.25;
  
  // Overdue penalty (15% of score)
  if (task.actualDueDate) {
    const isOverdue = isAfter(new Date(), parseISO(task.actualDueDate));
    if (isOverdue) {
      score += 3 * 0.15; // High penalty for overdue tasks
    }
  }
  
  // Dependency bonus - tasks with dependencies get slightly higher priority
  if (task.dependencies && task.dependencies.length > 0) {
    score += 0.5;
  }
  
  return score;
};

/**
 * Sorts tasks by critical path algorithm
 */
export const sortTasksByCriticalPath = (tasks: ChecklistItem[]): ChecklistItem[] => {
  const sortedTasks = [...tasks].sort((a, b) => {
    // First, prioritize incomplete tasks
    if (a.completed !== b.completed) {
      return a.completed ? 1 : -1;
    }
    
    // For incomplete tasks, sort by criticality score
    if (!a.completed && !b.completed) {
      const scoreA = calculateTaskScore(a);
      const scoreB = calculateTaskScore(b);
      return scoreB - scoreA; // Higher score first
    }
    
    // For completed tasks, maintain original order
    return 0;
  });
  
  return sortedTasks;
};

/**
 * Groups tasks by phase and sorts within each phase
 */
export const groupAndSortTasks = (tasks: ChecklistItem[]) => {
  const grouped = tasks.reduce((acc, task) => {
    if (!acc[task.phase]) {
      acc[task.phase] = [];
    }
    acc[task.phase].push(task);
    return acc;
  }, {} as Record<string, ChecklistItem[]>);
  
  // Sort tasks within each phase
  Object.keys(grouped).forEach(phase => {
    grouped[phase] = sortTasksByCriticalPath(grouped[phase]);
  });
  
  return grouped;
};

/**
 * Identifies blocking tasks (tasks that other tasks depend on)
 */
export const identifyBlockingTasks = (tasks: ChecklistItem[]): string[] => {
  const blockingTaskIds = new Set<string>();
  
  tasks.forEach(task => {
    if (task.dependencies) {
      task.dependencies.forEach(depId => {
        blockingTaskIds.add(depId);
      });
    }
  });
  
  return Array.from(blockingTaskIds);
};

/**
 * Gets tasks that are ready to be worked on (no incomplete dependencies)
 */
export const getReadyTasks = (tasks: ChecklistItem[]): ChecklistItem[] => {
  return tasks.filter(task => {
    if (task.completed) return false;
    
    if (!task.dependencies || task.dependencies.length === 0) {
      return true; // No dependencies, ready to work
    }
    
    // Check if all dependencies are completed
    const dependencyTasks = tasks.filter(t => task.dependencies!.includes(t.id));
    return dependencyTasks.every(dep => dep.completed);
  });
};

/**
 * Calculates completion percentage for a phase
 */
export const getPhaseProgress = (phaseTasks: ChecklistItem[]): number => {
  if (phaseTasks.length === 0) return 0;
  const completed = phaseTasks.filter(task => task.completed).length;
  return Math.round((completed / phaseTasks.length) * 100);
};

/**
 * Estimates remaining time for incomplete tasks
 */
export const estimateRemainingTime = (tasks: ChecklistItem[]): number => {
  return tasks
    .filter(task => !task.completed)
    .reduce((total, task) => total + (task.estimatedHours || 2), 0); // Default 2 hours if not specified
};