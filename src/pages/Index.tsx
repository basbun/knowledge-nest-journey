
import { useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useLearning } from "@/context/LearningContext";
import Dashboard from "./Dashboard";
import TopicsPage from "./TopicsPage";
import JournalPage from "./JournalPage";
import ResourcesPage from "./ResourcesPage";
import NotFound from "./NotFound";
import { Skeleton } from "@/components/ui/skeleton";

const LoadingScreen = () => (
  <div className="fixed inset-0 bg-white flex items-center justify-center z-50">
    <div className="text-center">
      <div className="flex flex-col items-center gap-4">
        <div className="h-16 w-16 border-4 border-t-hub-primary border-r-hub-primary border-b-hub-secondary border-l-hub-secondary rounded-full animate-spin"></div>
        <h2 className="text-xl font-medium text-hub-text">Loading your data...</h2>
        <p className="text-hub-text-muted">Please wait while we retrieve your learning information</p>
      </div>
    </div>
  </div>
);

const Index = () => {
  const { session, isDemoMode, isLoading: authLoading } = useAuth();
  const { isLoading: dataLoading, dataFetched } = useLearning();
  const navigate = useNavigate();
  
  const isLoading = authLoading || (session && !isDemoMode && dataLoading && !dataFetched);

  useEffect(() => {
    // Only redirect after auth has been checked
    if (!authLoading && !session && !isDemoMode) {
      navigate('/auth');
    }
  }, [session, isDemoMode, navigate, authLoading]);

  // Show loading screen when authentication is complete but data is still loading
  if (!authLoading && session && !isDemoMode && (dataLoading || !dataFetched)) {
    return <LoadingScreen />;
  }
  
  // Show nothing while checking auth
  if (authLoading) return null;
  
  // Don't render routes until auth state is determined
  if (!session && !isDemoMode) return null;

  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/topics" element={<TopicsPage />} />
      <Route path="/journal" element={<JournalPage />} />
      <Route path="/resources" element={<ResourcesPage />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default Index;
