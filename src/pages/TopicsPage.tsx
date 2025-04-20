
import MainLayout from "@/components/layout/MainLayout";
import TopicList from "@/components/topics/TopicList";

const TopicsPage = () => {
  return (
    <MainLayout>
      <div className="container px-4 py-6 mx-auto max-w-7xl">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-hub-text mb-2">Learning Topics</h1>
          <p className="text-hub-text-muted">Organize and track your learning journey</p>
        </div>
        
        <TopicList />
      </div>
    </MainLayout>
  );
};

export default TopicsPage;
