
import { useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { useLearning } from "@/context/LearningContext";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import JournalForm from "@/components/journal/JournalForm";
import { Badge } from "@/components/ui/badge";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { formatDistanceToNow } from "date-fns";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

const JournalPage = () => {
  const { journals, topics, deleteJournal, updateJournal } = useLearning();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedTopicId, setSelectedTopicId] = useState<string | "all">("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTagFilter, setSelectedTagFilter] = useState<string | "all">("all");
  const [selectedJournalId, setSelectedJournalId] = useState<string | null>(null);
  const [journalToDelete, setJournalToDelete] = useState<string | null>(null);

  // Extract all available tags with null checks
  const allTags = [...new Set(
    journals
      .filter(journal => journal.tags && Array.isArray(journal.tags))
      .flatMap(journal => journal.tags)
  )];

  // Filter journals based on search and filters with null checks
  const filteredJournals = journals
    .filter(journal => 
      (selectedTopicId === "all" || journal.topicId === selectedTopicId) &&
      (selectedTagFilter === "all" || (journal.tags && journal.tags.includes(selectedTagFilter))) &&
      (
        searchTerm === "" || 
        journal.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (journal.tags && Array.isArray(journal.tags) && journal.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())))
      )
    )
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const handleAddJournal = (topicId?: string) => {
    const selectedTopic = topicId || (selectedTopicId !== "all" ? selectedTopicId : undefined);
    
    if (!selectedTopic) {
      toast.error("Please select a topic first");
      return;
    }
    
    setSelectedJournalId(null);
    setSelectedTopicId(selectedTopic as string);
    setIsFormOpen(true);
  };

  const handleEditJournal = (journalId: string) => {
    setSelectedJournalId(journalId);
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

  const selectedJournal = journals.find(journal => journal.id === selectedJournalId);

  return (
    <MainLayout>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-hub-text mb-2">Learning Journal</h1>
        <p className="text-hub-text-muted">Document your insights, questions, and reflections</p>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-hub-border p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <Input
            placeholder="Search journal entries..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
          />
          
          <div className="flex gap-2">
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
            
            <Button 
              onClick={() => handleAddJournal()}
              className="bg-hub-primary hover:bg-hub-primary/90"
            >
              <PlusIcon className="mr-2 h-4 w-4" /> Add
            </Button>
          </div>
        </div>
        
        {allTags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-2">
            <Badge 
              variant={selectedTagFilter === "all" ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => setSelectedTagFilter("all")}
            >
              All Tags
            </Badge>
            {allTags.map((tag) => (
              <Badge
                key={tag}
                variant={selectedTagFilter === tag ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => setSelectedTagFilter(tag === selectedTagFilter ? "all" : tag)}
              >
                #{tag}
              </Badge>
            ))}
          </div>
        )}
      </div>

      <div className="space-y-4">
        {filteredJournals.length === 0 ? (
          <div className="text-center py-8 border rounded-lg border-dashed border-hub-border">
            <p className="text-hub-text-muted mb-4">
              {journals.length === 0 
                ? "No journal entries added yet" 
                : "No entries match your filters"}
            </p>
            {journals.length === 0 && (
              <Button 
                onClick={() => handleAddJournal()}
                variant="outline"
                className="border-hub-primary text-hub-primary hover:bg-hub-muted"
              >
                <PlusIcon className="mr-2 h-4 w-4" /> Add Your First Entry
              </Button>
            )}
          </div>
        ) : (
          filteredJournals.map((journal) => (
            <div 
              key={journal.id} 
              className="bg-white rounded-lg p-4 border border-hub-border"
            >
              <div className="flex justify-between mb-2">
                <div className="flex items-center flex-wrap gap-2">
                  {journal.category && (
                    <span className="bg-hub-muted text-xs px-2 py-1 rounded text-hub-text-muted">
                      {journal.category}
                    </span>
                  )}
                  <span className="text-xs text-hub-text-muted">
                    {getRelativeTimeFromNow(journal.createdAt)}
                  </span>
                  <span className="text-xs bg-hub-secondary px-2 py-0.5 rounded">
                    {topics.find(t => t.id === journal.topicId)?.title}
                  </span>
                </div>
                
                <div className="flex items-start">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => handleEditJournal(journal.id)}
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
              
              {journal.tags && journal.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {journal.tags.map((tag, index) => (
                    <Badge 
                      key={index} 
                      variant="outline" 
                      className="text-hub-text-muted text-xs cursor-pointer"
                      onClick={() => setSelectedTagFilter(tag === selectedTagFilter ? "all" : tag)}
                    >
                      #{tag}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Journal Form Dialog */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{selectedJournal ? 'Edit Journal Entry' : 'Add Journal Entry'}</DialogTitle>
          </DialogHeader>
          <JournalForm 
            topicId={selectedJournal?.topicId || (selectedTopicId !== "all" ? selectedTopicId : "")}
            journal={selectedJournal}
            onClose={() => setIsFormOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
};

export default JournalPage;
