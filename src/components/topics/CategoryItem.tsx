import { Topic } from '@/types';
import TopicCard from './TopicCard';
import CategoryHeader from './CategoryHeader';
import { MoveVertical } from 'lucide-react';
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
  // Check both category name and category ID to ensure we catch all matches
  const categoryTopics = topics.filter(topic => topic.category === categoryName || topic.category === categoryId);
  return <div key={categoryId} className="mb-8" onDragOver={onDragOver} onDrop={() => onDrop(categoryId)}>
      <CategoryHeader categoryId={categoryId} categoryName={categoryName} isActive={isActive} onAction={onCategoryAction} onDelete={onDeleteCategory} />
      
      {isActive && <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {categoryTopics.length > 0 ? categoryTopics.map(topic => <div key={topic.id} draggable onDragStart={() => onDragStart(topic)} className="relative">
                <div className="absolute top-2 right-2 z-10 cursor-grab hover:scale-110 transition-transform">
                  
                </div>
                <TopicCard topic={topic} onClick={onTopicClick} className="h-full" />
              </div>) : <div className="col-span-3 py-4 text-center text-hub-text-muted">
              No topics in this category
            </div>}
        </div>}
    </div>;
};
export default CategoryItem;