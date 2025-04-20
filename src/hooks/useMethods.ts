
import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { LearningMethod } from '@/types';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const useMethods = (initialMethods: LearningMethod[] = []) => {
  const [methods, setMethods] = useState<LearningMethod[]>(initialMethods);

  const addMethod = async (method: Omit<LearningMethod, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const newId = uuidv4();
      const now = new Date().toISOString();
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error('You need to be logged in to save data');
        return;
      }
      
      const newMethod: LearningMethod = {
        ...method,
        id: newId,
        createdAt: now,
        updatedAt: now,
      };
      
      setMethods(prevMethods => [...prevMethods, newMethod]);
      
      const { error } = await supabase
        .from('learning_methods')
        .insert({
          id: newId,
          topic_id: method.topicId,
          type: method.type,
          title: method.title,
          link: method.link,
          time_spent: method.timeSpent,
          user_id: user.id
        });
      
      if (error) {
        console.error('Error adding method:', error);
        toast.error('Failed to save method to database');
        setMethods(prevMethods => prevMethods.filter(m => m.id !== newId));
      } else {
        toast.success('Learning method added successfully');
      }
    } catch (error) {
      console.error('Error in addMethod:', error);
      toast.error('An error occurred while adding the learning method');
    }
  };

  const updateMethod = async (id: string, updates: Partial<LearningMethod>) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error('You need to be logged in to update data');
        return;
      }
      
      setMethods(prevMethods =>
        prevMethods.map(method =>
          method.id === id
            ? { ...method, ...updates, updatedAt: new Date().toISOString() }
            : method
        )
      );
      
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
        .eq('id', id)
        .eq('user_id', user.id);
      
      if (error) {
        console.error('Error updating method:', error);
        toast.error('Failed to update method in database');
      } else {
        toast.success('Learning method updated successfully');
      }
    } catch (error) {
      console.error('Error in updateMethod:', error);
      toast.error('An error occurred while updating the learning method');
    }
  };

  const deleteMethod = async (id: string) => {
    try {
      console.log('Deleting method with ID:', id);
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error('You need to be logged in to delete data');
        return;
      }
      
      setMethods(prevMethods => prevMethods.filter(method => method.id !== id));
      
      const { error } = await supabase
        .from('learning_methods')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);
      
      if (error) {
        console.error('Error deleting method:', error);
        toast.error('Failed to delete method from database');
      } else {
        toast.success('Learning method deleted successfully');
      }
    } catch (error) {
      console.error('Error in deleteMethod:', error);
      toast.error('An error occurred while deleting the learning method');
    }
  };

  return {
    methods,
    setMethods,
    addMethod,
    updateMethod,
    deleteMethod
  };
};
