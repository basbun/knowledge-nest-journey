
import { Topic, LearningMethod, JournalEntry, Resource, Category } from '../types';

export const initialCategories: Category[] = [
  { id: '1', name: 'Web Development', order: 0, isActive: true },
  { id: '2', name: 'Languages', order: 1, isActive: true },
  { id: '3', name: 'Design', order: 2, isActive: true },
];

export const initialTopics: Topic[] = [
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

export const initialMethods: LearningMethod[] = [
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

export const initialJournals: JournalEntry[] = [
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

export const initialResources: Resource[] = [
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
