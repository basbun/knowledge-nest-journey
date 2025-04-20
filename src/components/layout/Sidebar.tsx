import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { BookOpen, BookText, FileText, List, Menu, X, Globe } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';
import { Button } from '../ui/button';

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  
  const navigation = [
    { name: 'Dashboard', href: '/', icon: BookOpen },
    { name: 'Topics', href: '/topics', icon: List },
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

  return (
    <>
      {isMobile && (
        <Button
          variant="ghost"
          className="fixed top-4 left-4 z-50 p-2"
          onClick={toggleSidebar}
        >
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </Button>
      )}

      <div
        className={cn(
          'fixed inset-y-0 left-0 z-40 flex flex-col border-r border-hub-border bg-white transition-all duration-300',
          isMobile 
            ? (mobileOpen ? 'translate-x-0 w-64' : '-translate-x-full w-64') 
            : (collapsed ? 'w-16' : 'w-64'),
          isMobile && 'shadow-lg'
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
                <Globe className="h-5 w-5" />
              ) : (
                <Globe className="h-5 w-5" />
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
      </div>

      {isMobile && mobileOpen && (
        <div 
          className="fixed inset-0 bg-black/20 z-30"
          onClick={() => setMobileOpen(false)}
        />
      )}
    </>
  );
};

export default Sidebar;
