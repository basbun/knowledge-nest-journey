
import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Topic, LearningMethod, JournalEntry, Resource, Category, TopicStatus } from '@/types';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';

export const useDataSync = (
  setTopics: (topics: Topic[]) => void,
  setMethods: (methods: LearningMethod[]) => void,
  setJournals: (journals: JournalEntry[]) => void,
  setResources: (resources: Resource[]) => void,
  setCategories: (categories: Category[]) => void,
  setIsLoading: (loading: boolean) => void,
  setError: (error: string | null) => void,
  initialTopics: Topic[],
  initialMethods: LearningMethod[],
  initialJournals: JournalEntry[],
  initialResources: Resource[],
  initialCategories: Category[]
) => {
  const { session, isDemoMode } = useAuth();
  const [dataFetched, setDataFetched] = useState(false);
  const [fetchStarted, setFetchStarted] = useState(false);

  // Make fetchData a useCallback so we can call it from the parent
  const fetchData = useCallback(async () => {
    try {
      if (fetchStarted) {
        console.log('Fetch already in progress, skipping duplicate call');
        return;
      }
      
      setIsLoading(true);
      setError(null);
      setFetchStarted(true);
      console.log('Starting data fetch');
      
      // If in demo mode, use initial demo data
      if (isDemoMode) {
        console.log('Demo mode active, using local data');
        setTopics(initialTopics);
        setMethods(initialMethods);
        setJournals(initialJournals);
        setResources(initialResources);
        setCategories(initialCategories);
        setIsLoading(false);
        setDataFetched(true);
        setFetchStarted(false);
        return;
      }
      
      // If not in demo mode but no session, don't fetch data yet
      if (!session) {
        console.log('No authenticated user found, waiting for authentication');
        setIsLoading(false);
        setFetchStarted(false);
        setDataFetched(false);
        return;
      }
      
      console.log('Fetching data for authenticated user:', session.user.id);
      
      // First fetch categories as they're needed for topics
      const { data: categoriesData, error: categoriesError } = await supabase
        .from('categories')
        .select('*')
        .eq('user_id', session.user.id)
        .order('order');

      if (categoriesError) {
        console.error('Error fetching categories:', categoriesError);
        throw categoriesError;
      }
      
      const { data: topicsData, error: topicsError } = await supabase
        .from('topics')
        .select('*')
        .eq('user_id', session.user.id);

      if (topicsError) {
        console.error('Error fetching topics:', topicsError);
        throw topicsError;
      }

      const { data: methodsData, error: methodsError } = await supabase
        .from('learning_methods')
        .select('*')
        .eq('user_id', session.user.id);

      if (methodsError) {
        console.error('Error fetching methods:', methodsError);
        throw methodsError;
      }

      const { data: journalsData, error: journalsError } = await supabase
        .from('journal_entries')
        .select('*')
        .eq('user_id', session.user.id);

      if (journalsError) {
        console.error('Error fetching journals:', journalsError);
        throw journalsError;
      }

      const { data: resourcesData, error: resourcesError } = await supabase
        .from('resources')
        .select('*')
        .eq('user_id', session.user.id);

      if (resourcesError) {
        console.error('Error fetching resources:', resourcesError);
        throw resourcesError;
      }

      const transformedTopics: Topic[] = topicsData?.map(item => ({
        id: item.id,
        title: item.title,
        description: item.description || '',
        category: item.category,
        status: item.status as TopicStatus,
        progress: item.progress,
        startDate: item.start_date,
        targetEndDate: item.target_end_date,
        parentId: item.parent_id,
        createdAt: item.created_at,
        updatedAt: item.updated_at
      })) || [];

      const transformedMethods: LearningMethod[] = methodsData?.map(item => ({
        id: item.id,
        topicId: item.topic_id,
        type: item.type,
        title: item.title,
        link: item.link,
        timeSpent: item.time_spent,
        createdAt: item.created_at,
        updatedAt: item.updated_at
      })) || [];

      const transformedJournals: JournalEntry[] = journalsData?.map(item => ({
        id: item.id,
        topicId: item.topic_id,
        content: item.content,
        tags: item.tags || [],
        category: item.category,
        createdAt: item.created_at,
        updatedAt: item.updated_at
      })) || [];

      const transformedResources: Resource[] = resourcesData?.map(item => ({
        id: item.id,
        topicId: item.topic_id,
        title: item.title,
        url: item.url,
        notes: item.notes,
        tags: item.tags || [],
        type: item.type || '',
        createdAt: item.created_at,
        updatedAt: item.updated_at
      })) || [];

      const transformedCategories: Category[] = categoriesData?.map(item => ({
        id: item.id,
        name: item.name,
        order: item.order,
        isActive: item.is_active
      })) || [];

      // Update all data at once
      console.log('Setting fetched user data');
      setCategories(transformedCategories.length > 0 ? transformedCategories : initialCategories);
      setTopics(transformedTopics.length > 0 ? transformedTopics : initialTopics);
      setMethods(transformedMethods.length > 0 ? transformedMethods : initialMethods);
      setJournals(transformedJournals.length > 0 ? transformedJournals : initialJournals);
      setResources(transformedResources.length > 0 ? transformedResources : initialResources);
      
      setDataFetched(true);
      console.log('Data successfully fetched for user');
      toast.success('Your data has been loaded successfully');
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Failed to load data. Using local data instead.');
      // Fall back to demo data on error
      setTopics(initialTopics);
      setMethods(initialMethods);
      setJournals(initialJournals);
      setResources(initialResources);
      setCategories(initialCategories);
      toast.error('Failed to load your data. Using demo data for now.');
    } finally {
      setIsLoading(false);
      setFetchStarted(false);
    }
  }, [session, isDemoMode, fetchStarted]);

  // Run fetchData whenever auth state changes
  useEffect(() => {
    if (session && !dataFetched && !fetchStarted) {
      console.log('Auth state changed, fetching data');
      fetchData();
    }
  }, [session, dataFetched, fetchData, fetchStarted]);

  useEffect(() => {
    // Only set up realtime listeners when authenticated
    if (!session || isDemoMode) return;

    console.log('Setting up Supabase realtime listeners');
    
    const topicsChannel = supabase
      .channel('public:topics')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'topics' }, () => {
        fetchData();
      })
      .subscribe();

    const methodsChannel = supabase
      .channel('public:learning_methods')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'learning_methods' }, () => {
        fetchData();
      })
      .subscribe();

    const journalsChannel = supabase
      .channel('public:journal_entries')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'journal_entries' }, () => {
        fetchData();
      })
      .subscribe();

    const resourcesChannel = supabase
      .channel('public:resources')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'resources' }, () => {
        fetchData();
      })
      .subscribe();

    const categoriesChannel = supabase
      .channel('public:categories')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'categories' }, () => {
        fetchData();
      })
      .subscribe();

    return () => {
      console.log('Removing Supabase realtime listeners');
      supabase.removeChannel(topicsChannel);
      supabase.removeChannel(methodsChannel);
      supabase.removeChannel(journalsChannel);
      supabase.removeChannel(resourcesChannel);
      supabase.removeChannel(categoriesChannel);
    };
  }, [session, isDemoMode, fetchData]);

  return { fetchData, dataFetched };
};
