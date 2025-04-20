import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Topic, LearningMethod, JournalEntry, Resource, Category, TopicStatus } from '@/types';

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
  const fetchData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        console.log('No authenticated user found, using local data');
        setIsLoading(false);
        return;
      }
      
      const { data: topicsData, error: topicsError } = await supabase
        .from('topics')
        .select('*')
        .eq('user_id', user.id);

      if (topicsError) throw topicsError;

      const { data: methodsData, error: methodsError } = await supabase
        .from('learning_methods')
        .select('*')
        .eq('user_id', user.id);

      if (methodsError) throw methodsError;

      const { data: journalsData, error: journalsError } = await supabase
        .from('journal_entries')
        .select('*')
        .eq('user_id', user.id);

      if (journalsError) throw journalsError;

      const { data: resourcesData, error: resourcesError } = await supabase
        .from('resources')
        .select('*')
        .eq('user_id', user.id);

      if (resourcesError) throw resourcesError;

      const { data: categoriesData, error: categoriesError } = await supabase
        .from('categories')
        .select('*')
        .eq('user_id', user.id)
        .order('order');

      if (categoriesError) throw categoriesError;

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

      setTopics(transformedTopics.length > 0 ? transformedTopics : initialTopics);
      setMethods(transformedMethods.length > 0 ? transformedMethods : initialMethods);
      setJournals(transformedJournals.length > 0 ? transformedJournals : initialJournals);
      setResources(transformedResources.length > 0 ? transformedResources : initialResources);
      setCategories(transformedCategories.length > 0 ? transformedCategories : initialCategories);
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Failed to load data. Using local data instead.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();

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
      supabase.removeChannel(topicsChannel);
      supabase.removeChannel(methodsChannel);
      supabase.removeChannel(journalsChannel);
      supabase.removeChannel(resourcesChannel);
      supabase.removeChannel(categoriesChannel);
    };
  }, []);

  return { fetchData };
};
