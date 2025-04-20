
import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Category } from '@/types';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const useCategories = (initialCategories: Category[] = []) => {
  const [categories, setCategories] = useState<Category[]>(initialCategories);

  const addCategory = async (name: string) => {
    try {
      const newId = uuidv4();
      const order = categories.length;
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error('You need to be logged in to save data');
        return;
      }
      
      const newCategory: Category = {
        id: newId,
        name,
        order,
        isActive: true,
      };
      
      setCategories(prevCategories => [...prevCategories, newCategory]);
      
      const { error } = await supabase
        .from('categories')
        .insert({
          id: newId,
          name,
          order,
          is_active: true,
          user_id: user.id
        });
      
      if (error) {
        console.error('Error adding category:', error);
        toast.error('Failed to save category to database');
        setCategories(prevCategories => prevCategories.filter(c => c.id !== newId));
      } else {
        toast.success('Category added successfully');
      }
    } catch (error) {
      console.error('Error in addCategory:', error);
      toast.error('An error occurred while adding the category');
    }
  };

  const updateCategory = async (id: string, updates: Partial<Category>) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error('You need to be logged in to update data');
        return;
      }
      
      setCategories(prevCategories =>
        prevCategories.map(category =>
          category.id === id
            ? { ...category, ...updates }
            : category
        )
      );
      
      const { error } = await supabase
        .from('categories')
        .update({
          name: updates.name,
          order: updates.order,
          is_active: updates.isActive,
        })
        .eq('id', id)
        .eq('user_id', user.id);
      
      if (error) {
        console.error('Error updating category:', error);
        toast.error('Failed to update category in database');
      } else {
        toast.success('Category updated successfully');
      }
    } catch (error) {
      console.error('Error in updateCategory:', error);
      toast.error('An error occurred while updating the category');
    }
  };

  const deleteCategory = async (id: string) => {
    try {
      console.log('Deleting category with ID:', id);
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error('You need to be logged in to delete data');
        return;
      }
      
      setCategories(prevCategories => prevCategories.filter(category => category.id !== id));
      
      const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);
      
      if (error) {
        console.error('Error deleting category:', error);
        toast.error('Failed to delete category from database');
      } else {
        toast.success('Category deleted successfully');
      }
    } catch (error) {
      console.error('Error in deleteCategory:', error);
      toast.error('An error occurred while deleting the category');
    }
  };

  const reorderCategory = async (id: string, direction: 'up' | 'down') => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error('You need to be logged in to update data');
        return;
      }
      
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
      
      setCategories(newCategories);
      
      const cat1 = newCategories[index];
      const cat2 = newCategories[swapIndex];
      
      const { error: error1 } = await supabase
        .from('categories')
        .update({ order: cat1.order })
        .eq('id', cat1.id)
        .eq('user_id', user.id);
      
      const { error: error2 } = await supabase
        .from('categories')
        .update({ order: cat2.order })
        .eq('id', cat2.id)
        .eq('user_id', user.id);
      
      if (error1 || error2) {
        console.error('Error reordering categories:', error1 || error2);
        toast.error('Failed to reorder categories in database');
      }
    } catch (error) {
      console.error('Error in reorderCategory:', error);
      toast.error('An error occurred while reordering the categories');
    }
  };

  const toggleCategoryActive = async (id: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error('You need to be logged in to update data');
        return;
      }
      
      const category = categories.find(c => c.id === id);
      if (!category) return;
      
      const newIsActive = !category.isActive;
      
      setCategories(prevCategories =>
        prevCategories.map(cat =>
          cat.id === id ? { ...cat, isActive: newIsActive } : cat
        )
      );
      
      const { error } = await supabase
        .from('categories')
        .update({ is_active: newIsActive })
        .eq('id', id)
        .eq('user_id', user.id);
      
      if (error) {
        console.error('Error toggling category active status:', error);
        toast.error('Failed to update category status in database');
      }
    } catch (error) {
      console.error('Error in toggleCategoryActive:', error);
      toast.error('An error occurred while updating the category status');
    }
  };

  return {
    categories,
    setCategories,
    addCategory,
    updateCategory,
    deleteCategory,
    reorderCategory,
    toggleCategoryActive
  };
};
