
import { useState } from 'react';
import { useLearning } from '@/context/LearningContext';
import { Topic } from '@/types';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { formatDistanceToNow } from 'date-fns';
import MethodList from '../methods/MethodList';
import ResourceList from '../resources/ResourceList';
import JournalList from '../journal/JournalList';
import { cn } from '@/lib/utils';
import { Pencil, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

interface TopicDetailsProps {
  topic: Topic;
  onEdit: () => void;
}

const TopicDetails = ({ topic, onEdit }: TopicDetailsProps) => {
  const { deleteTopic } = useLearning();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = () => {
    deleteTopic(topic.id);
    toast.success('Topic deleted successfully');
    setIsDeleting(false);
  };

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
    if (!dateString) return 'Not set';
    return new Date(dateString).toLocaleDateString();
  };

  const getRelativeTimeFromNow = (dateString: string) => {
    return formatDistanceToNow(new Date(dateString), { addSuffix: true });
  };

  return (
    <div>
      <div className="flex justify-between items-start mb-6">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-bold text-hub-text">{topic.title}</h2>
            <span className={cn('status-badge', getStatusClass(topic.status))}>
              {topic.status}
            </span>
          </div>
          <p className="text-hub-text-muted mt-1">{topic.category}</p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onEdit}
            className="flex items-center"
          >
            <Pencil className="h-4 w-4 mr-1" /> Edit
          </Button>
          <AlertDialog open={isDeleting} onOpenChange={setIsDeleting}>
            <AlertDialogTrigger asChild>
              <Button 
                variant="outline" 
                size="sm" 
                className="flex items-center text-red-500 border-red-200 hover:bg-red-50"
              >
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

      <div className="bg-white rounded-lg p-4 mb-6 border border-hub-border">
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
        
        <div className="mb-2">
          <div className="flex justify-between text-sm text-hub-text-muted mb-1">
            <h3 className="font-medium">Progress</h3>
            <span>{topic.progress}%</span>
          </div>
          <div className="progress-bar">
            <div className="progress-value" style={{ width: `${topic.progress}%` }}></div>
          </div>
        </div>
        
        <div className="mt-4 text-xs text-hub-text-muted">
          <p>Last updated {getRelativeTimeFromNow(topic.updatedAt)}</p>
        </div>
      </div>

      <Tabs defaultValue="methods">
        <TabsList className="mb-4">
          <TabsTrigger value="methods">Learning Methods</TabsTrigger>
          <TabsTrigger value="journal">Journal Entries</TabsTrigger>
          <TabsTrigger value="resources">Resources</TabsTrigger>
        </TabsList>
        
        <TabsContent value="methods">
          <MethodList topicId={topic.id} />
        </TabsContent>
        
        <TabsContent value="journal">
          <JournalList topicId={topic.id} />
        </TabsContent>
        
        <TabsContent value="resources">
          <ResourceList topicId={topic.id} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TopicDetails;
