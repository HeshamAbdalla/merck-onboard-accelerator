import React, { useState } from 'react';
import { Plus, Search, BookTemplate, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { TaskTemplate, Phase, Owner, Responsibility } from '@/types/checklist';
import { useChecklist } from '@/context/ChecklistContext';

// Mock template data - in a real app, this would come from an API
const defaultTemplates: TaskTemplate[] = [
  {
    id: 'template-1',
    title: 'IT Account Setup',
    description: 'Create user accounts, email, and system access',
    phase: 'Pre-Planning',
    owner: 'IT',
    responsibility: 'Functional',
    suggestedDueDate: 'Pre-start date',
    priority: 'High',
    estimatedHours: 2,
    category: 'IT Setup',
    dependencies: []
  },
  {
    id: 'template-2',
    title: 'Welcome Package Preparation',
    description: 'Prepare welcome materials, handbook, and company swag',
    phase: 'Pre-Planning',
    owner: 'HR',
    responsibility: 'Global',
    suggestedDueDate: 'Pre-start date',
    priority: 'Medium',
    estimatedHours: 1,
    category: 'HR Preparation',
    dependencies: []
  },
  {
    id: 'template-3',
    title: 'Team Introduction Meeting',
    description: 'Schedule and conduct team introduction session',
    phase: 'Orientation',
    owner: 'Manager',
    responsibility: 'Local',
    suggestedDueDate: 'First day',
    priority: 'High',
    estimatedHours: 1,
    category: 'Team Integration',
    dependencies: []
  }
];

interface TaskTemplateLibraryProps {
  onAddTemplate: (template: TaskTemplate) => void;
}

const TaskTemplateLibrary: React.FC<TaskTemplateLibraryProps> = ({ onAddTemplate }) => {
  const { addTask } = useChecklist();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedTemplate, setSelectedTemplate] = useState<TaskTemplate | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Filter templates based on search and category
  const filteredTemplates = defaultTemplates.filter(template => {
    const matchesSearch = template.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  // Get unique categories
  const categories = ['all', ...Array.from(new Set(defaultTemplates.map(t => t.category)))];

  const handleAddTaskFromTemplate = (template: TaskTemplate) => {
    addTask({
      title: template.title,
      description: template.description,
      phase: template.phase,
      owner: template.owner,
      responsibility: template.responsibility,
      suggestedDueDate: template.suggestedDueDate,
      comments: '',
      priority: template.priority,
      estimatedHours: template.estimatedHours,
      dependencies: template.dependencies
    });
    setIsDialogOpen(false);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Critical':
        return 'destructive';
      case 'High':
        return 'secondary';
      case 'Medium':
        return 'outline';
      case 'Low':
        return 'outline';
      default:
        return 'outline';
    }
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <BookTemplate className="h-4 w-4" />
          Add from Template
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <BookTemplate className="h-5 w-5" />
            Task Template Library
          </DialogTitle>
          <DialogDescription>
            Choose from pre-configured task templates to quickly add common onboarding tasks.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Search and Filter */}
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search templates..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map(category => (
                  <SelectItem key={category} value={category}>
                    {category === 'all' ? 'All Categories' : category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Template Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-96 overflow-y-auto">
            {filteredTemplates.map(template => (
              <Card key={template.id} className="hover:shadow-md transition-shadow cursor-pointer">
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-base">{template.title}</CardTitle>
                      <CardDescription className="text-sm mt-1">
                        {template.description}
                      </CardDescription>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => handleAddTaskFromTemplate(template)}
                      className="ml-2"
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-1">
                    <Badge variant="outline" className="text-xs">
                      {template.phase}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {template.owner}
                    </Badge>
                    <Badge 
                      variant={getPriorityColor(template.priority)}
                      className="text-xs"
                    >
                      {template.priority}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {template.category}
                    </Badge>
                    {template.estimatedHours && (
                      <Badge variant="outline" className="text-xs">
                        {template.estimatedHours}h
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredTemplates.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <BookTemplate className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>No templates found matching your criteria.</p>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TaskTemplateLibrary;