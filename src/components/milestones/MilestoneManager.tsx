
import React, { useState } from 'react';
import { Plus, Target, Calendar, Check, Clock, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { Milestone, Phase, ChecklistItem } from '@/types/checklist';
import { cn } from '@/lib/utils';

interface MilestoneManagerProps {
  milestones: Milestone[];
  tasks: ChecklistItem[];
  onAddMilestone: (milestone: Omit<Milestone, 'id'>) => void;
  onUpdateMilestone: (id: string, updates: Partial<Milestone>) => void;
  onDeleteMilestone: (id: string) => void;
}

const MilestoneManager: React.FC<MilestoneManagerProps> = ({
  milestones,
  tasks,
  onAddMilestone,
  onUpdateMilestone,
  onDeleteMilestone
}) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingMilestone, setEditingMilestone] = useState<Milestone | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    targetDate: new Date(),
    phase: 'Pre-Planning' as Phase,
    type: 'important' as 'critical' | 'important' | 'optional',
    color: '#3b82f6'
  });

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      targetDate: new Date(),
      phase: 'Pre-Planning',
      type: 'important',
      color: '#3b82f6'
    });
    setEditingMilestone(null);
  };

  const handleSubmit = () => {
    if (!formData.title.trim()) return;

    const milestoneData = {
      title: formData.title,
      description: formData.description,
      targetDate: formData.targetDate.toISOString(),
      phase: formData.phase,
      type: formData.type,
      color: formData.color,
      tasks: [],
      completed: false
    };

    if (editingMilestone) {
      onUpdateMilestone(editingMilestone.id, milestoneData);
    } else {
      onAddMilestone(milestoneData);
    }

    setIsDialogOpen(false);
    resetForm();
  };

  const handleEdit = (milestone: Milestone) => {
    setEditingMilestone(milestone);
    setFormData({
      title: milestone.title,
      description: milestone.description,
      targetDate: new Date(milestone.targetDate),
      phase: milestone.phase,
      type: milestone.type,
      color: milestone.color
    });
    setIsDialogOpen(true);
  };

  const toggleMilestoneCompletion = (milestone: Milestone) => {
    onUpdateMilestone(milestone.id, {
      completed: !milestone.completed,
      completedDate: !milestone.completed ? new Date().toISOString() : undefined
    });
  };

  const getMilestoneProgress = (milestone: Milestone) => {
    const milestoneTasks = tasks.filter(task => task.milestoneId === milestone.id);
    if (milestoneTasks.length === 0) return 0;
    
    const completedTasks = milestoneTasks.filter(task => task.completed);
    return Math.round((completedTasks.length / milestoneTasks.length) * 100);
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'critical':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'important':
        return <Target className="h-4 w-4 text-orange-500" />;
      case 'optional':
        return <Clock className="h-4 w-4 text-blue-500" />;
      default:
        return <Target className="h-4 w-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'critical':
        return 'destructive';
      case 'important':
        return 'secondary';
      case 'optional':
        return 'outline';
      default:
        return 'outline';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Milestones</h2>
          <p className="text-muted-foreground">Track key achievements in the onboarding process</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="h-4 w-4 mr-2" />
              Add Milestone
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>
                {editingMilestone ? 'Edit Milestone' : 'Add New Milestone'}
              </DialogTitle>
              <DialogDescription>
                Create milestones to mark important achievements in the onboarding journey.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Milestone title"
                />
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe what this milestone represents"
                  className="min-h-20"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Phase</Label>
                  <Select value={formData.phase} onValueChange={(value) => setFormData({ ...formData, phase: value as Phase })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Pre-Planning">Pre-Planning</SelectItem>
                      <SelectItem value="Orientation">Orientation</SelectItem>
                      <SelectItem value="General Onboarding">General Onboarding</SelectItem>
                      <SelectItem value="Employee Assimilation">Employee Assimilation</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Type</Label>
                  <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value as any })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="critical">Critical</SelectItem>
                      <SelectItem value="important">Important</SelectItem>
                      <SelectItem value="optional">Optional</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label>Target Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left font-normal">
                      <Calendar className="mr-2 h-4 w-4" />
                      {format(formData.targetDate, 'PPP')}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <CalendarComponent
                      mode="single"
                      selected={formData.targetDate}
                      onSelect={(date) => date && setFormData({ ...formData, targetDate: date })}
                      initialFocus
                      className="pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div>
                <Label htmlFor="color">Color</Label>
                <Input
                  id="color"
                  type="color"
                  value={formData.color}
                  onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                  className="h-10"
                />
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSubmit} disabled={!formData.title.trim()}>
                {editingMilestone ? 'Update' : 'Create'} Milestone
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Milestones Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {milestones.map(milestone => (
          <Card key={milestone.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  {getTypeIcon(milestone.type)}
                  <CardTitle className="text-lg">{milestone.title}</CardTitle>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleMilestoneCompletion(milestone)}
                  className={cn(
                    "h-6 w-6 p-0",
                    milestone.completed && "text-green-600"
                  )}
                >
                  <Check className="h-4 w-4" />
                </Button>
              </div>
              <CardDescription className="text-sm">
                {milestone.description}
              </CardDescription>
            </CardHeader>

            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {format(new Date(milestone.targetDate), 'MMM d, yyyy')}
                  </span>
                  <Badge variant={getTypeColor(milestone.type)} className="text-xs">
                    {milestone.type}
                  </Badge>
                </div>

                <div>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span>Progress</span>
                    <span>{getMilestoneProgress(milestone)}%</span>
                  </div>
                  <Progress value={getMilestoneProgress(milestone)} className="h-2" />
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(milestone)}
                    className="flex-1"
                  >
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onDeleteMilestone(milestone.id)}
                    className="flex-1 text-destructive hover:text-destructive"
                  >
                    Delete
                  </Button>
                </div>
              </div>

              {milestone.completed && milestone.completedDate && (
                <div className="mt-3 pt-3 border-t">
                  <p className="text-xs text-muted-foreground">
                    Completed on {format(new Date(milestone.completedDate), 'MMM d, yyyy')}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        ))}

        {milestones.length === 0 && (
          <div className="col-span-full text-center py-12">
            <Target className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No Milestones Yet</h3>
            <p className="text-muted-foreground mb-4">
              Create milestones to track key achievements in the onboarding process.
            </p>
            <Button onClick={() => setIsDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Your First Milestone
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MilestoneManager;
