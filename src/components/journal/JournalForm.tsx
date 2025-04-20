
import { useState } from 'react';
import { useLearning } from '@/context/LearningContext';
import { JournalEntry } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';

interface JournalFormProps {
  topicId: string;
  journal?: JournalEntry | null;
  onClose: () => void;
}

const JournalForm = ({ topicId, journal, onClose }: JournalFormProps) => {
  const { addJournal, updateJournal } = useLearning();
  
  const [content, setContent] = useState(journal?.content || '');
  const [category, setCategory] = useState(journal?.category || '');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>(journal?.tags || []);
  const [newCategory, setNewCategory] = useState('');
  const [showNewCategory, setShowNewCategory] = useState(false);

  const journalCategories = [
    'Key Takeaways',
    'Problem Solving',
    'Questions',
    'Progress Update',
    'Insights',
    'Challenges',
    'Connections',
    'Reflections',
  ];

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validations
    if (!content.trim()) {
      toast.error('Please enter some content');
      return;
    }
    
    const finalCategory = showNewCategory ? newCategory : category;
    if (!finalCategory) {
      toast.error('Please select or create a category');
      return;
    }
    
    if (journal) {
      // Update existing journal
      updateJournal(journal.id, {
        content,
        category: finalCategory,
        tags,
      });
      toast.success('Journal entry updated successfully');
    } else {
      // Add new journal
      addJournal({
        topicId,
        content,
        category: finalCategory,
        tags,
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
        <Label htmlFor="category">Category</Label>
        {!showNewCategory ? (
          <div className="flex gap-2">
            <Select
              value={category}
              onValueChange={setCategory}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {journalCategories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
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
              id="newCategory"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              placeholder="Enter new category"
            />
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setShowNewCategory(false)}
            >
              Cancel
            </Button>
          </div>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="tags">Tags (optional)</Label>
        <div className="flex gap-2">
          <Input
            id="tags"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Add tags and press Enter"
          />
          <Button 
            type="button" 
            variant="outline" 
            onClick={handleAddTag}
          >
            Add
          </Button>
        </div>
        
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
