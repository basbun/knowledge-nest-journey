
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { LearningProvider } from './context/LearningContext';
import { Toaster } from './components/ui/sonner';
import AuthPage from './pages/AuthPage';
import Index from './pages/Index';

const App = () => {
  return (
    <AuthProvider>
      <LearningProvider>
        <Router>
          <Routes>
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/*" element={<Index />} />
          </Routes>
        </Router>
        <Toaster />
      </LearningProvider>
    </AuthProvider>
  );
};

export default App;
