
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { BookOpen, BookText, FileText, List } from 'lucide-react';
import { cn } from '@/lib/utils';

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  
  const navigation = [
    { name: 'Dashboard', href: '/', icon: BookOpen },
    { name: 'Topics', href: '/topics', icon: List },
    { name: 'Journal', href: '/journal', icon: FileText },
    { name: 'Resources', href: '/resources', icon: BookText },
  ];

  return (
    <div
      className={cn(
        'fixed inset-y-0 left-0 z-50 flex flex-col border-r border-hub-border bg-white transition-all duration-300',
        collapsed ? 'w-16' : 'w-64'
      )}
    >
      <div className="flex h-16 items-center justify-between border-b border-hub-border px-4">
        {!collapsed && (
          <h2 className="text-xl font-semibold text-hub-primary">Learning Hub</h2>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
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
      </div>
      <nav className="flex-1 space-y-1 px-2 py-4">
        {navigation.map((item) => {
          const isActive = location.pathname === item.href;
          
          return (
            <Link
              key={item.name}
              to={item.href}
              className={cn(
                'flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-hub-muted text-hub-primary'
                  : 'text-hub-text-muted hover:bg-hub-secondary hover:text-hub-primary'
              )}
            >
              <item.icon className={cn('mr-3 h-5 w-5', collapsed ? 'mx-auto' : '')} />
              {!collapsed && <span>{item.name}</span>}
            </Link>
          );
        })}
      </nav>
    </div>
  );
};

export default Sidebar;
