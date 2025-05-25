
import { Topic } from '@/types';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';
import StatusBadge from './StatusBadge';
import TopicProgress from './TopicProgress';

interface TopicCardProps {
  topic: Topic;
  onClick: (topic: Topic) => void;
  className?: string;
}

const TopicCard = ({ topic, onClick, className }: TopicCardProps) => {
  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString();
  };

  const getRelativeTimeFromNow = (dateString: string) => {
    return formatDistanceToNow(new Date(dateString), { addSuffix: true });
  };

  return (
    <div 
      className={cn(
        "learning-card cursor-pointer hover:transform hover:scale-[1.02] transition-all flex flex-col",
        "h-full border border-gray-200 rounded-lg p-4 bg-white shadow-sm",
        "select-none", // Prevent text selection during drag
        className
      )}
      onClick={() => onClick(topic)}
    >
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-semibold text-lg text-hub-text flex-grow truncate">{topic.title}</h3>
        <StatusBadge status={topic.status} />
      </div>
      
      <p className="text-hub-text-muted text-sm mb-4 line-clamp-2 flex-grow">{topic.description}</p>
      
      <div className="mt-auto">
        <TopicProgress progress={topic.progress} />
        
        <div className="flex justify-between text-xs text-hub-text-muted mt-4">
          <span>Updated {getRelativeTimeFromNow(topic.updatedAt)}</span>
        </div>
        
        {(topic.startDate || topic.targetEndDate) && (
          <div className="flex justify-between text-xs text-hub-text-muted mt-2">
            {topic.startDate && <span>Start: {formatDate(topic.startDate)}</span>}
            {topic.targetEndDate && <span>Target: {formatDate(topic.targetEndDate)}</span>}
          </div>
        )}
      </div>
    </div>
  );
};

export default TopicCard;
