
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Topic, LearningMethod, JournalEntry, Resource, TopicStatus } from '../types';
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
}

const LearningContext = createContext<LearningContextType | undefined>(undefined);

// Sample data
const sampleTopics: Topic[] = [
  {
    id: '1',
    title: 'React Fundamentals',
    description: 'Core concepts of React including components, props, and state',
    category: 'Web Development',
    status: 'In Progress',
    progress: 60,
    startDate: '2023-04-01',
    targetEndDate: '2023-05-15',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '2',
    title: 'Python Data Analysis',
    description: 'Using pandas and numpy for data manipulation and analysis',
    category: 'Data Science',
    status: 'Learning',
    progress: 30,
    startDate: '2023-03-15',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '3',
    title: 'Cloud Computing Basics',
    description: 'Understanding cloud infrastructure and services',
    category: 'Cloud Computing',
    status: 'To Start',
    progress: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

const sampleMethods: LearningMethod[] = [
  {
    id: '1',
    topicId: '1',
    type: 'Online Course',
    title: 'React - The Complete Guide',
    link: 'https://example.com/react-course',
    timeSpent: 15,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '2',
    topicId: '1',
    type: 'Book',
    title: 'React Design Patterns',
    timeSpent: 8,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

const sampleJournals: JournalEntry[] = [
  {
    id: '1',
    topicId: '1',
    content: 'Today I learned about React hooks and how they simplify state management compared to class components.',
    category: 'Key Takeaways',
    tags: ['hooks', 'state', 'functional components'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

const sampleResources: Resource[] = [
  {
    id: '1',
    topicId: '1',
    title: 'React Hooks Documentation',
    type: 'Documentation',
    url: 'https://reactjs.org/docs/hooks-intro.html',
    notes: 'Official documentation on React hooks with examples',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export const LearningProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [topics, setTopics] = useState<Topic[]>(sampleTopics);
  const [methods, setMethods] = useState<LearningMethod[]>(sampleMethods);
  const [journals, setJournals] = useState<JournalEntry[]>(sampleJournals);
  const [resources, setResources] = useState<Resource[]>(sampleResources);

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
