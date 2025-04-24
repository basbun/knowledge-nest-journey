import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { BookOpen, BookText, FileText, List, Menu, X, Globe, Home, LogOut, ChevronLeft, ChevronRight, Target, User, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';
import { Button } from '../ui/button';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useAuth } from '@/context/AuthContext';

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const { session, isDemoMode, setIsDemoMode } = useAuth();
  
  const navigation = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'Topics', href: '/topics', icon: Target },
    { name: 'Journal', href: '/journal', icon: FileText },
    { name: 'Resources', href: '/resources', icon: Globe },
  ];

  const toggleSidebar = () => {
    if (isMobile) {
      setMobileOpen(!mobileOpen);
    } else {
      setCollapsed(!collapsed);
    }
  };

  const handleNavClick = (path: string) => {
    navigate(path);
    if (isMobile) {
      setMobileOpen(false);
    }
  };

  const handleLogout = async () => {
    try {
      if (isDemoMode) {
        // If in demo mode, simply disable demo mode and navigate to auth
        setIsDemoMode(false);
        navigate('/auth');
        toast.success('Exited demo mode');
        return;
      }

      // Only attempt to sign out if there's an active session
      if (session) {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
      }
      
      navigate('/auth');
      toast.success('Logged out successfully');
    } catch (error) {
      console.error('Logout error:', error);
      
      // Even if there's an error, we should still navigate to the auth page
      // This ensures users can always exit their current session
      navigate('/auth');
      toast.success('Redirected to login');
    }
  };

  if (isMobile) {
    return (
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 pb-safe">
        <nav className="flex items-center justify-around px-4 py-2">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href;
            
            return (
              <button
                key={item.name}
                onClick={() => handleNavClick(item.href)}
                className={cn(
                  'flex flex-col items-center justify-center p-2 rounded-lg transition-colors',
                  isActive
                    ? 'text-hub-primary'
                    : 'text-gray-500 hover:text-hub-primary'
                )}
              >
                <item.icon className="h-6 w-6" />
                <span className="text-xs mt-1">{item.name}</span>
              </button>
            );
          })}
          <button
            onClick={() => handleLogout()}
            className="flex flex-col items-center justify-center p-2 rounded-lg text-gray-500 hover:text-hub-primary"
          >
            <User className="h-6 w-6" />
            <span className="text-xs mt-1">Profile</span>
          </button>
        </nav>
      </div>
    );
  }

  return (
    <>
      <div
        className={cn(
          'fixed inset-y-0 left-0 z-40 flex flex-col border-r border-hub-border bg-white transition-all duration-300',
          collapsed ? 'w-16' : 'w-64'
        )}
      >
        <div className="flex h-16 items-center justify-between border-b border-hub-border px-4">
          {!collapsed && !isMobile && (
            <h2 className="text-xl font-semibold text-hub-primary">Learning Hub</h2>
          )}
          {!isMobile && (
            <button
              onClick={toggleSidebar}
              className={cn(
                "rounded p-1 hover:bg-hub-secondary",
                collapsed && "w-full flex justify-center"
              )}
            >
              {collapsed ? (
                <ChevronRight className="h-5 w-5" />
              ) : (
                <ChevronLeft className="h-5 w-5" />
              )}
            </button>
          )}
        </div>
        <nav className="flex-1 space-y-1 px-2 py-4">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href;
            
            return (
              <button
                key={item.name}
                onClick={() => handleNavClick(item.href)}
                className={cn(
                  'flex w-full items-center rounded-md px-3 py-2 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-hub-muted text-hub-primary'
                    : 'text-hub-text-muted hover:bg-hub-secondary hover:text-hub-primary',
                  collapsed && !isMobile && 'justify-center px-2'
                )}
              >
                <item.icon className={cn('h-5 w-5', collapsed && !isMobile ? 'mr-0' : 'mr-3')} />
                {(!collapsed || isMobile) && <span>{item.name}</span>}
              </button>
            );
          })}
        </nav>
        
        {/* Logout Button at the bottom */}
        <div className="border-t border-hub-border p-2">
          <button
            onClick={handleLogout}
            className={cn(
              'flex w-full items-center rounded-md px-3 py-2 text-sm font-medium transition-colors text-hub-text-muted hover:bg-hub-secondary hover:text-hub-primary',
              collapsed && !isMobile && 'justify-center px-2'
            )}
          >
            <LogOut className={cn('h-5 w-5', collapsed && !isMobile ? 'mr-0' : 'mr-3')} />
            {(!collapsed || isMobile) && <span>Logout</span>}
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
