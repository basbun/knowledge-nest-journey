
import { useState, useMemo } from 'react';
import { useLearning } from '@/context/LearningContext';
import { Resource } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { Tag } from 'lucide-react';

interface ResourceFormProps {
  topicId: string;
  resource?: Resource | null;
  onClose: () => void;
}

const ResourceForm = ({ topicId, resource, onClose }: ResourceFormProps) => {
  const { addResource, updateResource, resources } = useLearning();
  
  const [title, setTitle] = useState(resource?.title || '');
  const [url, setUrl] = useState(resource?.url || '');
  const [notes, setNotes] = useState(resource?.notes || '');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>(resource?.tags || []);
  const [isTagPopoverOpen, setIsTagPopoverOpen] = useState(false);

  // Get all existing tags from all resources with null/undefined checks
  const existingTags = useMemo(() => {
    const allTags = new Set<string>();
    if (resources && Array.isArray(resources)) {
      resources.forEach(resource => {
        if (resource && resource.tags && Array.isArray(resource.tags)) {
          resource.tags.forEach(tag => {
            if (tag) allTags.add(tag);
          });
        }
      });
    }
    return Array.from(allTags);
  }, [resources]);

  // Filter suggestions based on input
  const suggestedTags = useMemo(() => {
    if (!tagInput) return existingTags;
    return existingTags.filter(tag => 
      tag.toLowerCase().includes(tagInput.toLowerCase()) &&
      !tags.includes(tag)
    );
  }, [tagInput, existingTags, tags]);

  const handleAddTag = (newTag: string) => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setTagInput('');
      setIsTagPopoverOpen(false);
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      toast.error('Please enter a title');
      return;
    }
    
    if (resource) {
      updateResource(resource.id, {
        title,
        url: url || undefined,
        notes: notes || undefined,
        tags,
      });
      toast.success('Resource updated successfully');
    } else {
      addResource({
        topicId,
        title,
        url: url || undefined,
        notes: notes || undefined,
        tags,
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
        <Label htmlFor="tags">Tags</Label>
        <Popover open={isTagPopoverOpen} onOpenChange={setIsTagPopoverOpen}>
          <PopoverTrigger asChild>
            <div className="flex gap-2">
              <Input
                id="tags"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                placeholder="Add tags..."
                className="flex-1"
              />
              <Button 
                type="button" 
                variant="outline"
                className="flex items-center gap-2"
              >
                <Tag className="h-4 w-4" />
                Add
              </Button>
            </div>
          </PopoverTrigger>
          <PopoverContent className="p-0" align="start">
            <Command>
              <CommandInput placeholder="Search tags..." />
              <CommandEmpty>No tags found.</CommandEmpty>
              <CommandGroup>
                {suggestedTags.map((tag) => (
                  <CommandItem
                    key={tag}
                    onSelect={() => handleAddTag(tag)}
                    className="cursor-pointer"
                  >
                    {tag}
                  </CommandItem>
                ))}
              </CommandGroup>
            </Command>
          </PopoverContent>
        </Popover>
        
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {tags.map((tag, index) => (
              <Badge 
                key={index} 
                variant="secondary" 
                className="flex items-center gap-1"
              >
                {tag}
                <button
                  type="button"
                  onClick={() => handleRemoveTag(tag)}
                  className="text-xs rounded-full hover:bg-gray-200 h-4 w-4 inline-flex items-center justify-center"
                >
                  ✕
                </button>
              </Badge>
            ))}
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
