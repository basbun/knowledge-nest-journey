export type TopicStatus = 'Not Started' | 'In Progress' | 'Completed';

export interface Topic {
  id: string;
  title: string;
  description: string;
  category: string;
  status: TopicStatus;
  progress: number;
  startDate?: string;
  targetEndDate?: string;
  parentId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface LearningMethod {
  id: string;
  topicId: string;
  type: string;
  title: string;
  link?: string;
  timeSpent?: number;
  createdAt: string;
  updatedAt: string;
}

export interface JournalEntry {
  id: string;
  topicId: string;
  content: string;
  category: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Resource {
  id: string;
  topicId: string;
  title: string;
  type: string;
  url?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}
