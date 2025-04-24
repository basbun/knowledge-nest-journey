
import React, { useState, ReactNode, useEffect } from 'react';
import { LearningContext } from './learningContext';
import { Topic, LearningMethod, JournalEntry, Resource, Category } from '@/types';
import { initialCategories, initialTopics, initialMethods, initialJournals, initialResources } from './learningInitialState';
import { useTopics } from '@/hooks/useTopics';
import { useMethods } from '@/hooks/useMethods';
import { useJournals } from '@/hooks/useJournals';
import { useResources } from '@/hooks/useResources';
import { useCategories } from '@/hooks/useCategories';
import { useDataSync } from '@/hooks/useDataSync';
import { useAuth } from '@/context/AuthContext';

export const LearningProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { session, isDemoMode, isLoading: authLoading } = useAuth();

  const {
    topics,
    setTopics,
    addTopic,
    updateTopic,
    deleteTopic
  } = useTopics(initialTopics);

  const {
    methods,
    setMethods,
    addMethod,
    updateMethod,
    deleteMethod
  } = useMethods(initialMethods);

  const {
    journals,
    setJournals,
    addJournal,
    updateJournal,
    deleteJournal
  } = useJournals(initialJournals);

  const {
    resources,
    setResources,
    addResource,
    updateResource,
    deleteResource
  } = useResources(initialResources);

  const {
    categories,
    setCategories,
    addCategory,
    updateCategory,
    deleteCategory,
    reorderCategory,
    toggleCategoryActive
  } = useCategories(initialCategories);

  const { dataFetched, fetchData } = useDataSync(
    setTopics,
    setMethods,
    setJournals,
    setResources,
    setCategories,
    setIsLoading,
    setError,
    initialTopics,
    initialMethods,
    initialJournals,
    initialResources,
    initialCategories
  );

  // Wait for auth to resolve before deciding what data to show
  useEffect(() => {
    if (authLoading) {
      // Still waiting for auth
      return;
    }
    
    if (isDemoMode) {
      // Demo mode: use initial data
      console.log('Demo mode active, using demo data');
      setTopics(initialTopics);
      setMethods(initialMethods);
      setJournals(initialJournals);
      setResources(initialResources);
      setCategories(initialCategories);
      setIsLoading(false);
    } else if (session) {
      // Authenticated: refetch data to ensure latest
      console.log('Authenticated user, fetching data');
      fetchData();
    } else {
      // Not logged in and not in demo mode: use initial data
      console.log('Not authenticated and not in demo mode, using initial data');
      setTopics(initialTopics);
      setMethods(initialMethods);
      setJournals(initialJournals);
      setResources(initialResources);
      setCategories(initialCategories);
      setIsLoading(false);
    }
  }, [session, isDemoMode, authLoading]);

  return (
    <LearningContext.Provider
      value={{
        topics,
        methods,
        journals,
        resources,
        addTopic,
        updateTopic,
        deleteTopic,
        addMethod,
        updateMethod,
        deleteMethod,
        addJournal,
        updateJournal,
        deleteJournal,
        addResource,
        updateResource,
        deleteResource,
        categories,
        addCategory,
        updateCategory,
        deleteCategory,
        reorderCategory,
        toggleCategoryActive,
        isLoading,
        error,
      }}
    >
      {children}
    </LearningContext.Provider>
  );
};
