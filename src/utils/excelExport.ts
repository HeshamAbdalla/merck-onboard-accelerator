
import * as XLSX from 'xlsx';
import { ChecklistItem } from '@/types/checklist';

export interface EmployeeTaskExport {
  employeeId: string;
  employeeName: string;
  position: string;
  startDate: string;
  manager: string;
  tasks: ChecklistItem[];
}

export const exportEmployeeTasksToExcel = (employeeData: EmployeeTaskExport) => {
  // Create a new workbook
  const workbook = XLSX.utils.book_new();

  // Prepare task data for Excel
  const taskData = employeeData.tasks.map((task, index) => ({
    'Task #': index + 1,
    'Phase': task.phase,
    'Task Title': task.title,
    'Description': task.description,
    'Owner': task.owner,
    'Responsibility': task.responsibility,
    'Suggested Due Date': task.suggestedDueDate,
    'Status': task.completed ? 'Completed' : 'Pending',
    'Comments': task.comments || 'No comments'
  }));

  // Create employee info sheet
  const employeeInfo = [
    ['Employee Information', ''],
    ['Name', employeeData.employeeName],
    ['Position', employeeData.position],
    ['Start Date', employeeData.startDate],
    ['Manager', employeeData.manager],
    ['Total Tasks', employeeData.tasks.length.toString()],
    ['Completed Tasks', employeeData.tasks.filter(t => t.completed).length.toString()],
    ['Pending Tasks', employeeData.tasks.filter(t => !t.completed).length.toString()],
    ['', ''],
    ['Export Date', new Date().toLocaleDateString()],
    ['Export Time', new Date().toLocaleTimeString()]
  ];

  // Create worksheets
  const employeeInfoSheet = XLSX.utils.aoa_to_sheet(employeeInfo);
  const tasksSheet = XLSX.utils.json_to_sheet(taskData);

  // Style the employee info sheet
  const range = XLSX.utils.decode_range(employeeInfoSheet['!ref'] || 'A1');
  for (let row = range.s.r; row <= range.e.r; row++) {
    const cell = employeeInfoSheet[XLSX.utils.encode_cell({ r: row, c: 0 })];
    if (cell && row === 0) {
      cell.s = { font: { bold: true, sz: 14 } };
    }
  }

  // Add sheets to workbook
  XLSX.utils.book_append_sheet(workbook, employeeInfoSheet, 'Employee Info');
  XLSX.utils.book_append_sheet(workbook, tasksSheet, 'Onboarding Tasks');

  // Generate filename with employee name and date
  const sanitizedName = employeeData.employeeName.replace(/[^a-zA-Z0-9]/g, '_');
  const dateStr = new Date().toISOString().split('T')[0];
  const filename = `${sanitizedName}_Onboarding_Tasks_${dateStr}.xlsx`;

  // Write and download the file
  XLSX.writeFile(workbook, filename);

  return filename;
};

export const exportMultipleEmployeesTasks = (employeesData: EmployeeTaskExport[]) => {
  const workbook = XLSX.utils.book_new();

  // Create summary sheet
  const summaryData = employeesData.map(emp => ({
    'Employee Name': emp.employeeName,
    'Position': emp.position,
    'Start Date': emp.startDate,
    'Manager': emp.manager,
    'Total Tasks': emp.tasks.length,
    'Completed Tasks': emp.tasks.filter(t => t.completed).length,
    'Pending Tasks': emp.tasks.filter(t => !t.completed).length,
    'Progress %': Math.round((emp.tasks.filter(t => t.completed).length / emp.tasks.length) * 100)
  }));

  const summarySheet = XLSX.utils.json_to_sheet(summaryData);
  XLSX.utils.book_append_sheet(workbook, summarySheet, 'Summary');

  // Create individual sheets for each employee
  employeesData.forEach((emp, index) => {
    const taskData = emp.tasks.map((task, taskIndex) => ({
      'Task #': taskIndex + 1,
      'Phase': task.phase,
      'Task Title': task.title,
      'Description': task.description,
      'Owner': task.owner,
      'Responsibility': task.responsibility,
      'Suggested Due Date': task.suggestedDueDate,
      'Status': task.completed ? 'Completed' : 'Pending',
      'Comments': task.comments || 'No comments'
    }));

    const taskSheet = XLSX.utils.json_to_sheet(taskData);
    const sanitizedName = emp.employeeName.replace(/[^a-zA-Z0-9]/g, '_').substring(0, 20);
    XLSX.utils.book_append_sheet(workbook, taskSheet, `${sanitizedName}_Tasks`);
  });

  // Generate filename
  const dateStr = new Date().toISOString().split('T')[0];
  const filename = `Team_Onboarding_Tasks_${dateStr}.xlsx`;

  XLSX.writeFile(workbook, filename);
  return filename;
};
