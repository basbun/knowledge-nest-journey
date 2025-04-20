
import { useState } from 'react';
import { useLearning } from '@/context/LearningContext';
import { LearningMethod } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

interface MethodFormProps {
  topicId: string;
  method?: LearningMethod | null;
  onClose: () => void;
}

const MethodForm = ({ topicId, method, onClose }: MethodFormProps) => {
  const { addMethod, updateMethod } = useLearning();
  
  const [title, setTitle] = useState(method?.title || '');
  const [type, setType] = useState(method?.type || '');
  const [link, setLink] = useState(method?.link || '');
  const [timeSpent, setTimeSpent] = useState<number | undefined>(method?.timeSpent);
  const [newType, setNewType] = useState('');
  const [showNewType, setShowNewType] = useState(false);

  const methodTypes = [
    'Online Course',
    'Book',
    'Video Tutorial',
    'Documentation',
    'Personal Project',
    'Practice Exercises',
    'Mentorship',
    'Workshop',
    'Podcast',
    'Blog Article',
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validations
    if (!title.trim()) {
      toast.error('Please enter a title');
      return;
    }
    
    const finalType = showNewType ? newType : type;
    if (!finalType) {
      toast.error('Please select or create a type');
      return;
    }
    
    if (method) {
      // Update existing method
      updateMethod(method.id, {
        title,
        type: finalType,
        link: link || undefined,
        timeSpent: timeSpent,
      });
      toast.success('Learning method updated successfully');
    } else {
      // Add new method
      addMethod({
        topicId,
        title,
        type: finalType,
        link: link || undefined,
        timeSpent: timeSpent,
      });
      toast.success('Learning method added successfully');
    }
    
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter method title"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="type">Type</Label>
        {!showNewType ? (
          <div className="flex gap-2">
            <Select
              value={type}
              onValueChange={setType}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a type" />
              </SelectTrigger>
              <SelectContent>
                {methodTypes.map((t) => (
                  <SelectItem key={t} value={t}>
                    {t}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setShowNewType(true)}
            >
              New
            </Button>
          </div>
        ) : (
          <div className="flex gap-2">
            <Input
              id="newType"
              value={newType}
              onChange={(e) => setNewType(e.target.value)}
              placeholder="Enter new type"
            />
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setShowNewType(false)}
            >
              Cancel
            </Button>
          </div>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="link">Link (optional)</Label>
        <Input
          id="link"
          value={link}
          onChange={(e) => setLink(e.target.value)}
          placeholder="Enter resource link"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="timeSpent">Time Spent (hours, optional)</Label>
        <Input
          id="timeSpent"
          type="number"
          value={timeSpent === undefined ? '' : timeSpent}
          onChange={(e) => setTimeSpent(e.target.value ? Number(e.target.value) : undefined)}
          placeholder="Enter time spent in hours"
          min="0"
          step="0.5"
        />
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" className="bg-hub-primary hover:bg-hub-primary/90">
          {method ? 'Update Method' : 'Add Method'}
        </Button>
      </div>
    </form>
  );
};

export default MethodForm;
