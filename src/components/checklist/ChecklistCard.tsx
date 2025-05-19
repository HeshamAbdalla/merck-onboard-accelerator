
import React, { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Check, FileText, MessageSquare, X } from 'lucide-react';
import { ChecklistItem } from '@/types/checklist';
import { useChecklist } from '@/context/ChecklistContext';

interface ChecklistCardProps {
  item: ChecklistItem;
}

const ChecklistCard: React.FC<ChecklistCardProps> = ({ item }) => {
  const { toggleItemCompletion, addComment, removeTask, currentRole } = useChecklist();
  const [comment, setComment] = useState('');
  const [isCommenting, setIsCommenting] = useState(false);

  // Due date styling based on urgency
  const getDueDateStyle = () => {
    switch (item.suggestedDueDate) {
      case 'First day':
      case 'First week':
        return 'bg-red-100 text-red-800';
      case 'Month 1':
        return 'bg-amber-100 text-amber-800';
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };

  const handleCommentSubmit = () => {
    if (comment.trim()) {
      addComment(item.id, comment);
      setComment('');
      setIsCommenting(false);
    }
  };

  const canEdit = currentRole === 'HR Admin' || 
    (currentRole === 'Manager' && (item.owner === 'Manager' || item.responsibility === 'Local')) ||
    (currentRole === 'Buddy' && item.owner === 'Buddy');

  return (
    <Card className={`transition-all duration-200 border-l-4 ${
      item.completed 
        ? 'border-l-green-500 bg-green-50' 
        : 'border-l-merck-purple hover:shadow-md'
    }`}>
      <CardHeader className="pb-2 flex flex-row items-start justify-between">
        <div className="flex items-start gap-2">
          <Checkbox 
            checked={item.completed} 
            onCheckedChange={() => canEdit && toggleItemCompletion(item.id)} 
            disabled={!canEdit}
            className="mt-1"
          />
          <div>
            <h3 className={`font-semibold text-base ${item.completed ? 'line-through text-gray-500' : ''}`}>
              {item.title}
            </h3>
            <p className="text-sm text-gray-600">{item.description}</p>
          </div>
        </div>
        {currentRole === 'HR Admin' && (
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <X className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Remove Task</DialogTitle>
                <DialogDescription>
                  Are you sure you want to remove this task from the checklist? This action cannot be undone.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button variant="outline" onClick={() => document.getElementById('close-dialog')?.click()}>
                  Cancel
                </Button>
                <Button 
                  variant="destructive" 
                  onClick={() => {
                    removeTask(item.id);
                    document.getElementById('close-dialog')?.click();
                  }}
                >
                  Remove Task
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2 mt-1 mb-3">
          <Badge variant="outline" className="bg-merck-purple-light bg-opacity-10 text-merck-purple">
            {item.phase}
          </Badge>
          <Badge variant="outline" className="bg-gray-100">
            {item.owner}
          </Badge>
          <Badge variant="outline" className="bg-purple-100 text-purple-800">
            {item.responsibility}
          </Badge>
          <Badge variant="outline" className={getDueDateStyle()}>
            {item.suggestedDueDate}
          </Badge>
        </div>

        {item.comments && (
          <div className="text-sm bg-gray-50 p-2 rounded-md mt-2 mb-1">
            <div className="flex items-center gap-1 text-gray-600 mb-1">
              <MessageSquare className="h-3.5 w-3.5" />
              <span className="text-xs font-medium">Comments:</span>
            </div>
            <p className="whitespace-pre-line">{item.comments}</p>
          </div>
        )}
      </CardContent>

      {canEdit && (
        <CardFooter className="pt-0">
          {isCommenting ? (
            <div className="flex flex-col w-full gap-2">
              <Textarea 
                placeholder="Add your comment..." 
                value={comment} 
                onChange={(e) => setComment(e.target.value)}
                className="min-h-[80px]"
              />
              <div className="flex justify-end gap-2">
                <Button variant="outline" size="sm" onClick={() => setIsCommenting(false)}>
                  Cancel
                </Button>
                <Button size="sm" onClick={handleCommentSubmit}>
                  Add Comment
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                className="flex gap-1" 
                onClick={() => setIsCommenting(true)}
              >
                <MessageSquare className="h-3.5 w-3.5" />
                <span>Comment</span>
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="flex gap-1"
              >
                <FileText className="h-3.5 w-3.5" />
                <span>Attach</span>
              </Button>
              <Button 
                variant={item.completed ? "outline" : "default"} 
                size="sm" 
                className="flex gap-1 ml-auto" 
                onClick={() => toggleItemCompletion(item.id)}
              >
                {item.completed ? (
                  <>
                    <X className="h-3.5 w-3.5" />
                    <span>Mark Incomplete</span>
                  </>
                ) : (
                  <>
                    <Check className="h-3.5 w-3.5" />
                    <span>Complete</span>
                  </>
                )}
              </Button>
            </div>
          )}
        </CardFooter>
      )}
    </Card>
  );
};

export default ChecklistCard;
