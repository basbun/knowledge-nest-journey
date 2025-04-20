
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { BookOpen, BookText, FileText, List, Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';
import { Button } from '../ui/button';

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const isMobile = useIsMobile();
  
  const navigation = [
    { name: 'Dashboard', href: '/', icon: BookOpen },
    { name: 'Topics', href: '/topics', icon: List },
    { name: 'Journal', href: '/journal', icon: FileText },
    { name: 'Resources', href: '/resources', icon: BookText },
  ];

  const toggleSidebar = () => {
    if (isMobile) {
      setMobileOpen(!mobileOpen);
    } else {
      setCollapsed(!collapsed);
    }
  };

  return (
    <>
      {/* Mobile Menu Button */}
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
          isMobile ? (mobileOpen ? 'translate-x-0' : '-translate-x-full') : (collapsed ? 'w-16' : 'w-64'),
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
              className="rounded p-1 hover:bg-hub-secondary"
            >
              {collapsed ? (
                <svg width="20" height="20" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M6 3L11 7.5L6 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              ) : (
                <svg width="20" height="20" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9 3L4 7.5L9 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </button>
          )}
        </div>
        <nav className="flex-1 space-y-1 px-2 py-4">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href;
            
            return (
              <Link
                key={item.name}
                to={item.href}
                onClick={() => isMobile && setMobileOpen(false)}
                className={cn(
                  'flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-hub-muted text-hub-primary'
                    : 'text-hub-text-muted hover:bg-hub-secondary hover:text-hub-primary'
                )}
              >
                <item.icon className={cn('mr-3 h-5 w-5', collapsed && !isMobile ? 'mx-auto' : '')} />
                {(!collapsed || isMobile) && <span>{item.name}</span>}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Mobile Overlay */}
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
