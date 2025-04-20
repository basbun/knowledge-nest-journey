
import { useState, useEffect } from 'react';
import { useLearning } from '@/context/LearningContext';
import { Topic, TopicStatus } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { toast } from 'sonner';

interface TopicFormProps {
  topic?: Topic | null;
  onClose: () => void;
}

const TopicForm = ({ topic, onClose }: TopicFormProps) => {
  const { addTopic, updateTopic, topics } = useLearning();
  
  const [title, setTitle] = useState(topic?.title || '');
  const [description, setDescription] = useState(topic?.description || '');
  const [category, setCategory] = useState(topic?.category || '');
  const [status, setStatus] = useState<TopicStatus>(topic?.status || 'Not Started');
  const [progress, setProgress] = useState(topic?.progress || 0);
  const [startDate, setStartDate] = useState(topic?.startDate || '');
  const [targetEndDate, setTargetEndDate] = useState(topic?.targetEndDate || '');
  const [newCategory, setNewCategory] = useState('');
  const [showNewCategory, setShowNewCategory] = useState(false);

  // Get existing categories
  const existingCategories = [...new Set(topics.map(t => t.category))];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validations
    if (!title.trim()) {
      toast.error('Please enter a topic title');
      return;
    }
    
    const finalCategory = showNewCategory ? newCategory : category;
    
    if (!finalCategory) {
      toast.error('Please select or create a category');
      return;
    }
    
    if (topic) {
      // Update existing topic
      updateTopic(topic.id, {
        title,
        description,
        category: finalCategory,
        status,
        progress,
        startDate: startDate || undefined,
        targetEndDate: targetEndDate || undefined,
      });
      toast.success('Topic updated successfully');
    } else {
      // Add new topic
      addTopic({
        title,
        description,
        category: finalCategory,
        status,
        progress,
        startDate: startDate || undefined,
        targetEndDate: targetEndDate || undefined,
      });
      toast.success('Topic added successfully');
    }
    
    onClose();
  };

  const statuses: TopicStatus[] = ['Not Started', 'In Progress', 'Completed'];

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter topic title"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Enter topic description"
          rows={3}
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
                {existingCategories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setShowNewCategory(true)}
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
        <Label htmlFor="status">Status</Label>
        <Select
          value={status}
          onValueChange={(value) => setStatus(value as TopicStatus)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            {statuses.map((status) => (
              <SelectItem key={status} value={status}>
                {status}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between">
          <Label htmlFor="progress">Progress: {progress}%</Label>
        </div>
        <Slider
          id="progress"
          value={[progress]}
          min={0}
          max={100}
          step={5}
          onValueChange={(value) => setProgress(value[0])}
          className="py-4"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="startDate">Start Date</Label>
          <Input
            id="startDate"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="targetEndDate">Target End Date</Label>
          <Input
            id="targetEndDate"
            type="date"
            value={targetEndDate}
            onChange={(e) => setTargetEndDate(e.target.value)}
          />
        </div>
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" className="bg-hub-primary hover:bg-hub-primary/90">
          {topic ? 'Update Topic' : 'Add Topic'}
        </Button>
      </div>
    </form>
  );
};

export default TopicForm;
