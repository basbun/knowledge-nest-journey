
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { LearningProvider } from './context/LearningContext';
import { ThemeProvider } from './context/ThemeContext'; // Import ThemeProvider
import { Toaster } from './components/ui/sonner';
import AuthPage from './pages/AuthPage';
import Index from './pages/Index';

const App = () => {
  return (
    <AuthProvider>
      <LearningProvider>
        <ThemeProvider> {/* Wrap with ThemeProvider */}
          <Router>
            <Routes>
              <Route path="/auth" element={<AuthPage />} />
              <Route path="/*" element={<Index />} />
            </Routes>
          </Router>
          <Toaster />
        </ThemeProvider>
      </LearningProvider>
    </AuthProvider>
  );
};

export default App;
