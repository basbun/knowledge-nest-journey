
import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { JournalEntry } from '@/types';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const useJournals = (initialJournals: JournalEntry[] = []) => {
  const [journals, setJournals] = useState<JournalEntry[]>(initialJournals);

  const addJournal = async (journal: Omit<JournalEntry, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const newId = uuidv4();
      const now = new Date().toISOString();
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error('You need to be logged in to save data');
        return;
      }
      
      const newJournal: JournalEntry = {
        ...journal,
        id: newId,
        createdAt: now,
        updatedAt: now,
      };
      
      setJournals(prevJournals => [...prevJournals, newJournal]);
      
      const { error } = await supabase
        .from('journal_entries')
        .insert({
          id: newId,
          topic_id: journal.topicId,
          content: journal.content,
          tags: journal.tags,
          category: journal.category || '',
          user_id: user.id
        });
      
      if (error) {
        console.error('Error adding journal:', error);
        toast.error('Failed to save journal entry to database');
        setJournals(prevJournals => prevJournals.filter(j => j.id !== newId));
      } else {
        toast.success('Journal entry added successfully');
      }
    } catch (error) {
      console.error('Error in addJournal:', error);
      toast.error('An error occurred while adding the journal entry');
    }
  };

  const updateJournal = async (id: string, updates: Partial<JournalEntry>) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error('You need to be logged in to update data');
        return;
      }
      
      setJournals(prevJournals =>
        prevJournals.map(journal =>
          journal.id === id
            ? { ...journal, ...updates, updatedAt: new Date().toISOString() }
            : journal
        )
      );
      
      const { error } = await supabase
        .from('journal_entries')
        .update({
          topic_id: updates.topicId,
          content: updates.content,
          tags: updates.tags,
          category: updates.category || '',
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .eq('user_id', user.id);
      
      if (error) {
        console.error('Error updating journal:', error);
        toast.error('Failed to update journal entry in database');
      } else {
        toast.success('Journal entry updated successfully');
      }
    } catch (error) {
      console.error('Error in updateJournal:', error);
      toast.error('An error occurred while updating the journal entry');
    }
  };

  const deleteJournal = async (id: string) => {
    try {
      console.log('Deleting journal with ID:', id);
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error('You need to be logged in to delete data');
        return;
      }
      
      setJournals(prevJournals => prevJournals.filter(journal => journal.id !== id));
      
      const { error } = await supabase
        .from('journal_entries')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);
      
      if (error) {
        console.error('Error deleting journal:', error);
        toast.error('Failed to delete journal entry from database');
      } else {
        toast.success('Journal entry deleted successfully');
      }
    } catch (error) {
      console.error('Error in deleteJournal:', error);
      toast.error('An error occurred while deleting the journal entry');
    }
  };

  return {
    journals,
    setJournals,
    addJournal,
    updateJournal,
    deleteJournal
  };
};
