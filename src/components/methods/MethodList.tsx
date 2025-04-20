
import { useState } from 'react';
import { useLearning } from '@/context/LearningContext';
import { LearningMethod } from '@/types';
import { Button } from '@/components/ui/button';
import { PlusIcon, ExternalLink, Clock } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import MethodForm from './MethodForm';
import { toast } from 'sonner';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';

interface MethodListProps {
  topicId: string;
}

const MethodList = ({ topicId }: MethodListProps) => {
  const { methods, deleteMethod } = useLearning();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState<LearningMethod | null>(null);
  const [methodToDelete, setMethodToDelete] = useState<string | null>(null);

  const topicMethods = methods.filter((method) => method.topicId === topicId);

  const handleAddMethod = () => {
    setSelectedMethod(null);
    setIsFormOpen(true);
  };

  const handleEditMethod = (method: LearningMethod) => {
    setSelectedMethod(method);
    setIsFormOpen(true);
  };

  const handleDeleteMethod = (id: string) => {
    deleteMethod(id);
    setMethodToDelete(null);
    toast.success('Learning method deleted');
  };

  return (
    <div>
      <div className="mb-4 flex justify-between items-center">
        <h3 className="text-lg font-semibold text-hub-text">Learning Methods</h3>
        <Button 
          onClick={handleAddMethod}
          size="sm"
          className="bg-hub-primary hover:bg-hub-primary/90"
        >
          <PlusIcon className="mr-2 h-4 w-4" /> Add Method
        </Button>
      </div>

      {topicMethods.length === 0 ? (
        <div className="text-center py-8 border rounded-lg border-dashed border-hub-border">
          <p className="text-hub-text-muted mb-4">No learning methods added yet</p>
          <Button 
            onClick={handleAddMethod}
            variant="outline"
            className="border-hub-primary text-hub-primary hover:bg-hub-muted"
          >
            <PlusIcon className="mr-2 h-4 w-4" /> Add Your First Method
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {topicMethods.map((method) => (
            <div 
              key={method.id} 
              className="bg-white rounded-lg p-4 border border-hub-border flex justify-between"
            >
              <div>
                <div className="flex items-center mb-2">
                  <span className="bg-hub-muted text-xs px-2 py-1 rounded text-hub-text-muted mr-2">
                    {method.type}
                  </span>
                  <h4 className="font-medium text-hub-text">{method.title}</h4>
                </div>
                
                {method.link && (
                  <a 
                    href={method.link} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-hub-accent text-sm flex items-center hover:underline"
                  >
                    <ExternalLink className="h-3 w-3 mr-1" /> {method.link}
                  </a>
                )}
                
                {method.timeSpent !== undefined && (
                  <div className="text-sm text-hub-text-muted flex items-center mt-2">
                    <Clock className="h-3 w-3 mr-1" /> {method.timeSpent} hours spent
                  </div>
                )}
              </div>
              
              <div className="flex items-start">
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => handleEditMethod(method)}
                  className="text-hub-text-muted hover:text-hub-text"
                >
                  Edit
                </Button>
                
                <AlertDialog open={methodToDelete === method.id} onOpenChange={(open) => !open && setMethodToDelete(null)}>
                  <AlertDialogTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => setMethodToDelete(method.id)}
                      className="text-red-400 hover:text-red-500"
                    >
                      Delete
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete Learning Method</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to delete "{method.title}"? This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction 
                        onClick={() => handleDeleteMethod(method.id)}
                        className="bg-red-500 hover:bg-red-600"
                      >
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Method Form Dialog */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{selectedMethod ? 'Edit Learning Method' : 'Add Learning Method'}</DialogTitle>
          </DialogHeader>
          <MethodForm 
            topicId={topicId}
            method={selectedMethod}
            onClose={() => setIsFormOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MethodList;
