
import { useState, useMemo } from 'react';
import { useLearning } from '@/context/LearningContext';
import { JournalEntry } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { Tag } from 'lucide-react';

interface JournalFormProps {
  topicId: string;
  journal?: JournalEntry | null;
  onClose: () => void;
}

const JournalForm = ({ topicId, journal, onClose }: JournalFormProps) => {
  const { addJournal, updateJournal, journals } = useLearning();
  
  const [content, setContent] = useState(journal?.content || '');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>(journal?.tags || []);
  const [isTagPopoverOpen, setIsTagPopoverOpen] = useState(false);

  // Get all existing tags from all journals with null/undefined checks
  const existingTags = useMemo(() => {
    const allTags = new Set<string>();
    if (journals && Array.isArray(journals)) {
      journals.forEach(journal => {
        if (journal && journal.tags && Array.isArray(journal.tags)) {
          journal.tags.forEach(tag => {
            if (tag) allTags.add(tag);
          });
        }
      });
    }
    return Array.from(allTags);
  }, [journals]);

  // Filter suggestions based on input - with additional safety checks
  const suggestedTags = useMemo(() => {
    if (!tagInput) return existingTags || [];
    if (!existingTags || !Array.isArray(existingTags)) return [];
    if (!tags || !Array.isArray(tags)) return existingTags;
    
    return existingTags.filter(tag => 
      tag && tag.toLowerCase().includes(tagInput.toLowerCase()) &&
      !tags.includes(tag)
    );
  }, [tagInput, existingTags, tags]);

  const handleAddTag = (newTag: string) => {
    if (newTag && newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setTagInput('');
      setIsTagPopoverOpen(false);
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleTagInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      handleAddTag(tagInput);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!content.trim()) {
      toast.error('Please enter some content');
      return;
    }
    
    if (journal) {
      updateJournal(journal.id, {
        content,
        tags: tags || [],
      });
      toast.success('Journal entry updated successfully');
    } else {
      addJournal({
        topicId,
        content,
        tags: tags || [],
      });
      toast.success('Journal entry added successfully');
    }
    
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="content">Journal Entry</Label>
        <Textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write your thoughts, insights, or questions..."
          rows={6}
          className="resize-none"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="tags">Tags</Label>
        <div className="flex gap-2">
          <Input
            id="tags"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={handleTagInputKeyDown}
            placeholder="Add tags..."
            className="flex-1"
          />
          <Button 
            type="button" 
            variant="outline"
            onClick={() => handleAddTag(tagInput)}
            className="flex items-center gap-2"
          >
            <Tag className="h-4 w-4" />
            Add
          </Button>
        </div>
        
        {tags && tags.length > 0 && (
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

      <div className="flex justify-end space-x-2 pt-4">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" className="bg-hub-primary hover:bg-hub-primary/90">
          {journal ? 'Update Entry' : 'Add Entry'}
        </Button>
      </div>
    </form>
  );
};

export default JournalForm;
