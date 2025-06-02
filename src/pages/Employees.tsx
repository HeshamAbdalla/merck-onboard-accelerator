import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Download, FileSpreadsheet } from 'lucide-react';
import { useChecklist } from '@/context/ChecklistContext';
import { exportEmployeeTasksToExcel, exportMultipleEmployeesTasks, EmployeeTaskExport } from '@/utils/excelExport';
import { toast } from '@/hooks/use-toast';

// Extended mock employees data with manager information
const employees = [
  {
    id: "1",
    name: "Alex Johnson",
    position: "Software Developer",
    startDate: "2025-06-01",
    status: "In Progress",
    progress: 35,
    manager: "Sarah Miller"
  },
  {
    id: "2",
    name: "Morgan Smith",
    position: "Marketing Specialist",
    startDate: "2025-05-15",
    status: "Not Started",
    progress: 0,
    manager: "Sarah Miller"
  },
  {
    id: "3",
    name: "Jamie Williams",
    position: "Product Manager",
    startDate: "2025-06-15",
    status: "In Progress",
    progress: 72,
    manager: "Robert Chen"
  },
  {
    id: "4",
    name: "Casey Taylor",
    position: "UX Designer",
    startDate: "2025-05-01",
    status: "Completed",
    progress: 100,
    manager: "Sarah Miller"
  },
  {
    id: "5",
    name: "Riley Brown",
    position: "Data Analyst",
    startDate: "2025-07-01",
    status: "Not Started",
    progress: 0,
    manager: "Robert Chen"
  }
];

// Mock managers data
const managers = [
  { id: "1", name: "Sarah Miller" },
  { id: "2", name: "Robert Chen" },
  { id: "3", name: "Ana Rodriguez" }
];

// For demo purposes, we'll use a hardcoded current manager
const currentManager = "Sarah Miller";

const Employees: React.FC = () => {
  const { currentRole, checklist } = useChecklist();
  
  // Filter employees based on role and current manager
  const filteredEmployees = React.useMemo(() => {
    if (currentRole === "HR Admin") {
      return employees; // HR Admins see all employees
    } else if (currentRole === "Manager") {
      return employees.filter(emp => emp.manager === currentManager);
    }
    return employees; // Default fallback
  }, [currentRole]);

  const handleExportSingleEmployee = (employee: typeof employees[0]) => {
    try {
      const employeeTaskData: EmployeeTaskExport = {
        employeeId: employee.id,
        employeeName: employee.name,
        position: employee.position,
        startDate: employee.startDate,
        manager: employee.manager,
        tasks: checklist // Using the full checklist as mock data for tasks
      };

      const filename = exportEmployeeTasksToExcel(employeeTaskData);
      
      toast({
        title: "Export Successful",
        description: `${employee.name}'s tasks exported to ${filename}`,
        duration: 4000,
      });
    } catch (error) {
      console.error('Export failed:', error);
      toast({
        title: "Export Failed",
        description: "There was an error exporting the tasks. Please try again.",
        variant: "destructive",
        duration: 4000,
      });
    }
  };

  const handleExportAllEmployees = () => {
    try {
      const allEmployeesData: EmployeeTaskExport[] = filteredEmployees.map(emp => ({
        employeeId: emp.id,
        employeeName: emp.name,
        position: emp.position,
        startDate: emp.startDate,
        manager: emp.manager,
        tasks: checklist // Using the full checklist as mock data for tasks
      }));

      const filename = exportMultipleEmployeesTasks(allEmployeesData);
      
      toast({
        title: "Bulk Export Successful",
        description: `All employee tasks exported to ${filename}`,
        duration: 4000,
      });
    } catch (error) {
      console.error('Bulk export failed:', error);
      toast({
        title: "Export Failed",
        description: "There was an error exporting all tasks. Please try again.",
        variant: "destructive",
        duration: 4000,
      });
    }
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-merck-primary-dark">My Employees</h1>
          {currentRole === "Manager" ? (
            <p className="text-gray-500">Manage onboarding progress for {currentManager}'s team</p>
          ) : (
            <p className="text-gray-500">Manage onboarding progress across all teams</p>
          )}
        </div>
        <div className="flex gap-2 mt-4 md:mt-0">
          <Button
            variant="outline"
            onClick={handleExportAllEmployees}
            className="flex items-center gap-2"
          >
            <FileSpreadsheet className="h-4 w-4" />
            Export All Tasks
          </Button>
          <Button>Add New Employee</Button>
        </div>
      </div>

      <Card className="mb-6">
        <CardHeader className="pb-3">
          <CardTitle>Filter Employees</CardTitle>
          <CardDescription>Search and filter the employee list</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Input placeholder="Search employees..." />
            </div>
            <div>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="not-started">Not Started</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {currentRole === "HR Admin" && (
              <div>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Manager" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Managers</SelectItem>
                    {managers.map(manager => (
                      <SelectItem key={manager.id} value={manager.id}>{manager.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
            {currentRole !== "HR Admin" && (
              <div>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="name">Name</SelectItem>
                    <SelectItem value="start-date">Start Date</SelectItem>
                    <SelectItem value="progress">Progress</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>
            {currentRole === "Manager" 
              ? `My Employee Onboarding Status` 
              : "Employee Onboarding Status"}
          </CardTitle>
          <CardDescription>
            {currentRole === "Manager" 
              ? `Tracking onboarding progress for ${currentManager}'s team members` 
              : currentRole === "HR Admin" 
                ? 'Overview of all employee onboarding progress across departments' 
                : 'Your team member onboarding progress'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Position</TableHead>
                <TableHead>Start Date</TableHead>
                {currentRole === "HR Admin" && <TableHead>Manager</TableHead>}
                <TableHead>Status</TableHead>
                <TableHead>Progress</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredEmployees.map((employee) => (
                <TableRow key={employee.id}>
                  <TableCell className="font-medium">{employee.name}</TableCell>
                  <TableCell>{employee.position}</TableCell>
                  <TableCell>{new Date(employee.startDate).toLocaleDateString()}</TableCell>
                  {currentRole === "HR Admin" && <TableCell>{employee.manager}</TableCell>}
                  <TableCell>
                    <Badge
                      className={`
                        ${employee.status === "Completed" ? "bg-green-100 text-green-800" :
                          employee.status === "In Progress" ? "bg-blue-100 text-blue-800" :
                            "bg-gray-100 text-gray-800"}
                      `}
                    >
                      {employee.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Progress value={employee.progress} className="h-2.5 w-full max-w-24" />
                      <span className="text-sm">{employee.progress}%</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex gap-2 justify-end">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleExportSingleEmployee(employee)}
                        className="flex items-center gap-1"
                      >
                        <Download className="h-3 w-3" />
                        Export
                      </Button>
                      <Button variant="outline" size="sm">View Checklist</Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default Employees;
