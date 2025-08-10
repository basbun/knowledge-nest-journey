
import { Topic } from '@/types';
import TopicCard from './TopicCard';
import CategoryHeader from './CategoryHeader';
import { GripVertical } from 'lucide-react';
import { useState } from 'react';

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
  const categoryTopics = topics.filter(topic => topic.categoryId === categoryId || topic.category === categoryName || topic.category === categoryId);

  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragStart = (e: React.DragEvent, topic: Topic) => {
    // Set drag data
    e.dataTransfer.setData('text/plain', topic.id);
    e.dataTransfer.effectAllowed = 'move';
    
    // Use inner card element for clean drag image
    const dragElement = e.currentTarget as HTMLElement;
    const cardEl = dragElement.querySelector('.learning-card') as HTMLElement | null;
    const targetEl = cardEl ?? dragElement;
    const rect = targetEl.getBoundingClientRect();

    // Align drag image with cursor position within the card
    const clientX = (e as any).clientX ?? e.nativeEvent.clientX;
    const clientY = (e as any).clientY ?? e.nativeEvent.clientY;
    const offsetX = Math.max(0, Math.min(rect.width, clientX - rect.left));
    const offsetY = Math.max(0, Math.min(rect.height, clientY - rect.top));

    e.dataTransfer.setDragImage(targetEl, offsetX, offsetY);

    // Prevent hover transforms during dragging
    document.body.classList.add('dragging');

    onDragStart(topic);
  };

  const handleDragEnd = () => {
    document.body.classList.remove('dragging');
  };
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setIsDragOver(true);
    onDragOver(e);
  };

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    onDrop(categoryId);
  };
  return (
    <div 
      key={categoryId} 
      className={`mb-8 ${isDragOver ? 'bg-hub-primary/5 rounded-xl transition-colors' : ''}`} 
      onDragOver={handleDragOver}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <CategoryHeader 
        categoryId={categoryId} 
        categoryName={categoryName} 
        isActive={isActive} 
        topicCount={categoryTopics.length}
        onAction={onCategoryAction} 
        onDelete={onDeleteCategory} 
      />
      
      {isActive && (
        <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 ${isDragOver ? 'p-2 border-2 border-dashed border-hub-primary/40 rounded-lg' : ''}`}>
          <>
            {isDragOver && (
              <div className="col-span-3 py-3 rounded-md border-2 border-dashed border-hub-primary/40 bg-hub-primary/5 text-center text-sm text-hub-text">
                Drop to move here
              </div>
            )}
            {categoryTopics.length > 0 ? (
              categoryTopics.map(topic => (
                <div 
                  key={topic.id} 
                  className="relative group"
                  draggable
                  onDragStart={(e) => handleDragStart(e, topic)}
                  onDragEnd={handleDragEnd}
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
          </>
        </div>
      )}
    </div>
  );
};

export default CategoryItem;
