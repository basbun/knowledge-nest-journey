
import { useLearning } from '@/context/LearningContext';
import { Topic } from '@/types';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';

interface TopicCardProps {
  topic: Topic;
  onClick: (topic: Topic) => void;
}

const TopicCard = ({ topic, onClick }: TopicCardProps) => {
  const getStatusClass = (status: string) => {
    switch (status) {
      case 'To Start':
        return 'status-to-start';
      case 'In Progress':
        return 'status-in-progress';
      case 'Learning':
        return 'status-learning';
      case 'Review':
        return 'status-review';
      case 'Completed':
        return 'status-completed';
      default:
        return 'status-to-start';
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString();
  };

  const getRelativeTimeFromNow = (dateString: string) => {
    return formatDistanceToNow(new Date(dateString), { addSuffix: true });
  };

  return (
    <div 
      className="learning-card cursor-pointer hover:transform hover:scale-[1.02] transition-all"
      onClick={() => onClick(topic)}
    >
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-semibold text-lg text-hub-text">{topic.title}</h3>
        <span className={cn('status-badge', getStatusClass(topic.status))}>
          {topic.status}
        </span>
      </div>
      
      <p className="text-hub-text-muted text-sm mb-4 line-clamp-2">{topic.description}</p>
      
      <div className="mb-2">
        <div className="flex justify-between text-xs text-hub-text-muted mb-1">
          <span>Progress</span>
          <span>{topic.progress}%</span>
        </div>
        <div className="progress-bar">
          <div className="progress-value" style={{ width: `${topic.progress}%` }}></div>
        </div>
      </div>
      
      <div className="flex justify-between text-xs text-hub-text-muted mt-4">
        <span className="bg-hub-muted px-2 py-1 rounded">{topic.category}</span>
        <span>Updated {getRelativeTimeFromNow(topic.updatedAt)}</span>
      </div>
      
      {(topic.startDate || topic.targetEndDate) && (
        <div className="flex justify-between text-xs text-hub-text-muted mt-2">
          {topic.startDate && <span>Start: {formatDate(topic.startDate)}</span>}
          {topic.targetEndDate && <span>Target: {formatDate(topic.targetEndDate)}</span>}
        </div>
      )}
    </div>
  );
};

export default TopicCard;
