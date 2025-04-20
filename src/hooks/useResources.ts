
import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Resource } from '@/types';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const useResources = (initialResources: Resource[] = []) => {
  const [resources, setResources] = useState<Resource[]>(initialResources);

  const addResource = async (resource: Omit<Resource, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const newId = uuidv4();
      const now = new Date().toISOString();
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error('You need to be logged in to save data');
        return;
      }
      
      const newResource: Resource = {
        ...resource,
        id: newId,
        createdAt: now,
        updatedAt: now,
        tags: resource.tags || [],
      };
      
      setResources(prevResources => [...prevResources, newResource]);
      
      const { error } = await supabase
        .from('resources')
        .insert({
          id: newId,
          topic_id: resource.topicId,
          title: resource.title,
          url: resource.url,
          notes: resource.notes,
          type: resource.type || '',
          tags: resource.tags || [],
          user_id: user.id
        });
      
      if (error) {
        console.error('Error adding resource:', error);
        toast.error('Failed to save resource to database');
        setResources(prevResources => prevResources.filter(r => r.id !== newId));
      } else {
        toast.success('Resource added successfully');
      }
    } catch (error) {
      console.error('Error in addResource:', error);
      toast.error('An error occurred while adding the resource');
    }
  };

  const updateResource = async (id: string, updates: Partial<Resource>) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error('You need to be logged in to update data');
        return;
      }
      
      setResources(prevResources =>
        prevResources.map(resource =>
          resource.id === id
            ? { 
                ...resource, 
                ...updates, 
                updatedAt: new Date().toISOString(),
                tags: updates.tags || resource.tags || []
              }
            : resource
        )
      );
      
      const { error } = await supabase
        .from('resources')
        .update({
          topic_id: updates.topicId,
          title: updates.title,
          url: updates.url,
          notes: updates.notes,
          type: updates.type || '',
          tags: updates.tags || [],
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .eq('user_id', user.id);
      
      if (error) {
        console.error('Error updating resource:', error);
        toast.error('Failed to update resource in database');
      } else {
        toast.success('Resource updated successfully');
      }
    } catch (error) {
      console.error('Error in updateResource:', error);
      toast.error('An error occurred while updating the resource');
    }
  };

  const deleteResource = async (id: string) => {
    try {
      console.log('Deleting resource with ID:', id);
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error('You need to be logged in to delete data');
        return;
      }
      
      setResources(prevResources => prevResources.filter(resource => resource.id !== id));
      
      const { error } = await supabase
        .from('resources')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);
      
      if (error) {
        console.error('Error deleting resource:', error);
        toast.error('Failed to delete resource from database');
      } else {
        toast.success('Resource deleted successfully');
      }
    } catch (error) {
      console.error('Error in deleteResource:', error);
      toast.error('An error occurred while deleting the resource');
    }
  };

  return {
    resources,
    setResources,
    addResource,
    updateResource,
    deleteResource
  };
};
