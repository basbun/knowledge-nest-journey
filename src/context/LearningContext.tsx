import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Topic, LearningMethod, JournalEntry, Resource, Category } from '../types';
import { v4 as uuidv4 } from 'uuid';

interface LearningContextType {
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

const LearningContext = createContext<LearningContextType | undefined>(undefined);

const initialCategories: Category[] = [
  { id: '1', name: 'Web Development', order: 0, isActive: true },
  { id: '2', name: 'Languages', order: 1, isActive: true },
  { id: '3', name: 'Design', order: 2, isActive: true },
];

const initialTopics: Topic[] = [
  {
    id: '1',
    title: 'React Fundamentals',
    description: 'Learning React basics, components, state management, and hooks',
    category: '1',
    status: 'In Progress',
    progress: 60,
    startDate: '2024-03-01',
    targetEndDate: '2024-05-01',
    createdAt: '2024-03-01T10:00:00Z',
    updatedAt: '2024-03-15T14:30:00Z',
  },
  {
    id: '2',
    title: 'Japanese N5 Level',
    description: 'Basic Japanese language skills including hiragana, katakana, and basic kanji',
    category: '2',
    status: 'Not Started',
    progress: 0,
    startDate: '2024-04-01',
    targetEndDate: '2024-08-01',
    createdAt: '2024-03-20T09:00:00Z',
    updatedAt: '2024-03-20T09:00:00Z',
  },
  {
    id: '3',
    title: 'UI/UX Principles',
    description: 'Learning user interface design principles and user experience best practices',
    category: '3',
    status: 'Completed',
    progress: 100,
    startDate: '2024-02-01',
    targetEndDate: '2024-03-15',
    createdAt: '2024-02-01T08:00:00Z',
    updatedAt: '2024-03-15T16:45:00Z',
  }
];

const initialMethods: LearningMethod[] = [
  {
    id: '1',
    topicId: '1',
    type: 'Online Course',
    title: 'React Complete Guide',
    link: 'https://react-course.example.com',
    timeSpent: 480,
    createdAt: '2024-03-01T10:30:00Z',
    updatedAt: '2024-03-15T11:20:00Z',
  },
  {
    id: '2',
    topicId: '2',
    type: 'Textbook',
    title: 'Genki I Textbook',
    timeSpent: 120,
    createdAt: '2024-03-20T09:15:00Z',
    updatedAt: '2024-03-20T09:15:00Z',
  }
];

const initialJournals: JournalEntry[] = [
  {
    id: '1',
    topicId: '1',
    content: 'Learned about React hooks today. useState and useEffect are powerful tools for managing component state and side effects.',
    category: 'Progress Update',
    tags: ['react', 'hooks', 'frontend'],
    createdAt: '2024-03-10T15:20:00Z',
    updatedAt: '2024-03-10T15:20:00Z',
  },
  {
    id: '2',
    topicId: '3',
    content: 'Completed the UI/UX course! Key takeaways: Always design with user needs in mind, test early and often, and iterate based on feedback.',
    category: 'Reflection',
    tags: ['design', 'ux', 'completion'],
    createdAt: '2024-03-15T16:45:00Z',
    updatedAt: '2024-03-15T16:45:00Z',
  }
];

const initialResources: Resource[] = [
  {
    id: '1',
    topicId: '1',
    title: 'React Official Documentation',
    type: 'Documentation',
    url: 'https://react.dev',
    notes: 'Comprehensive guide to React concepts and APIs',
    createdAt: '2024-03-01T11:00:00Z',
    updatedAt: '2024-03-01T11:00:00Z',
  },
  {
    id: '2',
    topicId: '2',
    title: 'Japanese Learning Sheet',
    type: 'Study Material',
    notes: 'Hiragana and Katakana practice sheets with common phrases',
    createdAt: '2024-03-20T09:30:00Z',
    updatedAt: '2024-03-20T09:30:00Z',
  },
  {
    id: '3',
    topicId: '3',
    title: 'UI Design Principles Guide',
    type: 'Article',
    url: 'https://example.com/ui-principles',
    notes: 'Comprehensive overview of fundamental UI design principles',
    createdAt: '2024-02-05T13:20:00Z',
    updatedAt: '2024-02-05T13:20:00Z',
  }
];

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
    if (topics.some(topic => topic.category === id)) {
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

export const useLearning = () => {
  const context = useContext(LearningContext);
  if (!context) {
    throw new Error('useLearning must be used within a LearningProvider');
  }
  return context;
};
