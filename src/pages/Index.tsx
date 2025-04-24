
import { useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import Dashboard from "./Dashboard";
import TopicsPage from "./TopicsPage";
import JournalPage from "./JournalPage";
import ResourcesPage from "./ResourcesPage";
import NotFound from "./NotFound";

const Index = () => {
  const { session, isDemoMode, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Only redirect after auth has been checked
    if (!isLoading && !session && !isDemoMode) {
      navigate('/auth');
    }
  }, [session, isDemoMode, navigate, isLoading]);

  // Show nothing while checking auth
  if (isLoading) return null;
  
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
