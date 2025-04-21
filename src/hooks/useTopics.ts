import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Topic } from '@/types';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const useTopics = (initialTopics: Topic[] = []) => {
  const [topics, setTopics] = useState<Topic[]>(initialTopics);

  const addTopic = async (topic: Omit<Topic, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const newId = uuidv4();
      const now = new Date().toISOString();
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error('You need to be logged in to save data');
        return;
      }
      
      const newTopic: Topic = {
        ...topic,
        id: newId,
        createdAt: now,
        updatedAt: now,
      };
      
      setTopics(prevTopics => [...prevTopics, newTopic]);
      
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
          user_id: user.id
        });
      
      if (error) {
        console.error('Error adding topic:', error);
        toast.error('Failed to save topic to database');
        setTopics(prevTopics => prevTopics.filter(t => t.id !== newId));
      } else {
        toast.success('Topic added successfully');
      }
    } catch (error) {
      console.error('Error in addTopic:', error);
      toast.error('An error occurred while adding the topic');
    }
  };

  const updateTopic = async (id: string, updates: Partial<Topic>) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error('You need to be logged in to update data');
        return;
      }
      
      setTopics(prevTopics =>
        prevTopics.map(topic =>
          topic.id === id
            ? { ...topic, ...updates, updatedAt: new Date().toISOString() }
            : topic
        )
      );
      
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
        .eq('id', id)
        .eq('user_id', user.id);
      
      if (error) {
        console.error('Error updating topic:', error);
        toast.error('Failed to update topic in database');
      } else {
        toast.success('Topic updated successfully');
      }
    } catch (error) {
      console.error('Error in updateTopic:', error);
      toast.error('An error occurred while updating the topic');
    }
  };

  const deleteTopic = async (id: string) => {
    try {
      console.log('Deleting topic with ID:', id);
      
      const { data: { user } } = await supabase.auth.getUser();
      
      setTopics(prevTopics => prevTopics.filter(topic => topic.id !== id));
      
      if (user) {
        const { error } = await supabase
          .from('topics')
          .delete()
          .eq('id', id)
          .eq('user_id', user.id);
        
        if (error) {
          console.error('Error deleting topic from database:', error);
          toast.error(`Failed to delete topic from database: ${error.message || ''}`);
        } else {
          toast.success('Topic deleted successfully');
        }
      } else {
        toast.success('Topic deleted from local storage');
      }
    } catch (error) {
      console.error('Error in deleteTopic:', error);
      toast.error('An error occurred while deleting the topic');
    }
  };

  return {
    topics,
    setTopics,
    addTopic,
    updateTopic,
    deleteTopic
  };
};
