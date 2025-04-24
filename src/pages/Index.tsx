
import { useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import Dashboard from "./Dashboard";
import TopicsPage from "./TopicsPage";
import JournalPage from "./JournalPage";
import ResourcesPage from "./ResourcesPage";
import NotFound from "./NotFound";

const Index = () => {
  const { session, isDemoMode } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!session && !isDemoMode) {
      navigate('/auth');
    }
  }, [session, isDemoMode, navigate]);

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
