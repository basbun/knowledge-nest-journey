import { useState } from 'react';
import { useLearning } from '@/context/LearningContext';
import { Topic } from '@/types';
import { Button } from '@/components/ui/button';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { formatDistanceToNow } from 'date-fns';
import { cn } from '@/lib/utils';
import { Pencil, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { useIsMobile } from '@/hooks/use-mobile';
import StatusBadge from './StatusBadge';
import TopicProgress from './TopicProgress';
import TopicTabs from './TopicTabs';
interface TopicDetailsProps {
  topic: Topic;
  onEdit: () => void;
}
const TopicDetails = ({
  topic,
  onEdit
}: TopicDetailsProps) => {
  const {
    deleteTopic
  } = useLearning();
  const [isDeleting, setIsDeleting] = useState(false);
  const isMobile = useIsMobile();
  const handleDelete = () => {
    deleteTopic(topic.id);
    toast.success('Topic deleted successfully');
    setIsDeleting(false);
  };
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Not set';
    return new Date(dateString).toLocaleDateString();
  };
  const getRelativeTimeFromNow = (dateString: string) => {
    return formatDistanceToNow(new Date(dateString), {
      addSuffix: true
    });
  };
  return <div className={`space-y-4 ${isMobile ? 'px-0' : 'px-4'}`}>
      <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-6">
        <div>
          <div className="flex flex-col md:flex-row md:items-center gap-3">
            <h2 className="text-xl md:text-2xl font-bold text-hub-text">{topic.title}</h2>
            <StatusBadge status={topic.status} />
          </div>
          
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={onEdit} className="flex items-center">
            <Pencil className="h-4 w-4 mr-1" /> Edit
          </Button>
          <AlertDialog open={isDeleting} onOpenChange={setIsDeleting}>
            <AlertDialogTrigger asChild>
              <Button variant="outline" size="sm" className="flex items-center text-destructive border-destructive hover:bg-destructive/10 hover:text-destructive">
                <Trash2 className="h-4 w-4 mr-1" /> Delete
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will permanently delete the topic "{topic.title}" and all associated 
                  learning methods, journal entries, and resources.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete} className="bg-red-500 hover:bg-red-600">
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      <div className="bg-card rounded-lg p-4 mb-6 border border-hub-border"> {/* Changed bg-white to bg-card */}
        <div className="mb-4">
          <h3 className="text-sm font-medium text-hub-text-muted mb-1">Description</h3>
          <p className="text-hub-text">{topic.description || 'No description provided.'}</p>
        </div>
        
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <h3 className="text-sm font-medium text-hub-text-muted mb-1">Start Date</h3>
            <p className="text-hub-text">{formatDate(topic.startDate)}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-hub-text-muted mb-1">Target End Date</h3>
            <p className="text-hub-text">{formatDate(topic.targetEndDate)}</p>
          </div>
        </div>
        
        <TopicProgress progress={topic.progress} className="mb-2" />
        
        <div className="mt-4 text-xs text-hub-text-muted">
          <p>Last updated {getRelativeTimeFromNow(topic.updatedAt)}</p>
        </div>
      </div>

      <TopicTabs topicId={topic.id} />
    </div>;
};
export default TopicDetails;