
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useChecklist } from '@/context/ChecklistContext';

// Mock employees data for demonstration
const employees = [
  {
    id: "1",
    name: "Alex Johnson",
    position: "Software Developer",
    startDate: "2025-06-01",
    status: "In Progress",
    progress: 35,
  },
  {
    id: "2",
    name: "Morgan Smith",
    position: "Marketing Specialist",
    startDate: "2025-05-15",
    status: "Not Started",
    progress: 0,
  },
  {
    id: "3",
    name: "Jamie Williams",
    position: "Product Manager",
    startDate: "2025-06-15",
    status: "In Progress",
    progress: 72,
  },
  {
    id: "4",
    name: "Casey Taylor",
    position: "UX Designer",
    startDate: "2025-05-01",
    status: "Completed",
    progress: 100,
  },
  {
    id: "5",
    name: "Riley Brown",
    position: "Data Analyst",
    startDate: "2025-07-01",
    status: "Not Started",
    progress: 0,
  }
];

const Employees: React.FC = () => {
  const { currentRole } = useChecklist();

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-merck-purple-dark">Employees</h1>
          <p className="text-gray-500">Manage onboarding progress for new hires</p>
        </div>
        <Button className="mt-4 md:mt-0">Add New Employee</Button>
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
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Employee Onboarding Status</CardTitle>
          <CardDescription>
            {currentRole === 'HR Admin' 
              ? 'Overview of all employee onboarding progress' 
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
                <TableHead>Status</TableHead>
                <TableHead>Progress</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {employees.map((employee) => (
                <TableRow key={employee.id}>
                  <TableCell className="font-medium">{employee.name}</TableCell>
                  <TableCell>{employee.position}</TableCell>
                  <TableCell>{new Date(employee.startDate).toLocaleDateString()}</TableCell>
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
                    <Button variant="outline" size="sm">View Checklist</Button>
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
