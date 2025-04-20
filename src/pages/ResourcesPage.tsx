import { useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { useLearning } from "@/context/LearningContext";
import { Button } from "@/components/ui/button";
import { PlusIcon, ExternalLink, FileText, Link, BookOpen, Search } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import ResourceForm from "@/components/resources/ResourceForm";
import { toast } from "sonner";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

const ResourcesPage = () => {
  const { resources, topics, deleteResource } = useLearning();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedTopicId, setSelectedTopicId] = useState<string | "all">("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTagFilter, setSelectedTagFilter] = useState<string | "all">("all");
  const [selectedResource, setSelectedResource] = useState<string | null>(null);
  const [resourceToDelete, setResourceToDelete] = useState<string | null>(null);

  // Extract all available tags
  const allTags = [...new Set(resources.flatMap(resource => resource.tags))];

  // Filter resources based on search and filters
  const filteredResources = resources
    .filter(resource => 
      (selectedTopicId === "all" || resource.topicId === selectedTopicId) &&
      (selectedTagFilter === "all" || resource.tags.includes(selectedTagFilter)) &&
      (
        searchTerm === "" || 
        resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (resource.notes && resource.notes.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    )
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const handleAddResource = (topicId?: string) => {
    const selectedTopic = topicId || (selectedTopicId !== "all" ? selectedTopicId : undefined);
    
    if (!selectedTopic) {
      toast.error("Please select a topic first");
      return;
    }
    
    setSelectedResource(null);
    setSelectedTopicId(selectedTopic as string);
    setIsFormOpen(true);
  };

  const handleEditResource = (resourceId: string) => {
    setSelectedResource(resourceId);
    setIsFormOpen(true);
  };

  const handleDeleteResource = (id: string) => {
    deleteResource(id);
    setResourceToDelete(null);
    toast.success('Resource deleted');
  };

  const getResourceIcon = (resource: any) => {
    // If the resource has a type, use that to determine the icon
    if (resource.type) {
      switch (resource.type.toLowerCase()) {
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
    }
    // Otherwise, just return the Link icon
    return Link;
  };

  const selectedResourceData = resources.find(resource => resource.id === selectedResource);

  return (
    <MainLayout>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-hub-text mb-2">Learning Resources</h1>
        <p className="text-hub-text-muted">Organize and access your learning materials</p>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-hub-border p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-hub-text-muted" />
            <Input
              placeholder="Search resources..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-8"
            />
          </div>
          
          <div>
            <Select
              value={selectedTopicId}
              onValueChange={setSelectedTopicId}
            >
              <SelectTrigger>
                <SelectValue placeholder="Filter by topic" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Topics</SelectItem>
                {topics.map((topic) => (
                  <SelectItem key={topic.id} value={topic.id}>
                    {topic.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex gap-2">
            {allTags.length > 0 && (
              <div className="flex-1">
                <Select
                  value={selectedTagFilter}
                  onValueChange={setSelectedTagFilter}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by tag" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Tags</SelectItem>
                    {allTags.map((tag) => (
                      <SelectItem key={tag} value={tag}>
                        #{tag}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
            
            <Button 
              onClick={() => handleAddResource()}
              className="bg-hub-primary hover:bg-hub-primary/90"
            >
              <PlusIcon className="mr-2 h-4 w-4" /> Add
            </Button>
          </div>
        </div>
      </div>

      {filteredResources.length === 0 ? (
        <div className="text-center py-8 border rounded-lg border-dashed border-hub-border">
          <p className="text-hub-text-muted mb-4">
            {resources.length === 0 
              ? "No resources added yet" 
              : "No resources match your filters"}
          </p>
          {resources.length === 0 && (
            <Button 
              onClick={() => handleAddResource()}
              variant="outline"
              className="border-hub-primary text-hub-primary hover:bg-hub-muted"
            >
              <PlusIcon className="mr-2 h-4 w-4" /> Add Your First Resource
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredResources.map((resource) => {
            const ResourceIcon = getResourceIcon(resource);
            const topicName = topics.find(t => t.id === resource.topicId)?.title || "Unknown Topic";
            
            return (
              <div 
                key={resource.id} 
                className="bg-white rounded-lg p-4 border border-hub-border hover:shadow-md transition-shadow"
              >
                <div className="flex items-start">
                  <div className="bg-hub-muted p-2 rounded-lg mr-3">
                    <ResourceIcon className="h-5 w-5 text-hub-primary" />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <h4 className="font-medium text-hub-text">{resource.title}</h4>
                      <div className="flex">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleEditResource(resource.id)}
                          className="h-6 w-6 p-0 text-hub-text-muted hover:text-hub-text"
                        >
                          <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M11.8536 1.14645C11.6583 0.951184 11.3417 0.951184 11.1465 1.14645L3.71455 8.57836C3.62459 8.66832 3.55263 8.77461 3.50251 8.89155L2.04044 12.303C1.9599 12.491 2.00189 12.709 2.14646 12.8536C2.29103 12.9981 2.50905 13.0401 2.69697 12.9596L6.10847 11.4975C6.2254 11.4474 6.3317 11.3754 6.42166 11.2855L13.8536 3.85355C14.0488 3.65829 14.0488 3.34171 13.8536 3.14645L11.8536 1.14645ZM4.42166 9.28547L11.5 2.20711L12.7929 3.5L5.71455 10.5784L4.21924 11.2192L3.78081 10.7808L4.42166 9.28547Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path>
                          </svg>
                        </Button>
                        
                        <AlertDialog open={resourceToDelete === resource.id} onOpenChange={(open) => !open && setResourceToDelete(null)}>
                          <AlertDialogTrigger asChild>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => setResourceToDelete(resource.id)}
                              className="h-6 w-6 p-0 text-red-400 hover:text-red-500"
                            >
                              <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M5.5 1C5.22386 1 5 1.22386 5 1.5C5 1.77614 5.22386 2 5.5 2H9.5C9.77614 2 10 1.77614 10 1.5C10 1.22386 9.77614 1 9.5 1H5.5ZM3 3.5C3 3.22386 3.22386 3 3.5 3H11.5C11.7761 3 12 3.22386 12 3.5C12 3.77614 11.7761 4 11.5 4H3.5C3.22386 4 3 3.77614 3 3.5ZM3 7C3 6.44772 3.44772 6 4 6H11C11.5523 6 12 6.44772 12 7V11C12 11.5523 11.5523 12 11 12H4C3.44772 12 3 11.5523 3 11V7Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path>
                              </svg>
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
                    
                    <div className="flex items-center gap-2 mt-1 mb-2">
                      {resource.type && (
                        <span className="bg-hub-muted text-xs px-2 py-0.5 rounded text-hub-text-muted">
                          {resource.type}
                        </span>
                      )}
                      <span className="text-xs bg-hub-secondary px-2 py-0.5 rounded text-hub-text-muted">
                        {topicName}
                      </span>
                    </div>
                    
                    {resource.notes && (
                      <p className="text-sm text-hub-text-muted mt-2 line-clamp-2">{resource.notes}</p>
                    )}
                    
                    {resource.url && (
                      <a 
                        href={resource.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-hub-accent text-sm flex items-center hover:underline mt-3"
                      >
                        <ExternalLink className="h-3 w-3 mr-1" /> Visit Resource
                      </a>
                    )}
                    
                    {resource.tags && resource.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {resource.tags.map((tag: string, index: number) => (
                          <Badge 
                            key={index} 
                            variant="outline" 
                            className="text-hub-text-muted text-xs"
                            onClick={() => setSelectedTagFilter(tag === selectedTagFilter ? "all" : tag)}
                          >
                            #{tag}
                          </Badge>
                        ))}
                      </div>
                    )}
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
            topicId={selectedResourceData?.topicId || (selectedTopicId !== "all" ? selectedTopicId : "")}
            resource={selectedResourceData}
            onClose={() => setIsFormOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
};

export default ResourcesPage;
