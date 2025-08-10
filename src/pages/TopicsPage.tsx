
import MainLayout from "@/components/layout/MainLayout";
import TopicList from "@/components/topics/TopicList";
import { useEffect } from "react";
import { useLearning } from "@/context/LearningContext";
import { Skeleton } from "@/components/ui/skeleton";

const TopicsPage = () => {
  const { isLoading } = useLearning();

  useEffect(() => {
    const title = 'Learning Topics | Learning Hub';
    document.title = title;

    const desc = 'Learning Topics - Organize and track your learning journey.';
    let meta = document.querySelector('meta[name="description"]') as HTMLMetaElement | null;
    if (!meta) {
      meta = document.createElement('meta');
      meta.name = 'description';
      document.head.appendChild(meta);
    }
    meta.content = desc;

    let link = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!link) {
      link = document.createElement('link');
      link.rel = 'canonical';
      document.head.appendChild(link);
    }
    link.href = window.location.href;
  }, []);

  return (
    <MainLayout>
      <div className="container px-4 py-6 mx-auto max-w-7xl">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-hub-text mb-2">Learning Topics</h1>
          <p className="text-hub-text-muted">Organize and track your learning journey</p>
        </div>
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-full border rounded-lg p-4 bg-white shadow-sm">
                <Skeleton className="h-5 w-2/3 mb-4" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-5/6 mb-6" />
                <Skeleton className="h-2 w-full" />
              </div>
            ))}
          </div>
        ) : (
          <TopicList />
        )}
      </div>
    </MainLayout>
  );
};

export default TopicsPage;
