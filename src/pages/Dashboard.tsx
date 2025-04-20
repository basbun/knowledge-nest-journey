import MainLayout from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { useLearning } from "@/context/LearningContext";
import { PlusIcon } from "lucide-react";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import TopicForm from "@/components/topics/TopicForm";
import { Link } from "react-router-dom";
import { Topic, TopicStatus } from "@/types";
import { cn } from "@/lib/utils";

const Dashboard = () => {
  const { topics, methods, journals, resources } = useLearning();
  const [isFormOpen, setIsFormOpen] = useState(false);

  const getStatusClass = (status: string) => {
    switch (status) {
      case 'Not Started':
        return 'status-to-start';
      case 'In Progress':
        return 'status-in-progress';
      case 'Completed':
        return 'status-completed';
      default:
        return 'status-to-start';
    }
  };

  const totalTopics = topics.length;
  const completedTopics = topics.filter(topic => topic.status === 'Completed').length;
  const inProgressTopics = topics.filter(topic => topic.status === 'In Progress').length;
  const totalJournals = journals.length;
  const totalResources = resources.length;
  const totalMethods = methods.length;

  const statusGroups: Record<TopicStatus, Topic[]> = {
    'Not Started': [],
    'In Progress': [],
    'Completed': []
  };

  topics.forEach(topic => {
    statusGroups[topic.status].push(topic);
  });

  return (
    <MainLayout>
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-hub-text mb-2">Learning Dashboard</h1>
        <p className="text-hub-text-muted">Track, reflect, and grow your knowledge</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow-sm border border-hub-border p-6">
          <h3 className="text-lg font-medium text-hub-text-muted mb-2">Topics</h3>
          <div className="flex items-end justify-between">
            <span className="text-3xl font-bold text-hub-primary">{totalTopics}</span>
            <Link to="/topics">
              <Button variant="outline" className="text-hub-primary border-hub-primary">
                View All
              </Button>
            </Link>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-hub-border p-6">
          <h3 className="text-lg font-medium text-hub-text-muted mb-2">In Progress</h3>
          <div className="flex items-end justify-between">
            <span className="text-3xl font-bold text-blue-500">{inProgressTopics}</span>
            <span className="text-sm text-hub-text-muted">
              {totalTopics > 0 ? Math.round((inProgressTopics / totalTopics) * 100) : 0}% of topics
            </span>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-hub-border p-6">
          <h3 className="text-lg font-medium text-hub-text-muted mb-2">Completed</h3>
          <div className="flex items-end justify-between">
            <span className="text-3xl font-bold text-green-500">{completedTopics}</span>
            <span className="text-sm text-hub-text-muted">
              {totalTopics > 0 ? Math.round((completedTopics / totalTopics) * 100) : 0}% of topics
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-6">
        <div className="lg:col-span-3">
          <div className="mb-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg md:text-xl font-semibold text-hub-text">Topics by Status</h2>
              <Link to="/topics">
                <Button variant="link" className="text-hub-primary">
                  View All
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
              {Object.entries(statusGroups).map(([status, statusTopics]) => (
                <div key={status} className="bg-white rounded-lg shadow-sm border border-hub-border p-4">
                  <div className="flex items-center mb-3">
                    <span className={cn('status-badge mr-2', getStatusClass(status))}>
                      {status}
                    </span>
                    <span className="text-sm text-hub-text-muted">
                      {statusTopics.length} {statusTopics.length === 1 ? 'topic' : 'topics'}
                    </span>
                  </div>
                  <div className="space-y-2">
                    {statusTopics.slice(0, 3).map(topic => (
                      <Link key={topic.id} to="/topics" className="block">
                        <div className="p-2 hover:bg-gray-50 rounded-md transition-colors">
                          <h4 className="font-medium text-hub-text line-clamp-1">{topic.title}</h4>
                          <div className="flex justify-between text-xs text-hub-text-muted">
                            <span>{topic.category}</span>
                            <span>{topic.progress}%</span>
                          </div>
                        </div>
                      </Link>
                    ))}
                    {statusTopics.length > 3 && (
                      <Link to="/topics" className="text-hub-primary text-sm hover:underline block text-center mt-2">
                        + {statusTopics.length - 3} more
                      </Link>
                    )}
                    {statusTopics.length === 0 && (
                      <p className="text-hub-text-muted text-sm py-2 text-center">No topics</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-hub-border p-4">
            <h3 className="text-lg font-medium text-hub-text-muted mb-4">Activities Overview</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center text-sm">
                <span className="text-hub-text-muted">Journal Entries</span>
                <span className="text-hub-accent font-medium">{totalJournals}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-hub-text-muted">Resources</span>
                <span className="text-hub-accent font-medium">{totalResources}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-hub-text-muted">Methods</span>
                <span className="text-hub-accent font-medium">{totalMethods}</span>
              </div>
            </div>
            <Button 
              variant="outline" 
              className="w-full mt-4 text-hub-primary border-hub-primary" 
              onClick={() => setIsFormOpen(true)}
            >
              <PlusIcon className="h-4 w-4 mr-1" /> Add New Topic
            </Button>
          </div>
        </div>
      </div>

      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-hub-text">Recent Activity</h2>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-hub-border p-4">
          {[...journals].sort((a, b) => 
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          ).slice(0, 5).map(journal => (
            <Link key={journal.id} to="/journal" className="block">
              <div className="border-b border-hub-border last:border-0 py-3 hover:bg-gray-50 px-2 rounded-md">
                <div className="flex justify-between items-start mb-1">
                  <div className="flex items-center">
                    <span className="bg-hub-muted text-xs px-2.5 py-1 rounded text-hub-text-muted mr-2">
                      {journal.category}
                    </span>
                    <span className="text-xs text-hub-text-muted">
                      {new Date(journal.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <span className="text-xs bg-hub-secondary px-2 py-0.5 rounded">
                    {topics.find(t => t.id === journal.topicId)?.title}
                  </span>
                </div>
                <p className="text-hub-text line-clamp-2">{journal.content}</p>
              </div>
            </Link>
          ))}
          {journals.length === 0 && (
            <div className="text-center py-8">
              <p className="text-hub-text-muted mb-4">No journal entries yet</p>
              <Link to="/journal">
                <Button 
                  variant="outline"
                  className="border-hub-primary text-hub-primary hover:bg-hub-muted"
                >
                  <PlusIcon className="mr-2 h-4 w-4" /> Add Journal Entry
                </Button>
              </Link>
            </div>
          )}
          {journals.length > 0 && (
            <div className="text-center mt-4">
              <Link to="/journal">
                <Button variant="link" className="text-hub-primary">
                  View All Journal Entries
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Add New Topic</DialogTitle>
          </DialogHeader>
          <TopicForm onClose={() => setIsFormOpen(false)} />
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
};

export default Dashboard;
