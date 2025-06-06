
import { Topic } from '@/types';
import TopicCard from './TopicCard';
import CategoryHeader from './CategoryHeader';
import { GripVertical } from 'lucide-react';

interface CategoryItemProps {
  categoryId: string;
  categoryName: string;
  topics: Topic[];
  isActive: boolean;
  onTopicClick: (topic: Topic) => void;
  onCategoryAction: (categoryId: string, action: 'up' | 'down' | 'toggle') => void;
  onDeleteCategory: (categoryId: string) => void;
  onDragStart: (topic: Topic) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (categoryId: string) => void;
}

const CategoryItem = ({
  categoryId,
  categoryName,
  topics,
  isActive,
  onTopicClick,
  onCategoryAction,
  onDeleteCategory,
  onDragStart,
  onDragOver,
  onDrop
}: CategoryItemProps) => {
  // Filter topics that belong to this category
  const categoryTopics = topics.filter(topic => topic.category === categoryName || topic.category === categoryId);

  const handleDragStart = (e: React.DragEvent, topic: Topic) => {
    // Set drag data
    e.dataTransfer.setData('text/plain', topic.id);
    e.dataTransfer.effectAllowed = 'move';
    
    // Create a clean drag image
    const dragElement = e.currentTarget as HTMLElement;
    const rect = dragElement.getBoundingClientRect();
    
    // Set the drag image to just the card being dragged
    e.dataTransfer.setDragImage(dragElement, rect.width / 2, rect.height / 2);
    
    onDragStart(topic);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    onDragOver(e);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    onDrop(categoryId);
  };

  return (
    <div 
      key={categoryId} 
      className="mb-8" 
      onDragOver={handleDragOver} 
      onDrop={handleDrop}
    >
      <CategoryHeader 
        categoryId={categoryId} 
        categoryName={categoryName} 
        isActive={isActive} 
        onAction={onCategoryAction} 
        onDelete={onDeleteCategory} 
      />
      
      {isActive && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {categoryTopics.length > 0 ? (
            categoryTopics.map(topic => (
              <div 
                key={topic.id} 
                className="relative group"
                draggable
                onDragStart={(e) => handleDragStart(e, topic)}
              >
                <div className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <div className="bg-white/90 backdrop-blur-sm rounded-md p-1 shadow-sm border">
                    <GripVertical className="h-4 w-4 text-gray-500 cursor-grab active:cursor-grabbing" />
                  </div>
                </div>
                <div className="group-hover:shadow-lg transition-shadow duration-200">
                  <TopicCard 
                    topic={topic} 
                    onClick={onTopicClick} 
                    className="h-full cursor-pointer" 
                  />
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-3 py-4 text-center text-hub-text-muted">
              No topics in this category
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CategoryItem;
