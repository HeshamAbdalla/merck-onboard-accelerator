
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Edit, Copy, Trash2 } from 'lucide-react';
import { useChecklist } from '@/context/ChecklistContext';

// Mock templates data for demonstration
const templates = [
  {
    id: "1",
    name: "Software Engineer Onboarding",
    department: "Engineering",
    tasks: 24,
    lastUpdated: "2025-04-15",
  },
  {
    id: "2",
    name: "Marketing Specialist Onboarding",
    department: "Marketing",
    tasks: 18,
    lastUpdated: "2025-04-10",
  },
  {
    id: "3",
    name: "Product Manager Onboarding",
    department: "Product",
    tasks: 22,
    lastUpdated: "2025-04-05",
  },
  {
    id: "4",
    name: "UX/UI Designer Onboarding",
    department: "Design",
    tasks: 20,
    lastUpdated: "2025-03-28",
  }
];

const Templates: React.FC = () => {
  const { currentRole } = useChecklist();
  
  if (currentRole !== 'HR Admin') {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-6rem)]">
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle className="text-center">Access Restricted</CardTitle>
            <CardDescription className="text-center">
              The Templates page is only accessible to HR Administrators.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
            <Button variant="outline" onClick={() => window.history.back()}>
              Go Back
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-merck-purple-dark">Onboarding Templates</h1>
          <p className="text-gray-500">Manage and create standard onboarding templates</p>
        </div>
        <Button className="mt-4 md:mt-0">Create New Template</Button>
      </div>

      <Tabs defaultValue="role-based" className="space-y-4">
        <TabsList>
          <TabsTrigger value="role-based">Role-Based Templates</TabsTrigger>
          <TabsTrigger value="department">Department Templates</TabsTrigger>
          <TabsTrigger value="global">Global Templates</TabsTrigger>
        </TabsList>

        <TabsContent value="role-based" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Role-Specific Templates</CardTitle>
              <CardDescription>
                Templates customized for specific job roles
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Template Name</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Tasks</TableHead>
                    <TableHead>Last Updated</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {templates.map((template) => (
                    <TableRow key={template.id}>
                      <TableCell className="font-medium">{template.name}</TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {template.department}
                        </Badge>
                      </TableCell>
                      <TableCell>{template.tasks} tasks</TableCell>
                      <TableCell>{new Date(template.lastUpdated).toLocaleDateString()}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="icon">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon">
                            <Copy className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="department" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Department Templates</CardTitle>
              <CardDescription>
                Templates grouped by department
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-gray-500">
                Select a department to view its templates
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="global" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Global Templates</CardTitle>
              <CardDescription>
                Company-wide templates applicable to all employees
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-gray-500">
                Global templates will appear here
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Templates;
