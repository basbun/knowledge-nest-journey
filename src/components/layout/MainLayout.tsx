
import React from 'react';
import Sidebar from './Sidebar';
import { cn } from '@/lib/utils';

interface MainLayoutProps {
  children: React.ReactNode;
  className?: string;
}

const MainLayout = ({ children, className }: MainLayoutProps) => {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <main className={cn('flex-1 p-8 pl-[280px] transition-all', className)}>
        {children}
      </main>
    </div>
  );
};

export default MainLayout;
