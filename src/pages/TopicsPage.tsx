
import MainLayout from "@/components/layout/MainLayout";
import TopicList from "@/components/topics/TopicList";

const TopicsPage = () => {
  return (
    <MainLayout>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-hub-text mb-2">Learning Topics</h1>
        <p className="text-hub-text-muted">Organize and track your learning journey</p>
      </div>
      
      <TopicList />
    </MainLayout>
  );
};

export default TopicsPage;
