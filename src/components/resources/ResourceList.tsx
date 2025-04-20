
import { useState } from 'react';
import { useLearning } from '@/context/LearningContext';
import { Resource } from '@/types';
import { Button } from '@/components/ui/button';
import { PlusIcon, ExternalLink, FileText, Link, BookOpen } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import ResourceForm from './ResourceForm';
import { toast } from 'sonner';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';

interface ResourceListProps {
  topicId: string;
}

const ResourceList = ({ topicId }: ResourceListProps) => {
  const { resources, deleteResource } = useLearning();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedResource, setSelectedResource] = useState<Resource | null>(null);
  const [resourceToDelete, setResourceToDelete] = useState<string | null>(null);

  const topicResources = resources.filter((resource) => resource.topicId === topicId);

  const handleAddResource = () => {
    setSelectedResource(null);
    setIsFormOpen(true);
  };

  const handleEditResource = (resource: Resource) => {
    setSelectedResource(resource);
    setIsFormOpen(true);
  };

  const handleDeleteResource = (id: string) => {
    deleteResource(id);
    setResourceToDelete(null);
    toast.success('Resource deleted');
  };

  const getResourceIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'article':
        return FileText;
      case 'tutorial':
        return BookOpen;
      case 'documentation':
        return FileText;
      case 'book':
        return BookOpen;
      default:
        return Link;
    }
  };

  return (
    <div>
      <div className="mb-4 flex justify-between items-center">
        <h3 className="text-lg font-semibold text-hub-text">Learning Resources</h3>
        <Button 
          onClick={handleAddResource}
          size="sm"
          className="bg-hub-primary hover:bg-hub-primary/90"
        >
          <PlusIcon className="mr-2 h-4 w-4" /> Add Resource
        </Button>
      </div>

      {topicResources.length === 0 ? (
        <div className="text-center py-8 border rounded-lg border-dashed border-hub-border">
          <p className="text-hub-text-muted mb-4">No resources added yet</p>
          <Button 
            onClick={handleAddResource}
            variant="outline"
            className="border-hub-primary text-hub-primary hover:bg-hub-muted"
          >
            <PlusIcon className="mr-2 h-4 w-4" /> Add Your First Resource
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {topicResources.map((resource) => {
            const ResourceIcon = getResourceIcon(resource.type);
            
            return (
              <div 
                key={resource.id} 
                className="bg-white rounded-lg p-4 border border-hub-border"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start">
                    <div className="bg-hub-muted p-2 rounded-lg mr-3">
                      <ResourceIcon className="h-5 w-5 text-hub-primary" />
                    </div>
                    <div>
                      <div className="flex items-center mb-1">
                        <h4 className="font-medium text-hub-text">{resource.title}</h4>
                        <span className="bg-hub-muted text-xs px-2 py-0.5 rounded text-hub-text-muted ml-2">
                          {resource.type}
                        </span>
                      </div>
                      
                      {resource.url && (
                        <a 
                          href={resource.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-hub-accent text-sm flex items-center hover:underline"
                        >
                          <ExternalLink className="h-3 w-3 mr-1" /> View Resource
                        </a>
                      )}
                      
                      {resource.notes && (
                        <p className="text-sm text-hub-text-muted mt-2 line-clamp-2">{resource.notes}</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex flex-col items-end">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleEditResource(resource)}
                      className="text-hub-text-muted hover:text-hub-text h-7 px-2"
                    >
                      Edit
                    </Button>
                    
                    <AlertDialog open={resourceToDelete === resource.id} onOpenChange={(open) => !open && setResourceToDelete(null)}>
                      <AlertDialogTrigger asChild>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => setResourceToDelete(resource.id)}
                          className="text-red-400 hover:text-red-500 h-7 px-2"
                        >
                          Delete
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Resource</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete "{resource.title}"? This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction 
                            onClick={() => handleDeleteResource(resource.id)}
                            className="bg-red-500 hover:bg-red-600"
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Resource Form Dialog */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{selectedResource ? 'Edit Resource' : 'Add Resource'}</DialogTitle>
          </DialogHeader>
          <ResourceForm 
            topicId={topicId}
            resource={selectedResource}
            onClose={() => setIsFormOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ResourceList;
