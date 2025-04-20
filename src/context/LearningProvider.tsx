
import React, { useState, ReactNode } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { LearningContext } from './learningContext';
import { Topic, LearningMethod, JournalEntry, Resource, Category } from '../types';
import { initialCategories, initialTopics, initialMethods, initialJournals, initialResources } from './learningInitialState';

export const LearningProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [topics, setTopics] = useState<Topic[]>(initialTopics);
  const [methods, setMethods] = useState<LearningMethod[]>(initialMethods);
  const [journals, setJournals] = useState<JournalEntry[]>(initialJournals);
  const [resources, setResources] = useState<Resource[]>(initialResources);
  const [categories, setCategories] = useState<Category[]>(initialCategories);

  const addTopic = (topic: Omit<Topic, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newTopic: Topic = {
      ...topic,
      id: uuidv4(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setTopics([...topics, newTopic]);
  };

  const updateTopic = (id: string, updates: Partial<Topic>) => {
    setTopics(
      topics.map((topic) =>
        topic.id === id
          ? { ...topic, ...updates, updatedAt: new Date().toISOString() }
          : topic
      )
    );
  };

  const deleteTopic = (id: string) => {
    setTopics(topics.filter((topic) => topic.id !== id));
    setMethods(methods.filter((method) => method.topicId !== id));
    setJournals(journals.filter((journal) => journal.topicId !== id));
    setResources(resources.filter((resource) => resource.topicId !== id));
  };

  const addMethod = (method: Omit<LearningMethod, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newMethod: LearningMethod = {
      ...method,
      id: uuidv4(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setMethods([...methods, newMethod]);
  };

  const updateMethod = (id: string, updates: Partial<LearningMethod>) => {
    setMethods(
      methods.map((method) =>
        method.id === id
          ? { ...method, ...updates, updatedAt: new Date().toISOString() }
          : method
      )
    );
  };

  const deleteMethod = (id: string) => {
    setMethods(methods.filter((method) => method.id !== id));
  };

  const addJournal = (journal: Omit<JournalEntry, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newJournal: JournalEntry = {
      ...journal,
      id: uuidv4(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setJournals([...journals, newJournal]);
  };

  const updateJournal = (id: string, updates: Partial<JournalEntry>) => {
    setJournals(
      journals.map((journal) =>
        journal.id === id
          ? { ...journal, ...updates, updatedAt: new Date().toISOString() }
          : journal
      )
    );
  };

  const deleteJournal = (id: string) => {
    setJournals(journals.filter((journal) => journal.id !== id));
  };

  const addResource = (resource: Omit<Resource, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newResource: Resource = {
      ...resource,
      id: uuidv4(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setResources([...resources, newResource]);
  };

  const updateResource = (id: string, updates: Partial<Resource>) => {
    setResources(
      resources.map((resource) =>
        resource.id === id
          ? { ...resource, ...updates, updatedAt: new Date().toISOString() }
          : resource
      )
    );
  };

  const deleteResource = (id: string) => {
    setResources(resources.filter((resource) => resource.id !== id));
  };

  const addCategory = (name: string) => {
    const newCategory: Category = {
      id: uuidv4(),
      name,
      order: categories.length,
      isActive: true,
    };
    setCategories(prevCategories => [...prevCategories, newCategory]);
  };

  const updateCategory = (id: string, updates: Partial<Category>) => {
    setCategories(
      categories.map((category) =>
        category.id === id ? { ...category, ...updates } : category
      )
    );
  };

  const deleteCategory = (id: string) => {
    // Check if there are any topics in this category
    const hasTopics = topics.some(topic => topic.category === id);
    
    if (hasTopics) {
      throw new Error("Cannot delete category with existing topics");
    }
    
    setCategories(categories.filter((category) => category.id !== id));
  };

  const reorderCategory = (id: string, direction: 'up' | 'down') => {
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
  };

  const toggleCategoryActive = (id: string) => {
    setCategories(
      categories.map((category) =>
        category.id === id ? { ...category, isActive: !category.isActive } : category
      )
    );
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
      }}
    >
      {children}
    </LearningContext.Provider>
  );
};
