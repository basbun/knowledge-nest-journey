
import React, { useState, useEffect, ReactNode } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { LearningContext } from './learningContext';
import { Topic, LearningMethod, JournalEntry, Resource, Category, TopicStatus } from '../types';
import { initialCategories, initialTopics, initialMethods, initialJournals, initialResources } from './learningInitialState';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const LearningProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [topics, setTopics] = useState<Topic[]>(initialTopics);
  const [methods, setMethods] = useState<LearningMethod[]>(initialMethods);
  const [journals, setJournals] = useState<JournalEntry[]>(initialJournals);
  const [resources, setResources] = useState<Resource[]>(initialResources);
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Function to fetch all data from Supabase
  const fetchData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Fetch topics
      const { data: topicsData, error: topicsError } = await supabase
        .from('topics')
        .select('*');

      if (topicsError) throw topicsError;

      // Fetch methods
      const { data: methodsData, error: methodsError } = await supabase
        .from('learning_methods')
        .select('*');

      if (methodsError) throw methodsError;

      // Fetch journals
      const { data: journalsData, error: journalsError } = await supabase
        .from('journal_entries')
        .select('*');

      if (journalsError) throw journalsError;

      // Fetch resources
      const { data: resourcesData, error: resourcesError } = await supabase
        .from('resources')
        .select('*');

      if (resourcesError) throw resourcesError;

      // Fetch categories
      const { data: categoriesData, error: categoriesError } = await supabase
        .from('categories')
        .select('*')
        .order('order');

      if (categoriesError) throw categoriesError;

      // Transform data to match our application types
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
        tags: item.tags,
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
        type: item.type,
        createdAt: item.created_at,
        updatedAt: item.updated_at
      })) || [];

      const transformedCategories: Category[] = categoriesData?.map(item => ({
        id: item.id,
        name: item.name,
        order: item.order,
        isActive: item.is_active
      })) || [];

      // If we have data, use it; otherwise fall back to initial state
      setTopics(transformedTopics.length > 0 ? transformedTopics : initialTopics);
      setMethods(transformedMethods.length > 0 ? transformedMethods : initialMethods);
      setJournals(transformedJournals.length > 0 ? transformedJournals : initialJournals);
      setResources(transformedResources.length > 0 ? transformedResources : initialResources);
      setCategories(transformedCategories.length > 0 ? transformedCategories : initialCategories);
      
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Failed to load data. Using local data instead.');
      toast.error('Failed to load data from database. Using local data instead.');
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch data on component mount
  useEffect(() => {
    fetchData();

    // Set up real-time listeners for updates
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

  // Add a topic to Supabase
  const addTopic = async (topic: Omit<Topic, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const newId = uuidv4();
      const now = new Date().toISOString();
      
      // First, update local state for immediate feedback
      const newTopic: Topic = {
        ...topic,
        id: newId,
        createdAt: now,
        updatedAt: now,
      };
      
      setTopics(prevTopics => [...prevTopics, newTopic]);
      
      // Then, save to Supabase
      const { error } = await supabase
        .from('topics')
        .insert({
          id: newId,
          title: topic.title,
          description: topic.description,
          category: topic.category,
          status: topic.status,
          progress: topic.progress,
          start_date: topic.startDate,
          target_end_date: topic.targetEndDate,
          parent_id: topic.parentId,
        });
      
      if (error) {
        console.error('Error adding topic:', error);
        toast.error('Failed to save topic to database');
        // Revert local state change if Supabase save fails
        setTopics(prevTopics => prevTopics.filter(t => t.id !== newId));
      } else {
        toast.success('Topic added successfully');
      }
    } catch (error) {
      console.error('Error in addTopic:', error);
      toast.error('An error occurred while adding the topic');
    }
  };

  // Update a topic in Supabase
  const updateTopic = async (id: string, updates: Partial<Topic>) => {
    try {
      // First, update local state for immediate feedback
      setTopics(prevTopics =>
        prevTopics.map(topic =>
          topic.id === id
            ? { ...topic, ...updates, updatedAt: new Date().toISOString() }
            : topic
        )
      );
      
      // Then, save to Supabase
      const { error } = await supabase
        .from('topics')
        .update({
          title: updates.title,
          description: updates.description,
          category: updates.category,
          status: updates.status,
          progress: updates.progress,
          start_date: updates.startDate,
          target_end_date: updates.targetEndDate,
          parent_id: updates.parentId,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id);
      
      if (error) {
        console.error('Error updating topic:', error);
        toast.error('Failed to update topic in database');
        // Revert local state change if Supabase save fails
        fetchData();
      } else {
        toast.success('Topic updated successfully');
      }
    } catch (error) {
      console.error('Error in updateTopic:', error);
      toast.error('An error occurred while updating the topic');
    }
  };

  // Delete a topic from Supabase
  const deleteTopic = async (id: string) => {
    try {
      // First, update local state for immediate feedback
      setTopics(prevTopics => prevTopics.filter(topic => topic.id !== id));
      setMethods(prevMethods => prevMethods.filter(method => method.topicId !== id));
      setJournals(prevJournals => prevJournals.filter(journal => journal.topicId !== id));
      setResources(prevResources => prevResources.filter(resource => resource.topicId !== id));
      
      // Then, delete from Supabase
      const { error } = await supabase
        .from('topics')
        .delete()
        .eq('id', id);
      
      if (error) {
        console.error('Error deleting topic:', error);
        toast.error('Failed to delete topic from database');
        // Revert local state change if Supabase delete fails
        fetchData();
      } else {
        toast.success('Topic deleted successfully');
      }
    } catch (error) {
      console.error('Error in deleteTopic:', error);
      toast.error('An error occurred while deleting the topic');
    }
  };

  // Add a method to Supabase
  const addMethod = async (method: Omit<LearningMethod, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const newId = uuidv4();
      const now = new Date().toISOString();
      
      // First, update local state for immediate feedback
      const newMethod: LearningMethod = {
        ...method,
        id: newId,
        createdAt: now,
        updatedAt: now,
      };
      
      setMethods(prevMethods => [...prevMethods, newMethod]);
      
      // Then, save to Supabase
      const { error } = await supabase
        .from('learning_methods')
        .insert({
          id: newId,
          topic_id: method.topicId,
          type: method.type,
          title: method.title,
          link: method.link,
          time_spent: method.timeSpent,
        });
      
      if (error) {
        console.error('Error adding method:', error);
        toast.error('Failed to save method to database');
        // Revert local state change if Supabase save fails
        setMethods(prevMethods => prevMethods.filter(m => m.id !== newId));
      } else {
        toast.success('Learning method added successfully');
      }
    } catch (error) {
      console.error('Error in addMethod:', error);
      toast.error('An error occurred while adding the learning method');
    }
  };

  // Update a method in Supabase
  const updateMethod = async (id: string, updates: Partial<LearningMethod>) => {
    try {
      // First, update local state for immediate feedback
      setMethods(prevMethods =>
        prevMethods.map(method =>
          method.id === id
            ? { ...method, ...updates, updatedAt: new Date().toISOString() }
            : method
        )
      );
      
      // Then, save to Supabase
      const { error } = await supabase
        .from('learning_methods')
        .update({
          topic_id: updates.topicId,
          type: updates.type,
          title: updates.title,
          link: updates.link,
          time_spent: updates.timeSpent,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id);
      
      if (error) {
        console.error('Error updating method:', error);
        toast.error('Failed to update method in database');
        // Revert local state change if Supabase save fails
        fetchData();
      } else {
        toast.success('Learning method updated successfully');
      }
    } catch (error) {
      console.error('Error in updateMethod:', error);
      toast.error('An error occurred while updating the learning method');
    }
  };

  // Delete a method from Supabase
  const deleteMethod = async (id: string) => {
    try {
      // First, update local state for immediate feedback
      setMethods(prevMethods => prevMethods.filter(method => method.id !== id));
      
      // Then, delete from Supabase
      const { error } = await supabase
        .from('learning_methods')
        .delete()
        .eq('id', id);
      
      if (error) {
        console.error('Error deleting method:', error);
        toast.error('Failed to delete method from database');
        // Revert local state change if Supabase delete fails
        fetchData();
      } else {
        toast.success('Learning method deleted successfully');
      }
    } catch (error) {
      console.error('Error in deleteMethod:', error);
      toast.error('An error occurred while deleting the learning method');
    }
  };

  // Add a journal to Supabase
  const addJournal = async (journal: Omit<JournalEntry, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const newId = uuidv4();
      const now = new Date().toISOString();
      
      // First, update local state for immediate feedback
      const newJournal: JournalEntry = {
        ...journal,
        id: newId,
        createdAt: now,
        updatedAt: now,
      };
      
      setJournals(prevJournals => [...prevJournals, newJournal]);
      
      // Then, save to Supabase
      const { error } = await supabase
        .from('journal_entries')
        .insert({
          id: newId,
          topic_id: journal.topicId,
          content: journal.content,
          tags: journal.tags,
          category: journal.category || '',
        });
      
      if (error) {
        console.error('Error adding journal:', error);
        toast.error('Failed to save journal entry to database');
        // Revert local state change if Supabase save fails
        setJournals(prevJournals => prevJournals.filter(j => j.id !== newId));
      } else {
        toast.success('Journal entry added successfully');
      }
    } catch (error) {
      console.error('Error in addJournal:', error);
      toast.error('An error occurred while adding the journal entry');
    }
  };

  // Update a journal in Supabase
  const updateJournal = async (id: string, updates: Partial<JournalEntry>) => {
    try {
      // First, update local state for immediate feedback
      setJournals(prevJournals =>
        prevJournals.map(journal =>
          journal.id === id
            ? { ...journal, ...updates, updatedAt: new Date().toISOString() }
            : journal
        )
      );
      
      // Then, save to Supabase
      const { error } = await supabase
        .from('journal_entries')
        .update({
          topic_id: updates.topicId,
          content: updates.content,
          tags: updates.tags,
          category: updates.category || '',
          updated_at: new Date().toISOString(),
        })
        .eq('id', id);
      
      if (error) {
        console.error('Error updating journal:', error);
        toast.error('Failed to update journal entry in database');
        // Revert local state change if Supabase save fails
        fetchData();
      } else {
        toast.success('Journal entry updated successfully');
      }
    } catch (error) {
      console.error('Error in updateJournal:', error);
      toast.error('An error occurred while updating the journal entry');
    }
  };

  // Delete a journal from Supabase
  const deleteJournal = async (id: string) => {
    try {
      // First, update local state for immediate feedback
      setJournals(prevJournals => prevJournals.filter(journal => journal.id !== id));
      
      // Then, delete from Supabase
      const { error } = await supabase
        .from('journal_entries')
        .delete()
        .eq('id', id);
      
      if (error) {
        console.error('Error deleting journal:', error);
        toast.error('Failed to delete journal entry from database');
        // Revert local state change if Supabase delete fails
        fetchData();
      } else {
        toast.success('Journal entry deleted successfully');
      }
    } catch (error) {
      console.error('Error in deleteJournal:', error);
      toast.error('An error occurred while deleting the journal entry');
    }
  };

  // Add a resource to Supabase
  const addResource = async (resource: Omit<Resource, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const newId = uuidv4();
      const now = new Date().toISOString();
      
      // First, update local state for immediate feedback
      const newResource: Resource = {
        ...resource,
        id: newId,
        createdAt: now,
        updatedAt: now,
      };
      
      setResources(prevResources => [...prevResources, newResource]);
      
      // Then, save to Supabase
      const { error } = await supabase
        .from('resources')
        .insert({
          id: newId,
          topic_id: resource.topicId,
          title: resource.title,
          url: resource.url,
          notes: resource.notes,
          tags: resource.tags || [],
          type: resource.type || '',
        });
      
      if (error) {
        console.error('Error adding resource:', error);
        toast.error('Failed to save resource to database');
        // Revert local state change if Supabase save fails
        setResources(prevResources => prevResources.filter(r => r.id !== newId));
      } else {
        toast.success('Resource added successfully');
      }
    } catch (error) {
      console.error('Error in addResource:', error);
      toast.error('An error occurred while adding the resource');
    }
  };

  // Update a resource in Supabase
  const updateResource = async (id: string, updates: Partial<Resource>) => {
    try {
      // First, update local state for immediate feedback
      setResources(prevResources =>
        prevResources.map(resource =>
          resource.id === id
            ? { ...resource, ...updates, updatedAt: new Date().toISOString() }
            : resource
        )
      );
      
      // Then, save to Supabase
      const { error } = await supabase
        .from('resources')
        .update({
          topic_id: updates.topicId,
          title: updates.title,
          url: updates.url,
          notes: updates.notes,
          tags: updates.tags || [],
          type: updates.type || '',
          updated_at: new Date().toISOString(),
        })
        .eq('id', id);
      
      if (error) {
        console.error('Error updating resource:', error);
        toast.error('Failed to update resource in database');
        // Revert local state change if Supabase save fails
        fetchData();
      } else {
        toast.success('Resource updated successfully');
      }
    } catch (error) {
      console.error('Error in updateResource:', error);
      toast.error('An error occurred while updating the resource');
    }
  };

  // Delete a resource from Supabase
  const deleteResource = async (id: string) => {
    try {
      // First, update local state for immediate feedback
      setResources(prevResources => prevResources.filter(resource => resource.id !== id));
      
      // Then, delete from Supabase
      const { error } = await supabase
        .from('resources')
        .delete()
        .eq('id', id);
      
      if (error) {
        console.error('Error deleting resource:', error);
        toast.error('Failed to delete resource from database');
        // Revert local state change if Supabase delete fails
        fetchData();
      } else {
        toast.success('Resource deleted successfully');
      }
    } catch (error) {
      console.error('Error in deleteResource:', error);
      toast.error('An error occurred while deleting the resource');
    }
  };

  // Add a category to Supabase
  const addCategory = async (name: string) => {
    try {
      const newId = uuidv4();
      const order = categories.length;
      
      // First, update local state for immediate feedback
      const newCategory: Category = {
        id: newId,
        name,
        order,
        isActive: true,
      };
      
      setCategories(prevCategories => [...prevCategories, newCategory]);
      
      // Then, save to Supabase
      const { error } = await supabase
        .from('categories')
        .insert({
          id: newId,
          name,
          order,
          is_active: true,
        });
      
      if (error) {
        console.error('Error adding category:', error);
        toast.error('Failed to save category to database');
        // Revert local state change if Supabase save fails
        setCategories(prevCategories => prevCategories.filter(c => c.id !== newId));
      } else {
        toast.success('Category added successfully');
      }
    } catch (error) {
      console.error('Error in addCategory:', error);
      toast.error('An error occurred while adding the category');
    }
  };

  // Update a category in Supabase
  const updateCategory = async (id: string, updates: Partial<Category>) => {
    try {
      // First, update local state for immediate feedback
      setCategories(prevCategories =>
        prevCategories.map(category =>
          category.id === id
            ? { ...category, ...updates }
            : category
        )
      );
      
      // Then, save to Supabase
      const { error } = await supabase
        .from('categories')
        .update({
          name: updates.name,
          order: updates.order,
          is_active: updates.isActive,
        })
        .eq('id', id);
      
      if (error) {
        console.error('Error updating category:', error);
        toast.error('Failed to update category in database');
        // Revert local state change if Supabase save fails
        fetchData();
      } else {
        toast.success('Category updated successfully');
      }
    } catch (error) {
      console.error('Error in updateCategory:', error);
      toast.error('An error occurred while updating the category');
    }
  };

  // Delete a category from Supabase
  const deleteCategory = async (id: string) => {
    try {
      // Check if there are any topics in this category
      const hasTopics = topics.some(topic => topic.category === id);
      
      if (hasTopics) {
        throw new Error("Cannot delete category with existing topics");
      }
      
      // First, update local state for immediate feedback
      setCategories(prevCategories => prevCategories.filter(category => category.id !== id));
      
      // Then, delete from Supabase
      const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', id);
      
      if (error) {
        console.error('Error deleting category:', error);
        toast.error('Failed to delete category from database');
        // Revert local state change if Supabase delete fails
        fetchData();
      } else {
        toast.success('Category deleted successfully');
      }
    } catch (error: any) {
      console.error('Error in deleteCategory:', error);
      toast.error(error.message || 'An error occurred while deleting the category');
      throw error;
    }
  };

  // Reorder a category in Supabase
  const reorderCategory = async (id: string, direction: 'up' | 'down') => {
    try {
      const index = categories.findIndex(c => c.id === id);
      if (
        (direction === 'up' && index === 0) || 
        (direction === 'down' && index === categories.length - 1)
      ) {
        return;
      }

      const newCategories = [...categories];
      const swapIndex = direction === 'up' ? index - 1 : index + 1;
      [newCategories[index], newCategories[swapIndex]] = [newCategories[swapIndex], newCategories[index]];
      
      newCategories.forEach((cat, idx) => {
        cat.order = idx;
      });
      
      // First, update local state for immediate feedback
      setCategories(newCategories);
      
      // Then, update in Supabase
      // We need to update both categories that were swapped
      const cat1 = newCategories[index];
      const cat2 = newCategories[swapIndex];
      
      const { error: error1 } = await supabase
        .from('categories')
        .update({ order: cat1.order })
        .eq('id', cat1.id);
      
      const { error: error2 } = await supabase
        .from('categories')
        .update({ order: cat2.order })
        .eq('id', cat2.id);
      
      if (error1 || error2) {
        console.error('Error reordering categories:', error1 || error2);
        toast.error('Failed to reorder categories in database');
        // Revert local state change if Supabase update fails
        fetchData();
      }
    } catch (error) {
      console.error('Error in reorderCategory:', error);
      toast.error('An error occurred while reordering the categories');
    }
  };

  // Toggle a category active status in Supabase
  const toggleCategoryActive = async (id: string) => {
    try {
      const category = categories.find(c => c.id === id);
      if (!category) return;
      
      const newIsActive = !category.isActive;
      
      // First, update local state for immediate feedback
      setCategories(prevCategories =>
        prevCategories.map(cat =>
          cat.id === id ? { ...cat, isActive: newIsActive } : cat
        )
      );
      
      // Then, update in Supabase
      const { error } = await supabase
        .from('categories')
        .update({ is_active: newIsActive })
        .eq('id', id);
      
      if (error) {
        console.error('Error toggling category active status:', error);
        toast.error('Failed to update category status in database');
        // Revert local state change if Supabase update fails
        fetchData();
      }
    } catch (error) {
      console.error('Error in toggleCategoryActive:', error);
      toast.error('An error occurred while updating the category status');
    }
  };

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
