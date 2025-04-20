
import { useState } from 'react';
import { useLearning } from '@/context/LearningContext';
import { JournalEntry } from '@/types';
import { Button } from '@/components/ui/button';
import { PlusIcon } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import JournalForm from './JournalForm';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { formatDistanceToNow } from 'date-fns';

interface JournalListProps {
  topicId: string;
}

const JournalList = ({ topicId }: JournalListProps) => {
  const { journals, deleteJournal } = useLearning();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedJournal, setSelectedJournal] = useState<JournalEntry | null>(null);
  const [journalToDelete, setJournalToDelete] = useState<string | null>(null);

  const topicJournals = journals
    .filter((journal) => journal.topicId === topicId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const handleAddJournal = () => {
    setSelectedJournal(null);
    setIsFormOpen(true);
  };

  const handleEditJournal = (journal: JournalEntry) => {
    setSelectedJournal(journal);
    setIsFormOpen(true);
  };

  const handleDeleteJournal = (id: string) => {
    deleteJournal(id);
    setJournalToDelete(null);
    toast.success('Journal entry deleted');
  };

  const getRelativeTimeFromNow = (dateString: string) => {
    return formatDistanceToNow(new Date(dateString), { addSuffix: true });
  };

  return (
    <div>
      <div className="mb-4 flex justify-between items-center">
        <h3 className="text-lg font-semibold text-hub-text">Journal Entries</h3>
        <Button 
          onClick={handleAddJournal}
          size="sm"
          className="bg-hub-primary hover:bg-hub-primary/90"
        >
          <PlusIcon className="mr-2 h-4 w-4" /> Add Entry
        </Button>
      </div>

      {topicJournals.length === 0 ? (
        <div className="text-center py-8 border rounded-lg border-dashed border-hub-border">
          <p className="text-hub-text-muted mb-4">No journal entries added yet</p>
          <Button 
            onClick={handleAddJournal}
            variant="outline"
            className="border-hub-primary text-hub-primary hover:bg-hub-muted"
          >
            <PlusIcon className="mr-2 h-4 w-4" /> Add Your First Entry
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {topicJournals.map((journal) => (
            <div 
              key={journal.id} 
              className="bg-white rounded-lg p-4 border border-hub-border"
            >
              <div className="flex justify-between mb-2">
                <div className="flex items-center">
                  <span className="bg-hub-muted text-xs px-2 py-1 rounded text-hub-text-muted">
                    {journal.category}
                  </span>
                  <span className="text-xs text-hub-text-muted ml-2">
                    {getRelativeTimeFromNow(journal.createdAt)}
                  </span>
                </div>
                
                <div className="flex items-start">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => handleEditJournal(journal)}
                    className="text-hub-text-muted hover:text-hub-text"
                  >
                    Edit
                  </Button>
                  
                  <AlertDialog open={journalToDelete === journal.id} onOpenChange={(open) => !open && setJournalToDelete(null)}>
                    <AlertDialogTrigger asChild>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => setJournalToDelete(journal.id)}
                        className="text-red-400 hover:text-red-500"
                      >
                        Delete
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Journal Entry</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete this journal entry? This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction 
                          onClick={() => handleDeleteJournal(journal.id)}
                          className="bg-red-500 hover:bg-red-600"
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
              
              <p className="text-hub-text whitespace-pre-line mb-3">{journal.content}</p>
              
              {journal.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {journal.tags.map((tag, index) => (
                    <Badge key={index} variant="outline" className="text-hub-text-muted text-xs">
                      #{tag}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Journal Form Dialog */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{selectedJournal ? 'Edit Journal Entry' : 'Add Journal Entry'}</DialogTitle>
          </DialogHeader>
          <JournalForm 
            topicId={topicId}
            journal={selectedJournal}
            onClose={() => setIsFormOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default JournalList;
