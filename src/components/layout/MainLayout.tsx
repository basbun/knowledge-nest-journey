
import React from 'react';
import Sidebar from './Sidebar';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';

interface MainLayoutProps {
  children: React.ReactNode;
  className?: string;
}

const MainLayout = ({ children, className }: MainLayoutProps) => {
  const isMobile = useIsMobile();

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <main className={cn(
        'flex-1 p-4 md:p-8 transition-all',
        !isMobile && 'md:ml-16 xl:ml-16',
        className
      )}>
        {children}
      </main>
    </div>
  );
};

export default MainLayout;
