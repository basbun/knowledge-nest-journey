
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import MethodList from '../methods/MethodList';
import ResourceList from '../resources/ResourceList';
import JournalList from '../journal/JournalList';

interface TopicTabsProps {
  topicId: string;
}

const TopicTabs = ({ topicId }: TopicTabsProps) => {
  return (
    <Tabs defaultValue="methods">
      <TabsList className="mb-4">
        <TabsTrigger value="methods">Learning Methods</TabsTrigger>
        <TabsTrigger value="journal">Journal Entries</TabsTrigger>
        <TabsTrigger value="resources">Resources</TabsTrigger>
      </TabsList>
      
      <TabsContent value="methods">
        <MethodList topicId={topicId} />
      </TabsContent>
      
      <TabsContent value="journal">
        <JournalList topicId={topicId} />
      </TabsContent>
      
      <TabsContent value="resources">
        <ResourceList topicId={topicId} />
      </TabsContent>
    </Tabs>
  );
};

export default TopicTabs;
