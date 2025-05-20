import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { FileText, File, Download, BookOpen } from 'lucide-react';
import { useChecklist } from '@/context/ChecklistContext';

// Mock resource data for demonstration
const resources = {
  templates: [
    {
      id: "1",
      name: "Employee First Week Guide",
      type: "PDF",
      size: "2.4 MB",
      lastUpdated: "2025-04-15",
      icon: File,
      badgeText: "Essential"
    },
    {
      id: "2",
      name: "Onboarding Checklist Template",
      type: "DOCX",
      size: "1.2 MB",
      lastUpdated: "2025-04-10",
      icon: FileText,
      badgeText: "Popular"
    },
    {
      id: "3",
      name: "Equipment Request Form",
      type: "PDF",
      size: "0.8 MB",
      lastUpdated: "2025-04-05",
      icon: File,
      badgeText: ""
    },
    {
      id: "4",
      name: "Manager Onboarding Guide",
      type: "PDF",
      size: "3.5 MB",
      lastUpdated: "2025-03-28",
      icon: File,
      badgeText: "Manager"
    }
  ],
  guides: [
    {
      id: "5",
      name: "New Hire Orientation Guide",
      type: "PDF",
      size: "4.2 MB",
      lastUpdated: "2025-04-12",
      icon: BookOpen,
      badgeText: "New"
    },
    {
      id: "6",
      name: "Company Benefits Overview",
      type: "PDF",
      size: "2.8 MB",
      lastUpdated: "2025-04-08",
      icon: File,
      badgeText: "Essential"
    },
    {
      id: "7",
      name: "IT Systems Access Guide",
      type: "PDF",
      size: "1.5 MB",
      lastUpdated: "2025-04-03",
      icon: BookOpen,
      badgeText: ""
    },
    {
      id: "8",
      name: "Remote Work Policy",
      type: "PDF",
      size: "1.1 MB",
      lastUpdated: "2025-03-25",
      icon: File,
      badgeText: ""
    }
  ],
  training: [
    {
      id: "9",
      name: "Compliance Training Materials",
      type: "PDF",
      size: "5.3 MB",
      lastUpdated: "2025-04-14",
      icon: BookOpen,
      badgeText: "Required"
    },
    {
      id: "10",
      name: "Leadership Skills Development",
      type: "PDF",
      size: "3.7 MB",
      lastUpdated: "2025-04-07",
      icon: File,
      badgeText: "Manager"
    },
    {
      id: "11",
      name: "Product Knowledge Training",
      type: "PDF",
      size: "4.5 MB",
      lastUpdated: "2025-04-02",
      icon: BookOpen,
      badgeText: ""
    },
    {
      id: "12",
      name: "Diversity and Inclusion Workshop",
      type: "PDF",
      size: "2.2 MB",
      lastUpdated: "2025-03-22",
      icon: File,
      badgeText: "All Staff"
    }
  ]
};

const ResourceCard = ({ resource }) => (
  <Card className="overflow-hidden transition-all hover:shadow-md">
    <CardContent className="p-4">
      <div className="flex items-center space-x-4">
        <div className="rounded-lg bg-merck-primary/10 p-2">
          <resource.icon className="h-8 w-8 text-merck-primary" />
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <h3 className="font-medium text-gray-900">{resource.name}</h3>
            {resource.badgeText && (
              <Badge variant="outline" className="ml-2 bg-merck-primary/5 text-xs">
                {resource.badgeText}
              </Badge>
            )}
          </div>
          <div className="mt-1 flex items-center text-xs text-gray-500">
            <span>{resource.type}</span>
            <span className="mx-2">•</span>
            <span>{resource.size}</span>
            <span className="mx-2">•</span>
            <span>Updated {new Date(resource.lastUpdated).toLocaleDateString()}</span>
          </div>
        </div>
      </div>
    </CardContent>
    <CardFooter className="bg-gray-50 px-4 py-2">
      <Button variant="ghost" size="sm" className="ml-auto flex gap-1 text-xs">
        <Download className="h-4 w-4" />
        Download
      </Button>
    </CardFooter>
  </Card>
);

const Templates: React.FC = () => {
  const { currentRole } = useChecklist();
  
  if (currentRole !== 'HR Admin' && currentRole !== 'Manager' && currentRole !== 'Buddy') {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-6rem)]">
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle className="text-center">Access Restricted</CardTitle>
            <CardDescription className="text-center">
              The Resources page is only accessible to HR Administrators, Managers, and Buddies.
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
          <h1 className="text-2xl font-bold text-merck-primary">Onboarding Resources</h1>
          <p className="text-gray-500">Access helpful templates, guides and training materials for new employees</p>
        </div>
        {currentRole === 'HR Admin' && (
          <Button className="mt-4 md:mt-0">Upload New Resource</Button>
        )}
      </div>

      <Tabs defaultValue="templates" className="space-y-4">
        <TabsList className="grid w-full md:w-auto grid-cols-3">
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="guides">New Hire Guides</TabsTrigger>
          <TabsTrigger value="training">Training Materials</TabsTrigger>
        </TabsList>

        <TabsContent value="templates" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {resources.templates.map((resource) => (
              <ResourceCard key={resource.id} resource={resource} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="guides" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {resources.guides.map((resource) => (
              <ResourceCard key={resource.id} resource={resource} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="training" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {resources.training.map((resource) => (
              <ResourceCard key={resource.id} resource={resource} />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Templates;
