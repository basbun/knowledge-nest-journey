
import { createContext, useContext } from 'react';
import { Topic, LearningMethod, JournalEntry, Resource, Category } from '../types';

export interface LearningContextType {
  topics: Topic[];
  methods: LearningMethod[];
  journals: JournalEntry[];
  resources: Resource[];
  addTopic: (topic: Omit<Topic, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateTopic: (id: string, updates: Partial<Topic>) => void;
  deleteTopic: (id: string) => void;
  addMethod: (method: Omit<LearningMethod, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateMethod: (id: string, updates: Partial<LearningMethod>) => void;
  deleteMethod: (id: string) => void;
  addJournal: (journal: Omit<JournalEntry, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateJournal: (id: string, updates: Partial<JournalEntry>) => void;
  deleteJournal: (id: string) => void;
  addResource: (resource: Omit<Resource, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateResource: (id: string, updates: Partial<Resource>) => void;
  deleteResource: (id: string) => void;
  categories: Category[];
  addCategory: (name: string) => void;
  updateCategory: (id: string, updates: Partial<Category>) => void;
  deleteCategory: (id: string) => void;
  reorderCategory: (id: string, direction: 'up' | 'down') => void;
  toggleCategoryActive: (id: string) => void;
}

export const LearningContext = createContext<LearningContextType | undefined>(undefined);

export const useLearning = () => {
  const context = useContext(LearningContext);
  if (!context) {
    throw new Error('useLearning must be used within a LearningProvider');
  }
  return context;
};
