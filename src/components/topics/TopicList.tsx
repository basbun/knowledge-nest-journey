
import { useState } from 'react';
import TopicCard from './TopicCard';
import { useLearning } from '@/context/LearningContext';
import { Topic } from '@/types';
import { Button } from '@/components/ui/button';
import { PlusIcon } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import TopicDetails from './TopicDetails';
import TopicForm from './TopicForm';

const TopicList = () => {
  const { topics } = useLearning();
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

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
    // If we were editing, go back to details view
    if (isEditMode && selectedTopic) {
      setIsDetailsOpen(true);
    }
  };

  const categories = [...new Set(topics.map(topic => topic.category))];

  return (
    <div>
      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-2xl font-bold text-hub-text">Learning Topics</h2>
        <Button 
          onClick={handleAddTopic}
          className="bg-hub-primary hover:bg-hub-primary/90"
        >
          <PlusIcon className="mr-2 h-4 w-4" /> Add Topic
        </Button>
      </div>

      {categories.map((category) => (
        <div key={category} className="mb-8">
          <h3 className="text-xl font-semibold text-hub-text mb-4">{category}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {topics
              .filter((topic) => topic.category === category)
              .map((topic) => (
                <TopicCard key={topic.id} topic={topic} onClick={handleTopicClick} />
              ))}
          </div>
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

      {/* Topic Details Dialog */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="sm:max-w-[600px]">
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

      {/* Topic Form Dialog */}
      <Dialog open={isFormOpen} onOpenChange={handleFormClose}>
        <DialogContent className="sm:max-w-[600px]">
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
