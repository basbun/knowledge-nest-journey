
import { Progress } from '@/components/ui/progress';

interface TopicProgressProps {
  progress: number;
  showLabel?: boolean;
  className?: string;
}

const TopicProgress = ({ progress, showLabel = true, className = '' }: TopicProgressProps) => {
  return (
    <div className={`space-y-1 ${className}`}>
      {showLabel && (
        <div className="flex justify-between text-sm text-hub-text-muted mb-1">
          <h3 className="font-medium">Progress</h3>
          <span>{progress}%</span>
        </div>
      )}
      <Progress value={progress} className="h-2" />
    </div>
  );
};

export default TopicProgress;
