
import { useState } from 'react';
import { useLearning } from '@/context/LearningContext';
import { Resource } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

interface ResourceFormProps {
  topicId: string;
  resource?: Resource | null;
  onClose: () => void;
}

const ResourceForm = ({ topicId, resource, onClose }: ResourceFormProps) => {
  const { addResource, updateResource } = useLearning();
  
  const [title, setTitle] = useState(resource?.title || '');
  const [type, setType] = useState(resource?.type || '');
  const [url, setUrl] = useState(resource?.url || '');
  const [notes, setNotes] = useState(resource?.notes || '');
  const [newType, setNewType] = useState('');
  const [showNewType, setShowNewType] = useState(false);

  const resourceTypes = [
    'Article',
    'Tutorial',
    'Documentation',
    'Video',
    'Book',
    'Podcast',
    'Course',
    'Code Example',
    'Tool',
    'Reference',
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
    
    if (resource) {
      // Update existing resource
      updateResource(resource.id, {
        title,
        type: finalType,
        url: url || undefined,
        notes: notes || undefined,
      });
      toast.success('Resource updated successfully');
    } else {
      // Add new resource
      addResource({
        topicId,
        title,
        type: finalType,
        url: url || undefined,
        notes: notes || undefined,
      });
      toast.success('Resource added successfully');
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
          placeholder="Enter resource title"
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
                {resourceTypes.map((t) => (
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
        <Label htmlFor="url">URL (optional)</Label>
        <Input
          id="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Enter resource URL"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">Notes (optional)</Label>
        <Textarea
          id="notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Enter any notes about this resource"
          rows={3}
        />
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" className="bg-hub-primary hover:bg-hub-primary/90">
          {resource ? 'Update Resource' : 'Add Resource'}
        </Button>
      </div>
    </form>
  );
};

export default ResourceForm;
