
import { Topic } from '@/types';
import TopicCard from './TopicCard';
import CategoryHeader from './CategoryHeader';
import { GripVertical } from 'lucide-react';
import { useDroppable, useDraggable } from '@dnd-kit/core';
import { useMemo } from 'react';

interface CategoryItemProps {
  categoryId: string;
  categoryName: string;
  topics: Topic[];
  isActive: boolean;
  onTopicClick: (topic: Topic) => void;
  onCategoryAction: (categoryId: string, action: 'up' | 'down' | 'toggle') => void;
  onDeleteCategory: (categoryId: string) => void;
}

const CategoryItem = ({
  categoryId,
  categoryName,
  topics,
  isActive,
  onTopicClick,
  onCategoryAction,
  onDeleteCategory,
}: CategoryItemProps) => {
  // Filter topics that belong to this category
  const categoryTopics = useMemo(() => topics.filter(topic => topic.categoryId === categoryId || topic.category === categoryName || topic.category === categoryId), [topics, categoryId, categoryName]);

  const { setNodeRef, isOver } = useDroppable({ id: categoryId });

  return (
    <div 
      key={categoryId} 
      ref={setNodeRef}
      className={`mb-8 ${isOver ? 'bg-hub-primary/5 rounded-xl transition-colors' : ''}`}
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
        <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 ${isOver ? 'p-2 border-2 border-dashed border-hub-primary/40 rounded-lg' : ''}`}>
          <>
            {isOver && (
              <div className="col-span-3 py-3 rounded-md border-2 border-dashed border-hub-primary/40 bg-hub-primary/5 text-center text-sm text-hub-text">
                Drop to move here
              </div>
            )}
            {categoryTopics.length > 0 ? (
              categoryTopics.map(topic => {
                const {attributes, listeners, setNodeRef: setDragRef, transform, isDragging} = useDraggable({ id: topic.id });
                const style = transform ? { transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`, zIndex: 50 } : undefined;
                return (
                  <div 
                    key={topic.id}
                    ref={setDragRef}
                    {...attributes}
                    {...listeners}
                    style={style}
                    className="relative group"
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
                );
              })
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
