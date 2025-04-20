
import { useState } from 'react';
import TopicCard from './TopicCard';
import { useLearning } from '@/context/LearningContext';
import { Topic } from '@/types';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { PlusIcon, ArrowUp, ArrowDown } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import TopicDetails from './TopicDetails';
import TopicForm from './TopicForm';
import { useIsMobile } from '@/hooks/use-mobile';
import { toast } from 'sonner';

const TopicList = () => {
  const { 
    topics, 
    categories,
    reorderCategory,
    toggleCategoryActive,
    addCategory,
    deleteCategory 
  } = useLearning();
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const isMobile = useIsMobile();

  const handleTopicClick = (topic: Topic) => {
    setSelectedTopic(topic);
    setIsDetailsOpen(true);
  };

  const handleAddTopic = () => {
    setSelectedTopic(null);
    setIsEditMode(false);
    setIsFormOpen(true);
  };

  const handleEditTopic = (topic: Topic) => {
    setSelectedTopic(topic);
    setIsEditMode(true);
    setIsDetailsOpen(false);
    setIsFormOpen(true);
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    if (isEditMode && selectedTopic) {
      setIsDetailsOpen(true);
    }
  };

  const handleCategoryAction = (categoryId: string, action: 'up' | 'down' | 'toggle') => {
    if (action === 'toggle') {
      toggleCategoryActive(categoryId);
    } else {
      reorderCategory(categoryId, action);
    }
  };

  const handleAddCategory = () => {
    if (newCategoryName.trim()) {
      addCategory(newCategoryName.trim());
      setNewCategoryName('');
    }
  };

  const handleDeleteCategory = (categoryId: string) => {
    try {
      deleteCategory(categoryId);
      toast.success("Category deleted successfully");
    } catch (error) {
      toast.error("Cannot delete category with existing topics");
    }
  };

  const sortedCategories = [...categories].sort((a, b) => a.order - b.order);

  return (
    <div>
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold text-hub-text">Learning Topics</h2>
        <Button 
          onClick={handleAddTopic}
          className="bg-hub-primary hover:bg-hub-primary/90 w-full sm:w-auto"
        >
          <PlusIcon className="mr-2 h-4 w-4" /> Add Topic
        </Button>
      </div>

      <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <input
          type="text"
          value={newCategoryName}
          onChange={(e) => setNewCategoryName(e.target.value)}
          placeholder="New category name"
          className="px-3 py-2 border rounded-md w-full sm:w-auto"
        />
        <Button 
          onClick={handleAddCategory}
          variant="outline"
          className="w-full sm:w-auto"
        >
          Add Category
        </Button>
      </div>

      {sortedCategories.map((category) => (
        <div key={category.id} className="mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
            <div className="flex items-center gap-4 w-full sm:w-auto">
              <h3 className="text-xl font-semibold text-hub-text">{category.name}</h3>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleCategoryAction(category.id, 'up')}
                >
                  <ArrowUp className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleCategoryAction(category.id, 'down')}
                >
                  <ArrowDown className="h-4 w-4" />
                </Button>
                <Switch
                  checked={category.isActive}
                  onCheckedChange={() => handleCategoryAction(category.id, 'toggle')}
                />
              </div>
            </div>
          </div>
          
          {category.isActive && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 grid-rows-[auto]">
              {topics
                .filter((topic) => topic.category === category.id)
                .map((topic) => (
                  <TopicCard 
                    key={topic.id} 
                    topic={topic} 
                    onClick={handleTopicClick} 
                    className="h-full" 
                  />
                ))}
            </div>
          )}
        </div>
      ))}

      {topics.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="text-hub-text-muted mb-4">
            You haven't added any learning topics yet.
          </div>
          <Button 
            onClick={handleAddTopic}
            className="bg-hub-primary hover:bg-hub-primary/90"
          >
            <PlusIcon className="mr-2 h-4 w-4" /> Add Your First Topic
          </Button>
        </div>
      )}

      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className={`${isMobile ? 'w-[95vw] p-4' : 'sm:max-w-[600px]'} overflow-y-auto max-h-[90vh]`}>
          <DialogHeader>
            <DialogTitle>Topic Details</DialogTitle>
          </DialogHeader>
          {selectedTopic && (
            <TopicDetails 
              topic={selectedTopic} 
              onEdit={() => handleEditTopic(selectedTopic)} 
            />
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={isFormOpen} onOpenChange={handleFormClose}>
        <DialogContent className={`${isMobile ? 'w-[95vw] p-4' : 'sm:max-w-[600px]'} overflow-y-auto max-h-[90vh]`}>
          <DialogHeader>
            <DialogTitle>{isEditMode ? 'Edit Topic' : 'Add New Topic'}</DialogTitle>
          </DialogHeader>
          <TopicForm 
            topic={isEditMode ? selectedTopic : undefined} 
            onClose={handleFormClose} 
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TopicList;
